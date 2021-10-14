let express = require("express");
let expressSession = require("express-session");
let expressSessionStore = require("better-sqlite3-session-store")(
  expressSession
);
let { router: uploadRouter } = require("./upload.js");
let { router: videoRouter } = require("./video.js");
let { db } = require("./database.js");

function createApp() {
  let app = express();
  app.set("view engine", "ejs");
  app.use(
    expressSession({
      store: new expressSessionStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 1000 * 60 * 15, // 15 minutes
        },
      }),
      secret: "addExpressSessionStoreSecretKeyToConfig",
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
    res.render("index");
  });

  app.get("*", (req, res) => {
    res
      .status(404)
      .render("text", { heading: "Error", texts: ["Page not found."] });
  });

  return app;
}

module.exports = {
  ...module.exports,
  createApp,
};
