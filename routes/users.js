const router = require('express').Router();
const {
  createUser, getUserById, getAllUsers, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/:userId', getUserById);
router.get('/', getAllUsers);
router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUser);

module.exports = router;
