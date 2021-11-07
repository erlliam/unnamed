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
          intervalMs: 1000 * 60 * 15, // 15 minutes,
        },
      }),
      secret: expressSessionStoreSecret,
      rolling: true,
      resave: false,
      saveUninitialized: true,
      cookie: {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      },
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.enable("trust proxy");
    app.use((req, res, next) => {
      if (req.secure) {
        next();
      } else {
        // note: I think that req.get("host") returns the port number while req.hostname doesn't.
        // It shouldn't matter... at least for my use case...
        res.redirect(301, "https://" + req.hostname + req.url);
      }
    });
    app.use((req, res, next) => {
      res.set({
        "Strict-Transport-Security": "max-age=63072000",
      });
      next();
    });
  }

  app.get("/", (req, res) => {
    let videos = getAllVideoIdsFromSessionId(req.session.id);
    res.render("index.html", { videos: videos });
  });

  // Load static file
  app.use(express.static("static"));
  app.use(uploadRouter);
  app.use(videoRouter);

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
