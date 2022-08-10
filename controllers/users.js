const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.'});
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.'});
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.'});
      }
      return res.send(user)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректный _id пользователя.'});
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

//.catch(err => res.status(500).send({ message: `Произошла ошибка ${err.name} c текстом ${err.message}` }));


module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
          new: true,
          runValidators: true
      }
  )
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.'});
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.'});
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
          new: true,
          runValidators: true
      }
  )
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.'});
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.'});
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};
