let fs = require("fs");
let { createApp } = require("./app.js");
let { scheduleVideosForDeletion } = require("./deleter.js");
let { port, formidableUploadDirectory } = require("./config.js");

fs.mkdirSync(formidableUploadDirectory, { recursive: true });
let app = createApp();
let server = app.listen(port ?? 8001);
scheduleVideosForDeletion();
