const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'переданы некорректные данные'});
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

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
    .catch(user => res.status(500).send({ message: "Данные не прошли валидацию. Либо произошло что-то совсем немыслимое" }));
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
    .catch(user => res.status(500).send({ message: "Данные не прошли валидацию. Либо произошло что-то совсем немыслимое" }));
};
