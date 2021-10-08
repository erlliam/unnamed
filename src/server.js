let express = require('express');
let path = require('path');
let formidable = require('formidable');
let ffprobe = require('ffprobe');

let app = express();
app.use(express.static('public'));
app.listen(8001);

app.post('/upload', async (req, res, next) => {
  try {
    let formData = await parseFormData(req);
    if (!validExpirationMinutes(formData.fields.expirationMinutes)) {
      res.status(400).send('Invalid expiration minutes.');
    } else if (!(await validVideo(formData.files.video))) {
      res.status(400).send('Invalid video.');
    } else {
      res.send('Video is valid. Implement the rest of the crap.');
    }
  } catch(error) {
    next(error);
  }
});

function parseFormData(req) {
  return new Promise((resolve, reject) => {
    let form = formidable();
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          fields: fields,
          files: files
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
