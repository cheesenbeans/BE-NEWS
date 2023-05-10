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
