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
  return connection.end();
});

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

describe("/api", () => {
  test("GET request - status 200 responds with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const parsedResult = JSON.parse(response.body.endPoints);
        let count = 0;
        Object.values(parsedResult).forEach((value) => {
          count++;
          expect(typeof value.description).toBe("string");
          expect(Array.isArray(value.queries)).toBe(true);
          expect(Object.keys(value.exampleResponse).length).not.toBe(0);
        });
        expect(Object.keys(parsedResult).length).toBe(count);
      });
  });
});

describe("/api/topics", () => {
  test("GET request - status 200 responds with all the topics", () => {
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
});

describe("/api/articles/:article_id", () => {
  test("GET request - status 200 responds with an article by ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.topic).toBe("mitch");
        expect(Date.parse(article.created_at)).toEqual(
          1594329060000 - 60 * 60 * 1000
        ); //needs to change one hour for BST daylight saving
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET request - status 400 responds due to invalid article id", () => {
    return request(app)
      .get("/api/articles/nonsense")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("GET request - status 404 responds due to a valid but non-existent articleId", () => {
    return request(app)
      .get("/api/articles/124714")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found!");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET request - status 200 responds with an the comments on a specific article by ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
        expect(comments).toBeSorted({
          key: `created_at`,
          coerce: true,
          descending: true,
        });
      });
  });
  test("GET request - status 400 responds due to invalid article id", () => {
    return request(app)
      .get("/api/articles/nonsense/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("GET request - status 404 responds due to a valid but non-existent articleId", () => {
    return request(app)
      .get("/api/articles/124714/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found!");
      });
  });
});
