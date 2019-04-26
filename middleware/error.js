const winston = require("winston");
const routeDebugger = require("debug")("route-debugger");

module.exports = function(err, req, res, next) {
  routeDebugger(
    "Error occurred with one of the middleware, prior to reaching route handler."
  );
  winston.error(err.message, err);
  res.status(500).send("Something failed.");
};
