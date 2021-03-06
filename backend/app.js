const fs = require('fs');                               // 166 connecting users to image
const path = require('path');                           // 167 serving images statically
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');   // 99 - setting up user routers 
const HttpError = require('./models/http-error');  // 95 handling errors for unsupported routes
const mongoose = require('mongoose');   // 122- connecting to database

const app = express();

app.use(bodyParser.json());            //94- adding a post we need json body parser

app.use('/uploads/images', express.static(path.join('uploads', 'images')));   // 167 serving images statically -returns req file static not execute

app.use(express.static(path.join('public')));   // 202- deploying a combined app

// when we are serving both from the same host we can omit these cores headers 
// app.use((req, res, next) => {           //145- Handling CORS Error
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type, Accept, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
//   next();
// });

app.use('/api/places', placesRoutes); //89-adding specific route => /api/places...
app.use('/api/users', usersRoutes); // 99 - setting up user routers 

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// we don't need anymore this unknown request
// because we say above any request going to any URL will be served statically
// app.use((res, req, next) => {         // 95 handling errors for unsupported routes
//   throw new HttpError("Could not find this route. ", 404);
// });

app.use((error, req, res, next) => {  //91-handling errors
  if (req.file) {                       // 166 connecting users to image
    fs.unlink(req.file.path, err => { console.log(err) });             // delete the file
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// 122- connecting to database

const url = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.dul42.mongodb.net/${process.env.DB_name}?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}...`)); //The server listens on port 5000

  })
  .catch(error => console.log(error));
