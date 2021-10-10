let express = require("express");
let fs = require("fs/promises");
let path = require("path");
let { videoDirectory } = require("../config.json");

let router = express.Router();

router.get("/:videoName", async (req, res, next) => {
  try {
    let videoName = req.params.videoName;
    if (await videoExists(videoName)) {
      res.render("video", { videoName: videoName });
    } else {
      res.status(404).render("text", { texts: ["Video not found."] });
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
      res.status(404).render("text", { texts: ["Video not found."] });
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
