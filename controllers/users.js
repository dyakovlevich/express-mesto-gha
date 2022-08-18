require('dotenv').config();

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const castErrorCode = 400;
const notFoundErrorCode = 404;
const defaultErrorCode = 500;

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        return res.status(notFoundErrorCode).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send(err));

  // User.create({
  //   name, about, avatar, email, password,
  // })
  //   .then((user) => res.send(user))
  //   .catch((err) => {
  //     if (err.name === 'ValidationError') {
  //       return res.status(castErrorCode).send({ message: 'Переданы некорректные данные при создании пользователя.' });
  //     }
  //     return res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' });
  //   });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(notFoundErrorCode).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(castErrorCode).send({ message: 'Переданы некорректный _id пользователя.' });
      }
      return res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(notFoundErrorCode).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(castErrorCode).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(notFoundErrorCode).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(castErrorCode).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch(next);
};
