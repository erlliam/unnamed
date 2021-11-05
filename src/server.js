let fs = require("fs");
let { createApp } = require("./app.js");
let { scheduleVideosForDeletion } = require("./deleter.js");
let { port, formidableUploadDirectory } = require("./config.js");

fs.mkdirSync(formidableUploadDirectory, { recursive: true });
scheduleVideosForDeletion();

let app = createApp();

const server = app.listen(port, () => {
  console.log(`Listening at -> http://localhost:${port}`);
});
