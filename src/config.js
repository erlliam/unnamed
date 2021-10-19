function getConfig() {
  let config = {};
  try {
    config = require("../config.json");
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
  }

  let keys = {
    videoDirectory: "VIDEO_DIRECTORY",
    ffprobePath: "FFPROBE_PATH",
    databasePath: "DATABASE_PATH",
    expressSessionStoreSecret: "EXPRESS_SESSION_STORE_SECRET",
    port: "PORT",
    formidableUploadDirectory: "FORMIDABLE_UPLOAD_DIRECTORY",
    formidableMaxFileMebibytes: "FORMIDABLE_MAX_FILE_MEBIBYTES",
  };

  for (let key in keys) {
    let environmentVariable = process.env[keys[key]];
    if (environmentVariable !== undefined) {
      config[key] = environmentVariable;
    }
  }

  return config;
}

module.exports = getConfig();
