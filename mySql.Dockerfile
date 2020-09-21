FROM mysql/mysql-server:5.6

ENV MYSQL_DATABASE MemoriesDB
ENV MYSQL_ROOT_PASSWORD Password1

COPY ./mysql-scripts/ /docker-entrypoint-initdb.d
