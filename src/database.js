let betterSqlite3 = require("better-sqlite3");
let { databasePath } = require("../config.json");

let db = betterSqlite3(databasePath);
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS video (
    id PRIMARY KEY NOT NULL,
    filename NOT NULL UNIQUE
  )
`
).run();

function storeVideo(id, filename) {
  db.prepare(
    `
    INSERT INTO video (id, filename)
    VALUES (:id, :filename)
  `
  ).run({
    id: id,
    filename: filename,
  });
}

function videoIdExists(id) {
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

module.exports = {
  ...module.exports,
  storeVideo,
  videoIdExists,
  getFilename,
};
