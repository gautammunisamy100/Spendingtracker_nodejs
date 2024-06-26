const jwtService = require("../service/jwt-service");
const fileService = require("../service/file-service");
const dateService = require("../service/date-service");

module.exports = {
  isAuthorized: function (req, res, next) {
    try {
      const tokens = req.signedCookies.token;
      const tokendata = jwtService.getUserIdFromToken(tokens);
      req.userId = tokendata.userId;
      req.username = tokendata.username;
      next();
    } catch (err) {
      if (req.xhr) {
        return res.status(401).send("token invalid");
      }
      return res.redirect("/authpage");
    }
  },
  isApiAuthorized: function (req, res, next) {
    try {
      const tokendata = jwtService.getUserIdFromRequest(req);
      req.userId = tokendata.userId;
      next();
    } catch (err) {
      return res.status(401).send("token invalid");
    }
  },
  errorHandler: function (err, req, res, next) {
    if (!err.status) {
      let error = "\n" + dateService.getCurrentDateWithTime("/");
      error += `\n${req.method}  ${req.url}\n`;
      error += err + "\n";
      fileService.writeErrorToLog(error);
      err.status = 500;
      err.message = "Server Error";
    }
    if (req.xhr) {
      res.status(err.status).send(err.message);
    } else {
      res.render("error_page");
    }
  },
};
