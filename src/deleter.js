let fs = require("fs/promises");
let path = require("path");
let { videoDirectory } = require("./config.js");
let { getVideo, deleteFromVideo, getAllVideos } = require("./database.js");

async function deleteVideo(videoId, manualDeletion = false) {
  let videoInDatabase = getVideo(videoId);

  // todo: Unschedule video deletions if the user deletes the video
  // is this worth it?
  if (videoInDatabase === undefined) {
    console.log(
      "warning: video has already been deleted, the user may have manually deleted it"
    );
    return;
  }

  if (!manualDeletion) {
    let expirationTimestamp = calculateExpirationTimestamp(videoInDatabase);
    let nowTimestamp = Date.now();
    if (nowTimestamp < expirationTimestamp) {
      // todo: reschedule the deletion, don't just log it
      console.log("warning: deleting video before it's expiration time");
      console.log(
        "\texpiration: " + expirationTimestamp,
        "now: " + nowTimestamp
      );
    }
  }

  deleteFromVideo(videoInDatabase.id);
  await fs.unlink(path.join(videoDirectory, videoInDatabase.filename));
}

function scheduleVideoForDeletion(videoInDatabase) {
  let createdDate = new Date(videoInDatabase.created);
  let expirationTimestamp = calculateExpirationTimestamp(videoInDatabase);
  let timeoutMs = expirationTimestamp - Date.now();
  setTimeout(() => {
    deleteVideo(videoInDatabase.id);
  }, timeoutMs);
}

function scheduleVideosForDeletion() {
  for (let videoInDatabase of getAllVideos()) {
    scheduleVideoForDeletion(videoInDatabase);
  }
}

function calculateExpirationTimestamp(videoInDatabase) {
  let created = videoInDatabase.created;
  let expireAfter = videoInDatabase.expiration_minutes * 60 * 1000;
  return created + expireAfter;
}

module.exports = {
  ...module.exports,
  scheduleVideoForDeletion,
  scheduleVideosForDeletion,
  deleteVideo,
};
