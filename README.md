# Northcoders News API

## Background

This project is building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database is PSQL, and developers will interact with it using [node-postgres](https://node-postgres.com/).

## Connecting to the databases

In order to successfully connect to the database you must the following:

1. Add a file in the top level called .env.development containing the code:

```
PGDATABASE=nc_news;
```

2. Add a file in the top level called .env.test containing the code:

```
PGDATABASE=nc_news_test
```

3. Double Check that these are added in a .gitignore file
4. run `npm install` but do not install any other specific packages at this point
