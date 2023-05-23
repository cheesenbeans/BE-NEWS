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

exports.patchVotes = (comment_id, votes) => {
  return doesCommentExist(comment_id).then((currentVotes) => {
    const queryStr = `
      UPDATE comments
      SET votes = $1
      WHERE comment_id = $2
      RETURNING *
      ;`;
    return connection
      .query(queryStr, [votes + currentVotes, comment_id])
      .then((result) => {
        return result.rows[0];
      });
  });
};
