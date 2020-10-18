
module.exports = [
  {
    "name": "docker",
    "type": "mysql",
    "host": "localhost",
    "port": 3303,
    "username": "root",
    "password": "Password1",
    "database": process.env.DB_NAME || "MemoriesDB",
    "synchronize": true,
    "logging": true,
    "entities": ["src/entities/*.*"]
  },
  {
  "name": "local",
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "Password1",
  "database": process.env.DB_NAME || "MemoriesDB",  
  "logging": true,
  "entities": ["src/entities/*.*"],
  "migrationsRun": true,
  "migrations": ["src/migration/*.*"],
  "cli": {
      "migrationsDir": "src/migration"
    }
  },
  {
    "name": "development",
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": 3306,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME || "MemoriesDb",
    "synchronize": true,
    "logging": true,
    "entities": ["src/entities/*.*"],
    "migrationsRun": true,
    "migrations": ["migration/*.js"],
    "cli": {
        "migrationsDir": "migration"
    }
  },
  {
    "name": "production",
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": 3306,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME || "MemoriesDb",
    "synchronize": false,
    "logging": true,
    "entities": ["src/entities/*.*"],
    "migrationsRun": true,
    "migrations": ["migration/*.js"],
    "cli": {
        "migrationsDir": "migration"
    }
  }
]
