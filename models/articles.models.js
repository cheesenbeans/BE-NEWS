const connection = require("../db/connection");
const { articleData } = require("../db/data/test-data");

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
