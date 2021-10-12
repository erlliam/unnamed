let fs = require("fs/promises");
let path = require("path");
let { videoDirectory } = require("../config.json");
let { getFilename, deleteFromVideo, getAllVideos } = require("./database.js");

async function deleteVideo(videoId) {
  let filename = getFilename(videoId);
  deleteFromVideo(videoId);
  await fs.unlink(path.join(videoDirectory, filename));
}

function scheduleVideoForDeletion(videoId, created, minutesFromNow) {
  let createdDate = new Date(created);
  let expirationTimestamp = createdDate.getTime() + (minutesFromNow * 60 * 1000);
  let timeoutMs = expirationTimestamp - Date.now();
  setTimeout(() => { deleteVideo(videoId) }, timeoutMs);
}

function scheduleVideosForDeletion() {
  for (let video of getAllVideos()) {
    scheduleVideoForDeletion(video.id, video.created, video.expiration_minutes);
  }
}

module.exports = {
  ...module.exports,
  scheduleVideoForDeletion,
  scheduleVideosForDeletion
}
