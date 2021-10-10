let express = require("express");
let { router: uploadRouter } = require("./upload.js");

function createApp() {
  let app = express();
  app.use(express.static("public"));
  app.use(uploadRouter);

  return app;
}

module.exports = {
  ...module.exports,
  createApp,
};
