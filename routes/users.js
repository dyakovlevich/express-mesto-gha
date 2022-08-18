const router = require('express').Router();
const {
  getCurrentUser, getUserById, getAllUsers, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/:userId', getUserById);
router.get('/me', getCurrentUser);
router.get('/', getAllUsers);
router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUser);


module.exports = router;
