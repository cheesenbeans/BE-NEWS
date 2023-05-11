const {
  getArticle,
  getCommentsByArticle,
  getAllArticles,
} = require("../models/articles.models");

exports.getArticles = (request, response, next) => {
  getAllArticles().then((articles) => {
    response.status(200).send({ articles });
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

exports.getCommentsByArticleId = (request, response, next) => {
  const articleId = request.params.article_id;
  getCommentsByArticle(articleId)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};
