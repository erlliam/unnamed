# unnamed

unnamed lets users share videos that expire.

## Developing

Install dependencies:

    npm install

Create config.json:

```
{
  "videoDirectory": "/home/mint/Videos/unnamed",
  "ffprobePath": "/usr/bin/ffprobe",
  "databasePath": "/home/mint/Projects/unnamed/unnamed.db",
  "expressSessionStoreSecret": "changeme",
  "port": 8001
}
```

Run development server:

    npm run dev

Format code:

    npm run format

Test code:

    npm test
