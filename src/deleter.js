let fs = require("fs/promises");
let path = require("path");
let { videoDirectory } = require("../config.json");
let { getFilename, deleteFromVideo, getAllVideos } = require("./database.js");

async function deleteVideo(videoId) {
  let filename = getFilename(videoId);
  deleteFromVideo(videoId);
  await fs.unlink(path.join(videoDirectory, filename));
}

function scheduleVideoForDeletion(videoInDatabase) {
  let createdDate = new Date(videoInDatabase.created);
  let expirationTimestamp =
    createdDate.getTime() + videoInDatabase.expiration_minutes * 60 * 1000;
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

module.exports = {
  ...module.exports,
  scheduleVideoForDeletion,
  scheduleVideosForDeletion,
};
