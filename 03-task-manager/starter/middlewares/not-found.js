const notFound = (req, res) => res.status(404).send("Route not exist");
module.exports = notFound;