let fs = require("fs");
let { createApp } = require("./app.js");
let { scheduleVideosForDeletion } = require("./deleter.js");
let { port, formidableUploadDirectory } = require("./config.js");

fs.mkdirSync(formidableUploadDirectory, { recursive: true });
scheduleVideosForDeletion();

let app = createApp();
let server = app.listen(port);


server.on("error", (e) => {
  if (e.code == "EADDRINUSE") {
    console.log("Address in use, retrying...");
    port = String(port + 1)
    app.listen(port)
    console.log(`Running on -> http://localhost:${port}`);
  }
});


server.once("listening", () => {
  console.log(`Running on -> http://localhost:${port}`);
});
