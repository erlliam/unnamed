let express = require('express');
let path = require('path');
let formidable = require('formidable');

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
    }
  } catch(error) {
    next(error);
  }
});

function parseRequestForExpirationMinutesAndVideo(req) {
  return new Promise((resolve, reject) => {
    let form = formidable();
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
      } else {
        let expirationMinutes = fields.expirationMinutes;
        let video = files.video;
        if (!validExpirationMinutes(expirationMinutes)) {
          expirationMinutes = null;
        }
        if (!validVideo(video)) {
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

function validVideo(video) {
  return false;
}
