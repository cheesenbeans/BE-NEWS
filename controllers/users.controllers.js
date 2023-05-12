const { getAllUsers } = require("../models/users.models");

exports.getUsers = (request, response, next) => {
  return getAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
