// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wong. Try again later"
  }

  // deprecated
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  
  if (err.name === 'ValidationError') {
    console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors).map((item) => item.message).join(", ");
  } else if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  } else if (err.code && err.code === 11000) {
    // format friendlier error message
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field`;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware
