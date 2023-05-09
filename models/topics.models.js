const connection = require("../db/connection");

exports.getAllTopics = () => {
  let queryStr = `SELECT 
        slug, 
        description
    FROM topics
    ;`;
  return connection.query(queryStr).then((result) => {
    return result.rows;
  });
};
