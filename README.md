# Northcoders News API

## Background

This project is building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which also provides this information to the front end architecture. It holds users, articles, topics and comments on articles.

This project is hosted here ... https://nc-news-o4g7.onrender.com/api

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

3. Add a file in the top level called .env.production containing the code:

```
PGDATABASE=postgres://heoriork:LJV3df5-TaYTAsGOqbdIHcaXaWYoA7mn@dumbo.db.elephantsql.com/heoriork
```

4. Double Check that these are added in a .gitignore file

5.a. run `npm install` .  This must install v as the minimum version of node.js for this project

5.b. run `npm install pg` .  This must install v as the minimum version of node postgres for this project.

5.c. run `npm install pg-format`.

5.d. run `npm install dotenv`.

6. Update the scripts in the package json as follows :

    "setup-dbs": "psql -f ./db/setup.sql",
    "seed": "node ./db/seeds/run-seed.js",
    "test": "NODE_ENV=test jest",
    "prepare": "husky install",
    "start": "node listen.js",
    "seed-prod": "NODE_ENV=production npm run seed"

7. We can now setup the databases locally by running the following code.  It will DROP ALL EXISTING DATABASES and CONNECT each time.

    npm run setup-dbs

8. The `seed` script provided for you in the `package.json` will run the `seed` function with the dev data.

    npm run seed

It will DROP ALL EXISTING TABLES, CREATE ALL TABLES and populate those tables with data. 



in order to run tests you must install 

npm install express


npm install -D jest
npm install -D supertest

npm install -D jest-sorted
and ensure the package.json has the key
  "jest": {
    "setupFilesAfterEnv": [
      "jest-extended/all",
      "jest-sorted"
    ]
  }

