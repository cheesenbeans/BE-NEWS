const { getAllApis } = require("../models/apis.models");

exports.getApis = (request, response, next) => {
  getAllApis()
    .then((endPoints) => {
      response.status(200).send({ endPoints });
    })
    .catch((err) => {
      next(err);
    });
};
