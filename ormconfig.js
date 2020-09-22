

module.exports = {
  "name": "local",
  "type": "mysql",
  "host": process.env.db_host || "localhost",
  "port": 3306,
  "username": process.env.db_username || "root",
  "password": process.env.db_password || "Password1",
  "database": process.env.db_name || "MemoriesDB",
  "synchronize": true,
  "logging": true,
  "entities": ["src/entities/*.*"]
}
