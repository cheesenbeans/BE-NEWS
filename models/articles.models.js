const connection = require("../db/connection");
const { articleData } = require("../db/data/test-data");


exports.getArticle = (articleId) => {
  const validStringItems = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const array = [...articleId];
  let count = 0;
  array.forEach((char) => {
    if (!validStringItems.includes(char)) {
      count++;
    }
  });
  if (count !== 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if(Number(articleId)>articleData.length){
    return Promise.reject({ status: 404, msg: "Not Found!" })
  }



  const articleIdArray = [articleId];
  let queryStr = `SELECT * FROM articles WHERE article_id=$1`;
  return connection.query(queryStr, articleIdArray).then((result) => {
    return result.rows[0];
  });
};
