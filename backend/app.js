const express = require('express');
const bodyParser = require('body-parser');
const PORT = 5000;
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');   // 99 - setting up user routers 
const HttpError = require('./models/http-error');  // 95 handling errors for unsupported routes

const app = express();

app.use(bodyParser.json());            //94- adding a post we need json body parser

app.use('/api/places', placesRoutes); //89-adding specific route => /api/places...
app.use('/api/users', usersRoutes); // 99 - setting up user routers 


app.use((res, req, next) => {         // 95 handling errors for unsupported routes
  throw new HttpError("Could not find this route. ", 404);
});

app.use((error, req, res, next) => {  //91-handling errors
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}...`)); //The server listens on port 5000
