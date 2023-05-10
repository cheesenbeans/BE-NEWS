const connection = require("../db/connection");
const { articleData } = require("../db/data/test-data");

exports.getAllArticles = () => {
  let queryStr = `SELECT
    author,
    title,
    article_id,
    topic,
    created_at,
    votes,
    article_img_url
    FROM articles
    ORDER BY created_at
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
