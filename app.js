const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');

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

// роуты, не требующие авторизации,
// например, регистрация и логин

app.use('/', require('./routes/auth'));

// авторизация
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Ошибки 404.
app.all('*', (req, res) => res.status(404).send({ message: 'Не найдено.' }));

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// наш централизованный обработчик
app.use((err, req, res, next) => {
  const { statusCode = 499, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? message
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
