const logger = require("../../common/logger.js");

 // convert BigInt to string
function bigIntToString(_, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

function asyncHandler(fn) {
  return (req, res, next) => {
      Promise.resolve(fn(req, res, next))
          .catch((err) => {
              logger.error(err);
              res.status(500).send({ message: err.message });
          });
  };
}

module.exports = {bigIntToString, asyncHandler};
