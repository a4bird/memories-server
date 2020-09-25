

module.exports = [{
  "name": "local",
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "Password1",
  "database": process.env.DB_NAME || "MemoriesDB",
  "synchronize": true,
  "logging": true,
  "entities": ["src/entities/*.*"]
},
{
  "name": "production",
  "type": "mysql",
  "host": process.env.DB_HOST,
  "port": 3306,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME || "MemoriesDb",
  "synchronize": true,
  "logging": true,
  "entities": ["src/entities/*.*"]
}]
