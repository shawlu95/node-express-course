const asyncWrapper = (fn) => {
  // return a new async function inwhich the wrapper fn is called
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = asyncWrapper;
