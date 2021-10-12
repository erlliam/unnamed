let { createApp } = require("./app.js");
let { scheduleVideosForDeletion } = require("./deleter.js");

let app = createApp();
app.listen(8001);
scheduleVideosForDeletion();
