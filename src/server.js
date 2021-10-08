let express = require('express');
let path = require('path');
let formidable = require('formidable');
let ffprobe = require('ffprobe');

let app = express();
app.use(express.static('public'));
app.listen(8001);

app.post('/upload', async (req, res, next) => {
  try {
    let expirationMinutesAndVideo = await parseRequestForExpirationMinutesAndVideo(req);
    if (expirationMinutesAndVideo.expirationMinutes === null) {
      res.send('Invalid expiration minutes.').status(400);
    } else if (expirationMinutesAndVideo.video === null) {
      res.send('Invalid video.').status(400);
    } else {
      res.send('Video is valid. Implement the rest of the crap.');
    }
  } catch(error) {
    next(error);
  }
});

function parseRequestForExpirationMinutesAndVideo(req) {
  return new Promise((resolve, reject) => {
    let form = formidable();
    form.parse(req, async (error, fields, files) => {
      if (error) {
        reject(error);
      } else {
        let expirationMinutes = fields.expirationMinutes;
        let video = files.video;
        if (!validExpirationMinutes(expirationMinutes)) {
          expirationMinutes = null;
        }
        if (!(await validVideo(video))) {
          video = null;
        }

        resolve({
          expirationMinutes: expirationMinutes,
          video: video
        });
      }
    });
  });
}

function validExpirationMinutes(expirationMinutes) {
  expirationMinutes = parseInt(expirationMinutes, 10);
  if (isNaN(expirationMinutes)) {
    return false;
  }

  if (expirationMinutes === 10 || expirationMinutes === 30) {
    return true;
  }

  return false;
}

async function validVideo(video) {
  try {
    let info = await ffprobe(video.path, { path: '/usr/bin/ffprobe' });
    // todo: Go through all the streams and make sure there's a video stream!
    console.log(info.streams);
    return true;
  } catch(error) {
    return false;
  }
}
