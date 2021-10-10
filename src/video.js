let express = require("express");
let fs = require("fs/promises");
let path = require("path");

let videoDirectory = '/home/mint/Videos/unnamed/';

let router = express.Router();

router.get("/:videoName", async (req, res, next) => {
  try {
    let videoName = req.params.videoName;
    if (await videoExists(videoName)) {
      res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
    </head>
    <body>
      <h1>unnamed</h1>
      <video
        controls
        width="640"
        src="/video/${req.params.videoName}"
      ></video>
    </body>
  </html>`
      );
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/video/:videoName", async (req, res, next) => {
  try {
    let videoName = req.params.videoName;
    if (await videoExists(videoName)) {
      res.sendFile(req.params.videoName, { root: videoDirectory });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

async function videoExists(videoName) {
  try {
    let videoPath = path.join(videoDirectory, videoName);
    await fs.access(videoPath);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  ...module.exports,
  router,
};
