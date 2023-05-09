const app = require("./app.js");
const request = require("supertest");
const seed = require("./db/seeds/seed.js");
const connection = require("./db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("./db/data/test-data/index.js");

afterAll(() => {
  connection.end();
});

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  });

app.use((err,req,res,next)=>{
    res.status(500).send({msg :"Code 500 - server error!"})
})

describe("/api/topics", () => {
    test.only("GET request - status 200 responds with all the topics sorted by age", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topics = response.body.topics;
          expect(topics.length).toEqual(topicData.length);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toEqual("string");
            expect(typeof topic.description).toEqual("string");
          });
        });
    });
})