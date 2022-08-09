const router = require('express').Router();
const { createCard, getAllCards, deleteCardById, likeCard, dislikeCard } = require('../controllers/cards');

// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору

router.post('/', createCard);
router.get('/', getAllCards);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;