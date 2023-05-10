const connection = require("../db/connection");
const fs = require("fs/promises");

exports.getAllApis = () => {
  return fs.readFile(`./endpoints.json`, "utf8").then((result) => {
    return result;
  });
};
