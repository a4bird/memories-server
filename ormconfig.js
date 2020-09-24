

module.exports = {
  "name": "local",
  "type": "mysql",
  "host": process.env.DB_HOST || "localhost",
  "port": 3306,
  "username": process.env.DB_USERNAME || "root",
  "password": process.env.DB_PASSWORD || "Password1",
  "database": process.env.DB_NAME || "MemoriesDB",
  "synchronize": true,
  "logging": true,
  "entities": ["src/entities/*.*"]
}
