# unnamed

unnamed lets users share videos that expire.

## Developing

Install dependencies:

    npm install

Create config.json:

```
{
  "instanceName": "unnamed",
  "videoDirectory": "/home/mint/Videos/unnamed",
  "ffprobePath": "/usr/bin/ffprobe",
  "databasePath": "/home/mint/Projects/unnamed/unnamed.db",
  "expressSessionStoreSecret": "changeme",
  "port": 8001,
  "formidableUploadDirectory": "/tmp/unnamed",
  "formidableMaxFileMebibytes": 100
}
```

Or use environment variables:

    INSTANCE_NAME="unnamed" \
    VIDEO_DIRECTORY="/home/mint/Videos/unnamed" \
    FFPROBE_PATH="/usr/bin/ffprobe" \
    DATABASE_PATH="/home/mint/Projects/unnamed/unnamed.db" \
    EXPRESS_SESSION_STORE_SECRET="changeme" \
    PORT=8001 \
    FORMIDABLE_UPLOAD_DIRECTORY="/tmp/unnamed" \
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
