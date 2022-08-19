require('dotenv').config();

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация. Отсутствует токен.'));
  }
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return next(new UnauthorizedError('Необходима авторизация. Отсутствует токен.'));
//   }
//
//   const token = authorization.replace('Bearer ', '');
//   let payload;
//
//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     return next(new UnauthorizedError('Необходима авторизация. Отсутствует токен.'));
//   }
//
//   req.user = payload; // записываем пейлоуд в объект запроса
//
//   return next(); // пропускаем запрос дальше
// };
