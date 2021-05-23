# Memories Graphql-Server

# Running locally in docker containers

- docker-compose up -d
-

# Fresh Local Installation

- docker-compose up -d db
- start db container
- it would be started based on port in docker-compose
- orm config would be local for "Local" Development

# Start Graphql-Server

- npx ts-node-dev -r dotenv/config -r tsconfig-paths/register src/index
