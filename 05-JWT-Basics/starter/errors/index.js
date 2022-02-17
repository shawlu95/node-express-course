// using index, then no need to import from specific files
const CustomAPIError = require("./custom-error");
const BadRequestError = require("./bad-request");
const UnauthenricatedError = require("./unauthenticated");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenricatedError
};