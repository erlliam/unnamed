let { createApp } = require("./app.js");
let { scheduleVideosForDeletion } = require("./deleter.js");
let { port } = require("../config.json");

let app = createApp();
let server = app.listen(port ?? 8001);
scheduleVideosForDeletion();
