const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser, getUserById, getAllUsers, updateUser, updateUserAvatar,
} = require('../controllers/users');
const { isLinkRegex } = require('../utils/isLink');

router.get('/me', getCurrentUser);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

router.get('/', getAllUsers);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(isLinkRegex).required(),
    }),
  }),
  updateUserAvatar,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

module.exports = router;
