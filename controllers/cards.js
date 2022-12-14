const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const deleteCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => res.send(card))
      .catch(next);
  };

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) next(new NotFoundError('Карточки не существует'));
      if (req.user._id === card.owner.toString()) {
        return deleteCard();
      }
      return next(new ForbiddenError('Вы не являетесь владельцем карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Передан некорректный _id карточки'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточки не существует'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Передан некорректный _id карточки'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточки не существует'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Передан некорректный _id карточки'));
      }
      return next(err);
    });
};
