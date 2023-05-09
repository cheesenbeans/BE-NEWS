const { postAllApis, getAllApis } = require("../models/apis.models");

exports.postApis = (request, response, next) => {
  postAllApis()
    .then((parsedEndpoints) => {
      response.status(201).send({ parsedEndpoints });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApis = (request, response, next) => {
  postAllApis()
    .then((parsedEndpoints) => {
      return getAllApis(parsedEndpoints);
    })
    .then((jsonEndpoints) => {
      response.status(200).send({ jsonEndpoints });
    })
    .catch((err) => {
      next(err);
    });
};
