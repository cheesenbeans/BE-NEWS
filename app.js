const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getArticles } = require("./controllers/articles.controllers");
const seed = require("./db/seeds/seed.js");
const connection = require("./db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("./db/data/test-data/index.js");

afterAll(() => {
  connection.end();
});

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Code 500 - server error!" });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

module.exports = app;
