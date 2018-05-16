const fs = require('fs');
const { relative, resolve } = require('path');
const got = require('got');
const writePkg = require('write-pkg');
const netrc = require('netrc');
const url = require('url');
const tmp = require('tmp');
const glob = require('glob');
const FormData = require('form-data');
const Webpack = require('webpack');

const Logger = require('./logger');
const Utils = require('./utils');
const webPackConfig = require('./middleware/webpack/config');

const apiURL = process.env.API_URL || 'https://api.vapid.com';
const apiHostname = url.parse(apiURL).hostname;
const userNetrc = netrc();

let pjson;
let pjsonPath;
let credentials;

/**
 * Deploys to the Vapid hosting service
 */
/* eslint-disable class-methods-use-this */
class Deployer {
  /**
   * @param {string} cwd - path to website
   */
  constructor(paths) {
    this.paths = paths;
    pjsonPath = resolve(paths.root, 'package.json');
    pjson = require(pjsonPath); // eslint-disable-line global-require, import/no-dynamic-require
    credentials = userNetrc[apiHostname];
  }

  /**
   * Determines if user has stored Vapid credentials
   *
   * @return {boolean}
   */
  get loggedIn() {
    return !Utils.isEmpty(credentials);
  }

  get hasSite() {
    const { site: siteId } = pjson.vapid;
    return siteId !== undefined;
  }

  /**
   * Login to Vapid, and store the assigned API key
   *
   * @param {string} email
   * @param {password} password
   */
  async login(email, password) {
    const endpoint = url.resolve(apiURL, '/auth/me');
    const body = { email, password };
    const response = await got.post(endpoint, { body, json: true });

    credentials = {
      login: email,
      password: response.body.api_key,
    };

    userNetrc[apiHostname] = credentials;
    netrc.save(userNetrc);
  }

  /**
   * Deploy the site
   */
  async deploy(tree, Section, deployContent = false) {
    const wwwDir = this.paths.www;
    const { name: tmpDir } = tmp.dirSync();
    let { site: siteId } = pjson.vapid;
    let content = {};

    // Compile tmp files
    Utils.copyFiles(wwwDir, tmpDir);
    await _compileAssets(wwwDir, tmpDir);

    // Create site if necessary
    if (!siteId) {
      siteId = await _createSite();
      _updatePjson(siteId);

      if (deployContent) {
        content = await _content(Section);

        if (fs.existsSync(this.paths.uploads)) {
          Utils.copyFiles(this.paths.uploads, resolve(tmpDir, 'uploads'));
        }
      }
    }

    // Upload
    const manifest = _generateManifest(tmpDir);
    const presignedPosts = await _getPresignedPosts(siteId, manifest);
    await _uploadFiles(tmpDir, manifest, presignedPosts);

    // Update site
    const site = await _updateSite(siteId, tree, presignedPosts, content);
    Logger.info('Upload complete.');
    Logger.extra(`View your website at ${site.url}`);

    // Clean up
    Utils.removeFiles(tmpDir);
  }
}

/**
 * @private
 *
 * Create a new site
 *
 * @return {string} site - UUID of the website
 */
async function _createSite() {
  const endpoint = url.resolve(apiURL, '/sites');
  const response = await got.post(endpoint, { json: true, headers: _bearer() });

  return response.body.site.id;
}

/**
 * Save the site UUID into package.json
 *
 * @param {string} siteId
 */
function _updatePjson(siteId) {
  pjson.vapid.site = siteId;
  writePkg.sync(pjsonPath, pjson);
}

/**
 * Generates the site manifest
 *
 * @param {string} dir
 * @return {Object}
 */
function _generateManifest(dir) {
  const manifest = {};

  glob.sync(resolve(dir, '**/!(*.pack.+(s[ac]ss|js))'), { mark: true }).forEach((file) => {
    if (Utils.endsWith(file, '/')) { return; }

    const relativePath = relative(dir, file);
    manifest[relativePath] = Utils.checksum(file);
  });

  return manifest;
}

/**
 * Gets presigned posts
 *
 * @param {string} siteId
 * @param {Object} manifest
 * @return {Object}
 */
async function _getPresignedPosts(siteId, manifest) {
  const endpoint = url.resolve(apiURL, `/sites/${siteId}/presigned_posts`);
  const body = { manifest };
  const response = await got.post(endpoint, { body, json: true, headers: _bearer() });

  return response.body.presignedPosts;
}

/**
 * Upload files to S3
 *
 * @param {Object} manifest
 * @param {Object} presignedPosts
 */
async function _uploadFiles(dir, manifest, presignedPosts) {
  const paths = Object.keys(manifest);
  const promises = [];

  paths.forEach(async (path) => {
    const post = presignedPosts[path];
    const filePath = resolve(dir, path);
    const form = new FormData();

    Utils.forEach(post.fields, (value, key) => { form.append(key, value); });
    form.append('file', fs.createReadStream(filePath));

    Logger.tagged('uploading', path);
    const promise = got.post(post.url, { body: form });
    promises.push(promise);
  });

  await Promise.all(promises);
}

/**
 * Update the site
 *
 * @param {string} siteId
 * @param {Object} manifest
 */
async function _updateSite(siteId, tree, presignedPosts, content) {
  const endpoint = url.resolve(apiURL, `/sites/${siteId}`);
  const siteManifest = Utils.reduce(presignedPosts, (memo, value, key) => {
    /* eslint-disable-next-line no-param-reassign */
    memo[key] = relative(`sites/${siteId}`, value.fields.key);
    return memo;
  }, {});
  const body = { tree, content, manifest: siteManifest };
  const response = await got.post(endpoint, { body, json: true, headers: _bearer() });
  return response.body.site;
}

/**
 * Gathers content
 *
 * @param {Object} Section
 * @return {Object} content
 */
async function _content(Section) {
  const contentSections = await Section.scope('content').findAll({ include: 'records' });
  return Utils.reduce(contentSections, (memo, section) => {
    /* eslint-disable-next-line no-param-reassign */
    memo[section.name] = Utils.map(section.records, record => record.get('content'));
    return memo;
  }, {});
}

/**
 * Compiles Webpack assets
 */
async function _compileAssets(wwwDir, tmpDir) {
  const config = webPackConfig('production', tmpDir, wwwDir, tmpDir);
  const compiler = Webpack(config);

  await new Promise((_resolve, _reject) => {
    compiler.run((err) => {
      if (err) { _reject(err); }
      _resolve();
    });
  });
}

/**
 * Headers
 */
function _bearer() {
  return {
    authorization: `Bearer ${credentials.password}`,
  };
}

module.exports = Deployer;
