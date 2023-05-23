const { deleteOneComment, patchVotes } = require("../models/comments.models");

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  deleteOneComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVotes = (request, response, next) => {
  const votes = request.body.inc_votes;
  const comment_id = request.params.comment_id;
  patchVotes(comment_id, votes)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
