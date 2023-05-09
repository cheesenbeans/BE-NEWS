const connection = require("../db/connection");
const fs = require("fs/promises");

exports.postAllApis = () => {
  return fs.readFile(`./endpoints.json`, "utf8").then((result) => {
    const parsedEndpoints = JSON.parse(result);
    return parsedEndpoints;
  });
};

exports.getAllApis = (parsedEndpoints) => {
  const jsonEndpoints = parsedEndpoints;
  return jsonEndpoints;
};
