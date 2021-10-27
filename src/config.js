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

  let missingKey = false;
  for (let key in keys) {
    if (!config.hasOwnProperty(key)) {
      missingKey = true;
      console.log(`warning: configuration option ${key} is missing`);
    }
  }

  if (missingKey) {
    console.error("error: invalid config");
    process.exit(1);
  }

  return config;
}

module.exports = getConfig();
