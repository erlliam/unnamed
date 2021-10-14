let express = require("express");
let fs = require("fs/promises");
let path = require("path");
let { videoDirectory } = require("../config.json");
let { videoExists, getFilename, getVideo } = require("./database.js");
let { deleteVideo } = require("./deleter.js");

let router = express.Router();

router.get("/:videoId", async (req, res, next) => {
  try {
    let videoId = req.params.videoId;
    if (videoExists(videoId)) {
      res.render("video", {
        videoId: videoId,
        requesterOwnsVideo: requesterOwnsVideo(req, videoId),
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:videoId", async (req, res, next) => {
  try {
    let videoId = req.params.videoId;
    if (requesterOwnsVideo(req, videoId)) {
      await deleteVideo(videoId, true);
      res.redirect("/");
    } else {
      res
        .status(404)
        .render("text", {
          heading: "Error",
          texts: ["Failed to delete the video.", "You do not own the video."],
        });
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

function requesterOwnsVideo(req, videoId) {
  let video = getVideo(videoId);
  return video.session_id === req.session.id;
}

module.exports = {
  ...module.exports,
  router,
};
