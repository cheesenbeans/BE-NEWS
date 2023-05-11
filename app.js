const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getArticles, getArticleById, postCommentToArticleId } = require("./controllers/articles.controllers");
const { getApis } = require("./controllers/apis.controllers");
app.use(express.json())


app.get("/api/topics", getTopics);

app.get("/api", getApis);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.post("/api/articles/:article_id/comments", postCommentToArticleId)

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid Post Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Code 500 - server error!" });
});

module.exports = app;
