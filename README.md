# unnamed

unnamed lets users share videos that expire.

## Developing

Install dependencies:

    npm install

Create config.json:

```
{
  "instanceName": "unnamed",
  "videoDirectory": "videos",
  "ffprobePath": "/usr/bin/ffprobe",
  "ffmpegPath": "/usr/bin/ffmpeg",
  "databasePath": "unnamed.db",
  "expressSessionStoreSecret": "changeme",
  "port": 8001,
  "formidableUploadDirectory": "videos-tmp",
  "formidableMaxFileMebibytes": 100
}
```

Or use environment variables:

    INSTANCE_NAME="unnamed" \
    VIDEO_DIRECTORY="videos" \
    FFPROBE_PATH="/usr/bin/ffprobe" \
    FFMPEG_PATH="/usr/bin/ffmpeg" \
    DATABASE_PATH="unnamed.db" \
    EXPRESS_SESSION_STORE_SECRET="changeme" \
    PORT=8001 \
    FORMIDABLE_UPLOAD_DIRECTORY="videos-tmp" \
    FORMIDABLE_MAX_FILE_MEBIBYTES=100 \

Run server:

    npm start

Run development server:

    npm run dev

Format code:

    npm run format

Test code:

    npm test

Add to config:

- Update config.js
- Update config.json
- Update README.md
