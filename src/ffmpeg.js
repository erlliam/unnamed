let { ffprobePath } = require("./config.js");
let { execFile } = require("child_process");

function ffprobe(path) {
  return new Promise((resolve, reject) => {
    // todo: Crash if ffprobePath is invalid (file doesn't exist or is not ffprobe)
    execFile(ffprobePath, ['-show_streams', '-print_format', 'json', path], (error, stdout, stderr) => {
      // ffprobe seems to return an empty object regardless if it fails
      resolve(JSON.parse(stdout));
    });
  });
}

module.exports = {
  ...module.exports,
  ffprobe
};
