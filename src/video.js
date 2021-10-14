let express = require("express");
let fs = require("fs/promises");
let path = require("path");
let { videoDirectory } = require("../config.json");
let { videoExists, getFilename } = require("./database.js");

let router = express.Router();

router.get("/:videoId", async (req, res, next) => {
  try {
    let videoId = req.params.videoId;
    if (videoExists(videoId)) {
      res.render("video", { videoId: videoId });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

router.get("/video/:videoId", async (req, res, next) => {
  try {
    let videoId = req.params.videoId;
    let filename = getFilename(videoId);
    if (await videoFileExists(filename)) {
      res.sendFile(filename, { root: videoDirectory });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

async function videoFileExists(videoName) {
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
