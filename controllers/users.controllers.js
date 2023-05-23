const { getAllUsers, getUser } = require("../models/users.models");

exports.getUsers = (request, response, next) => {
  return getAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersByUsername = (request, response, next) => {
  const username = request.params.username;
  getUser(username)
    .then((user) => {
      response.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};
