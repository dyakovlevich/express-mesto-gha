const router = require('express').Router();
const {
  createCard, getAllCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getAllCards);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;