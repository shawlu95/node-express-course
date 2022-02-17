const jwt = require("jsonwebtoken");
const { UnauthenricatedError } = require("../errors")

const authenticationMiddleware = async (req, res, next) => {
  console.log("auth middleware:", req.headers.authorization);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenricatedError("Unauthorized");
  }

  // Remove 'Bearer ' and take the remaining string
  const token = authHeader.split(" ")[1];

  // Verify token is valid
  try {
    // example:
    // { id: 16, username: 'shaw', iat: 1645077070, exp: 1645163470 }
    // use the decoded to customize response
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded;
    req.user = { id, username };
    next();
  } catch (error) {
    throw new UnauthenricatedError("Not authorized");
  }
};

module.exports = authenticationMiddleware;

