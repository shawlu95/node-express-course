const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors");

// three options handling error
// 1. use mongoose
// 2. use Joi package
// 3. customie in controllers (in this example)
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequestError("Enter username and password");
  }

  // usually payload is user ID 
  const id = new Date().getDate();
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.status(200).json({ msg: "User created", token });
};

const dashboard = async (req, res) => {

  const luckyNumber = Math.floor(Math.random() * 100);
  return res.status(200).json({ msg: `Welcome, ${req.user.username}`, secret: `Lucky number: ${luckyNumber}` });
};

module.exports = {
  login, dashboard
};