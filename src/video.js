let express = require("express");
let fs = require("fs/promises");
let path = require("path");
let { videoDirectory } = require("./config.js");
let { videoExists, getFilename, getVideo } = require("./database.js");
let { deleteVideo, calculateExpirationTimestamp } = require("./deleter.js");

let router = express.Router();

router.get("/:videoId", async (req, res, next) => {
  try {
    let videoId = req.params.videoId;
    if (videoExists(videoId)) {
      res.render("video.html", {
        url: getSiteUrl(req),
        videoId: videoId,
        requesterOwnsVideo: requesterOwnsVideo(req, videoId),
        expirationTimestamp: calculateExpirationTimestamp(getVideo(videoId))
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
      res.status(404).render("text.html", {
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

// https://stackoverflow.com/a/10185427
function getSiteUrl(req) {
  return `${req.protocol}://${req.get("host")}`;
}

module.exports = {
  ...module.exports,
  router,
};
