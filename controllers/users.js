const User = require('../models/user');

const castErrorCode = 400;
const notFoundErrorCode = 404;
const defaultErrorCode = 500;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(castErrorCode).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' });
    });
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
