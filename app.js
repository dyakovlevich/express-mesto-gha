const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

// Подключаем логгер
app.use(requestLogger);

// роуты, не требующие авторизации,
// например, регистрация и логин
app.use('/', require('./routes/auth'));

// авторизация
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Ошибки 404.
app.all('*', (req, res, next) => next(new NotFoundError('Не найдено.')));

// подключаем логгер ошибок
app.use(errorLogger);

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// наш централизованный обработчик
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
