let betterSqlite3 = require("better-sqlite3");
let { databasePath } = require("./config.js");

let db = betterSqlite3(databasePath);
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS video (
    id PRIMARY KEY NOT NULL,
    filename NOT NULL UNIQUE,
    expiration_minutes NOT NULL,
    created NOT NULL,
    session_id NOT NULL
  )
`
).run();

function insertIntoVideo({
  id,
  filename,
  expirationMinutes,
  created,
  sessionId,
}) {
  return db
    .prepare(
      `
    INSERT INTO video (id, filename, expiration_minutes, created, session_id)
    VALUES (:id, :filename, :expirationMinutes, :created, :sessionId)
  `
    )
    .run({
      id: id,
      filename: filename,
      expirationMinutes: expirationMinutes,
      created: created,
      sessionId: sessionId,
    });
}

function videoExists(id) {
  let result = db
    .prepare(
      `
    SELECT * FROM video WHERE id = :id
  `
    )
    .all({ id: id });
  return Boolean(result.length);
}

function getFilename(id) {
  let result = db
    .prepare(
      `
    SELECT filename FROM video where id = :id
  `
    )
    .get({ id: id })?.filename;
  return result;
}

function deleteFromVideo(id) {
  db.prepare(
    `
    DELETE FROM video WHERE id = :id
  `
  ).run({ id: id });
}

function getAllVideos() {
  return db
    .prepare(
      `
    SELECT * FROM video
  `
    )
    .all();
}

function getVideo(id) {
  return db.prepare(`SELECT * FROM video WHERE id = :id`).get({ id: id });
}

function getAllVideoIdsFromSessionId(sessionId) {
  let result = db
    .prepare(`SELECT id FROM video WHERE session_id = :sessionId`)
    .all({ sessionId: sessionId });
  return result.map((x) => x.id);
}

module.exports = {
  ...module.exports,
  insertIntoVideo,
  videoExists,
  getFilename,
  deleteFromVideo,
  getAllVideos,
  getVideo,
  db,
  getAllVideoIdsFromSessionId,
};
