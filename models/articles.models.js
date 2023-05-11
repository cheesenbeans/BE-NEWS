const connection = require("../db/connection");
const { articleData } = require("../db/data/test-data");

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

exports.postComment = (newComment, articleId) => {
  const newCommentQuery = `
  INSERT INTO comments (body, author, article_id) 
  VALUES ($1, $2, $3) 
  RETURNING *`;
  return connection
    .query(newCommentQuery, [
      newComment.body,
      newComment.username,
      articleId.article_id,
    ])
    .then((result) => {
      return result.rows[0];
    });
};
