const router = require('express').Router();
const { createUser, getUserById, getAllUsers } = require('../controllers/users');

// подключаем мидлвары, роуты и всё остальное...
// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя

router.post('/', createUser );
router.get('/:userId', getUserById);
router.get('/', getAllUsers);

module.exports = router;