const connection = require("../db/connection");
const { articleData } = require("../db/data/test-data");
const { checkUserExists, checkTopicExists } = require("../db/seeds/utils");

exports.getAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  return checkTopicExists(topic).then(() => {
    const validSortQueries = [
      "article_id",
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
      "article_img-url",
    ];
    if(!validSortQueries.includes(sort_by)){
      return Promise.reject({status: 400, msg: "Invalid Sort Query!"})
    }

    const validOrderQueries = [
      "desc",
      "asc",
    ];
    if(!validOrderQueries.includes(order)){
      return Promise.reject({status: 400, msg: "Invalid Order Query!"})
    }

    const queryValue = [];

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
    ON articles.article_id=comments.article_id`;

    if (topic) {
      queryValue.push(topic);
      queryStr += ` WHERE topic = $1`;
    }

    queryStr += ` 
    GROUP BY
    articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    article_img_url 
    ORDER BY ${sort_by} ${order};`;

    return connection.query(queryStr, queryValue).then((result) => {
      return result.rows;
    });
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
