let express = require("express");
let { router: uploadRouter } = require("./upload.js");
let { router: videoRouter } = require("./video.js");

function createApp() {
  let app = express();
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(uploadRouter);
  app.use(videoRouter);

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("*", (req, res) => {
    res.status(404).render("text", { heading: "Error", texts: ["Page not found."] });
  });

  return app;
}

module.exports = {
  ...module.exports,
  createApp,
};
