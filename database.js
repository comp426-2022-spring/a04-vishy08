const database = require('better-sqlite3')

const logdb = new database('log.db')

const stmt = logdb.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='userinfo';`);
let row = stmt.get();
if (row === undefined) {
    console.log('Log database appears to be empty. Creating log database...')
    const sqlInit = `
    CREATE TABLE userinfo ( id INTEGER PRIMARY KEY, username TEXT );
    INSERT INTO userinfo (username, password) VALUES ('user1', 'supersecurepassword'), ('test', 'anotherpassword')`;
    //password TEXT, remote-addr VARCHAR, remote-user VARCHAR, datetime VARCHAR, method VARCHAR, url VARCHAR, http-version NUMERIC, status INTEGER, content-length NUMERIC
    logdb.exec(sqlInit)
} else {
    console.log('Log database exists.')
}

module.exports = logdb