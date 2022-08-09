const router = require('express').Router();
const { createCard, getAllCards, deleteCardById } = require('../controllers/cards');

// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору

router.post('/', createCard);
router.get('/', getAllCards);
router.delete('/:cardId', deleteCardById);

module.exports = router;