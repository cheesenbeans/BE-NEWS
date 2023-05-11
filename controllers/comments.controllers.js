const { deleteOneComment } = require("../models/comments.models");

exports.deleteComment = (request, response, next) => {
    const {comment_id} = request.params
    deleteOneComment(comment_id)
    .then(()=>{
        response.status(204).send({})
    })
    .catch((err)=>{
        next(err)
    })

}

