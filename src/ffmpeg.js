let { ffprobePath, ffmpegPath } = require("./config.js");
let { execFile } = require("child_process");

function ffprobe(path) {
  return new Promise((resolve, reject) => {
    // todo: Crash if ffprobePath is invalid (file doesn't exist or is not ffprobe)
    execFile(ffprobePath, ['-show_streams', '-print_format', 'json', path], (error, stdout, stderr) => {
      if (error) {
        console.log('ffprobe error:', error);
      }

      // ffprobe seems to return an empty object regardless if it fails
      resolve(JSON.parse(stdout));
    });
  });
}

function convertToMp4(path, newPath) {
  // overwrites `newPath`
  return new Promise((resolve, reject) => {
    // todo: Crash if ffmpegPath is invalid (file doesn't exist or is not ffprobe)
    execFile(ffmpegPath, ['-y', '-i', path, '-c', 'copy', '-f', 'mp4', newPath], (error, stdout, stderr) => {
      if (error) {
        console.log('convertToMp4 error:', error);
      }

      if (error === null) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

module.exports = {
  ...module.exports,
  ffprobe,
  convertToMp4
};
