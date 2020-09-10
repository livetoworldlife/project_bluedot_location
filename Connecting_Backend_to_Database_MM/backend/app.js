const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = 5000;
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

const user = "bluedot";
const password = "bluedot1234";
const db_name = 'places';
const url = `mongodb+srv://${user}:${password}@cluster0.dul42.mongodb.net/${db_name}?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}...`)); //The server listens on port 5000

  })
  .catch(error => console.log(error));

