let { execFile } = require("child_process");

let keys = {
  instanceName: "INSTANCE_NAME",
  videoDirectory: "VIDEO_DIRECTORY",
  ffprobePath: "FFPROBE_PATH",
  ffmpegPath: "FFMPEG_PATH",
  databasePath: "DATABASE_PATH",
  expressSessionStoreSecret: "EXPRESS_SESSION_STORE_SECRET",
  port: "PORT",
  formidableUploadDirectory: "FORMIDABLE_UPLOAD_DIRECTORY",
  formidableMaxFileMebibytes: "FORMIDABLE_MAX_FILE_MEBIBYTES",
};

function invalidConfigExit() {
  console.log('error: invalid config');
  process.exit(1);
}

function checkForMissingKeys(config) {
  let missingKey = false;
  for (let key in keys) {
    if (!config.hasOwnProperty(key)) {
      missingKey = true;
      console.log(`warning: configuration option ${key} is missing`);
    }
  }

  if (missingKey) {
    invalidConfigExit();
  }
}

function checkFfprobePath(config) {
  execFile(config.ffprobePath, ['-version'], (error, stdout, stderr) => {
    if (error) {
      console.log('warning: ffprobePath is invalid');
      invalidConfigExit();
    }
  });
}

function checkFfmpegPath(config) {
  execFile(config.ffmpegPath, ['-version'], (error, stdout, stderr) => {
    if (error) {
      console.log('warning: ffmpegPath is invalid');
      invalidConfigExit();
    }
  });
}

function getConfig() {
  let config = {};
  try {
    config = require("../config.json");
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
  }

  for (let key in keys) {
    let environmentVariable = process.env[keys[key]];
    if (environmentVariable !== undefined) {
      config[key] = environmentVariable;
    }
  }

  checkForMissingKeys(config);
  checkFfprobePath(config);
  checkFfmpegPath(config);

  return config;
}

module.exports = getConfig();
