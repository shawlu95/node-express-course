require('dotenv').config();
require('express-async-errors'); // eliminate try/catch manually in controller

const express = require('express');
const app = express();
const morgan = require('morgan');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./db/connect');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // sign cookie: process.env.JWT_SECRET

app.use(express.static('./public'))
app.use(cors()); // required to allow front end to access server from a different domain/port

app.get('/api/v1', (req, res) => {
  console.log("signedCookies", req.cookies, req.signedCookies);
  res.send("ok");
})

app.use('/api/v1/auth', authRouter);

// error middleware comes last, order matters
app.use(notFoundMiddleware); // invoked if no route
app.use(errorHandlerMiddleware); // invoked in an actual existing route

const port = process.env.PORT || 8080;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port);
    console.log(`Listening on port ${port}...`);
  } catch (error) {
    console.log('Failed to start server...');
  }
};

start();