const connection = require("../db/connection");

exports.getAllUsers = () => {
  let queryStr = `SELECT * FROM users;`;
  return connection.query(queryStr).then((result) => {
    return result.rows;
  });
};
