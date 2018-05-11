const bcrypt = require('bcrypt');

module.exports = (sequelize, DataType) => {
  /*
   * User model for authentication
   */
  const User = sequelize.define('User', {
    /**
     * Attributes
     */
    email: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [3, 255],
      },
    },

    password_digest: {
      type: DataType.STRING,
      validate: {
        notEmpty: true,
      },
    },

    password: {
      type: DataType.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255],
      },
    },
  }, {
    /**
     * Hooks
     */
    hooks: {
      /**
       * Encrypt password, so we don't store as plain text
       *
       * @params {User}
       */
      beforeCreate: (user) => {
        /* eslint-disable no-param-reassign */
        user.email = user.email.toLowerCase();
        user.password_digest = bcrypt.hashSync(user.password, 10);
        /* eslint-enable no-param-reassign */
      },
    },

    /**
     * Options
     */
    underscored: true,
    tableName: 'users',
    timestamps: true,
    indexes: [{ unique: true, fields: ['email'] }],
  });

  /*
   * INSTANCE METHODS
   */

  /**
   * Compares a plain text password to an encrypted one stored in the DB
   *
   * @param {string} password - unencryped
   * @return {boolean} result of the comparison
   */
  User.prototype.authenticate = function authenticate(password) {
    if (bcrypt.compareSync(password, this.password_digest)) {
      return this;
    }

    return false;
  };

  return User;
};
