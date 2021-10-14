let betterSqlite3 = require("better-sqlite3");
let { databasePath } = require("../config.json");

let db = betterSqlite3(databasePath);
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS video (
    id PRIMARY KEY NOT NULL,
    filename NOT NULL UNIQUE,
    expiration_minutes NOT NULL,
    created NOT NULL
  )
`
).run();

function insertIntoVideo({ id, filename, expirationMinutes, created }) {
  return db
    .prepare(
      `
    INSERT INTO video (id, filename, expiration_minutes, created)
    VALUES (:id, :filename, :expirationMinutes, :created)
  `
    )
    .run({
      id: id,
      filename: filename,
      expirationMinutes: expirationMinutes,
      created: created,
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

module.exports = {
  ...module.exports,
  insertIntoVideo,
  videoExists,
  getFilename,
  deleteFromVideo,
  getAllVideos,
  getVideo,
  db,
};
