const connection = require("../db/connection");
const {doesCommentExist} = require("../db/seeds/utils")

exports.deleteOneComment = (comment_id) => {
  return doesCommentExist(comment_id).then(() => {
    const queryStr = `DELETE FROM comments WHERE comment_id=$1;`;
    return connection.query(queryStr, [comment_id]).then((result) => {
      return result.rows[0];
    });
  });
};
