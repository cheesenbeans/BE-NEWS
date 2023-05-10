const { getAllArticles } = require("../models/articles.models");
const { getArticle } = require("../models/articles.models");

exports.getArticles = (request, response, next) => {
  getAllArticles().then((articles) => {
    response.status(200).send({ articles });
    const { getArticle } = require("../models/articles.models");
  });
};

exports.getArticleById = (request, response, next) => {
  const articleId = request.params.article_id;
  getArticle(articleId)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};
