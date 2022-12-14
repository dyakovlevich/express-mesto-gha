const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { isLinkRegex } = require('../utils/isLink');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: isLinkRegex,
      message: 'Неверный формат URL аватара',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неверный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(
              new UnauthorizedError('Неправильные почта или пароль'),
            );
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
