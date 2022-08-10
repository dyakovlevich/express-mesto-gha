const Card = require('../models/card');

const castErrorCode = 400;
const notFoundErrorCode = 404;
const defaultErrorCode = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(castErrorCode).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(() => res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(notFoundErrorCode).send({ message: ' Карточка с указанным _id не найдена.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(castErrorCode).send({ message: 'Переданы некорректные данные при удалении карточки.' });
      }
      return res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(notFoundErrorCode).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(castErrorCode).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(notFoundErrorCode).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(castErrorCode).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res.status(defaultErrorCode).send({ message: 'Ошибка по умолчанию.' });
    });
};
