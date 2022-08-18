const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { errors } = require('celebrate');

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
app.post('/signup', createUser);
app.post('/signin', login);

// авторизация
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Ошибки 404.
app.all('*', (req, res) => res.status(404).send({ message: 'Не найдено.' }));

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// наш централизованный обработчик
// app.use((err, req, res, next) => {
//   // ...
// });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
