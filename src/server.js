let express = require("express");
let { router: uploadRouter } = require("./upload.js");
let { router: videoRouter } = require("./video.js");

function createApp() {
  let app = express();
  app.use(express.static("public"));
  app.use(uploadRouter);
  app.use(videoRouter);

  return app;
}

module.exports = {
  ...module.exports,
  createApp,
};
