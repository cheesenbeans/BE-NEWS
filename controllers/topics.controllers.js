const {getAllTopics} = require("../models/topics.models")

exports.getTopics = (request, response, next) => {
    getAllTopics() 
      .then((topics) => {
        console.log("in controller response")
        response.status(200).send({ topics: topics });
      })
      .catch((err) => {
        next(err);
      });
  };