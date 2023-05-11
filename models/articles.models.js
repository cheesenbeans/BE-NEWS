const connection = require("../db/connection");
const { articleData } = require("../db/data/test-data");
const { getVotes } = require("../db/seeds/utils");

exports.getAllArticles = () => {
  let queryStr = `SELECT
    COUNT(comment_id) AS comment_count,
    articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    article_img_url
    FROM articles
    JOIN comments
    ON articles.article_id=comments.article_id
    GROUP BY
    articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    article_img_url
    ORDER BY articles.created_at
    ;`;
  return connection.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.getArticle = (articleId) => {
  const articleIdArray = [articleId];
  let queryStr = `SELECT * FROM articles WHERE article_id=$1`;
  return connection.query(queryStr, articleIdArray).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found!" });
    }
    return result.rows[0];
  });
};

exports.getCommentsByArticle = (articleId) => {
  const articleIdArray = [articleId];
  let queryStr = `SELECT * FROM comments WHERE article_id=$1`;
  return connection.query(queryStr, articleIdArray).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found!" });
    }
    return result.rows;
  });
};

exports.patchVotes = (articleId, votes) => {
  return getVotes(articleId)
  .then((currentVotes) => {
    const queryStr = `
      UPDATE articles
      SET votes = $1
      WHERE article_id = $2
      RETURNING *
      ;`;
    return connection.query(queryStr, [(votes+currentVotes), articleId]).then((result) => {
      return result.rows[0];
    });
  });
};
