let express = require("express");
let expressSession = require("express-session");
let expressSessionStore = require("better-sqlite3-session-store")(
  expressSession
);
let nunjucks = require("nunjucks");
let { router: uploadRouter } = require("./upload.js");
let { router: videoRouter } = require("./video.js");
let { db, getAllVideoIdsFromSessionId } = require("./database.js");
let { expressSessionStoreSecret, instanceName } = require("./config.js");

function createApp() {
  let app = express();
  let nunjucksEnvironment = nunjucks.configure("views", {
    autoescape: true,
    express: app,
  });
  nunjucksEnvironment.addGlobal("instanceName", instanceName);
  app.use(
    expressSession({
      store: new expressSessionStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 1000 * 60 * 15, // 15 minutes
        },
      }),
      secret: expressSessionStoreSecret,
      rolling: true,
      resave: false,
      saveUninitialized: true,
      cookie: {
        path: "/",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      },
    })
  );
  app.use(express.static("public"));
  app.use(uploadRouter);
  app.use(videoRouter);

  app.get("/", (req, res) => {
    let videos = getAllVideoIdsFromSessionId(req.session.id);
    res.render("index.html", { videos: videos });
  });

  app.get("*", (req, res) => {
    res
      .status(404)
      .render("text.html", { heading: "Error", texts: ["Page not found."] });
  });

  return app;
}

module.exports = {
  ...module.exports,
  createApp,
};
