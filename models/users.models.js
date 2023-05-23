const connection = require("../db/connection");

exports.getAllUsers = () => {
  let queryStr = `SELECT * FROM users;`;
  return connection.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.getUser = (username) => {
  const usernameArray = [username];
  let queryStr = `SELECT
    users.username,
    users.name,
    users.avatar_url
  FROM users
  WHERE users.username = $1`;
  return connection.query(queryStr, usernameArray).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found!" });
    }
    return result.rows[0];
  });
};
