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
          expect(typeof value.exampleResponse).toBe("object");
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
        );
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe("11");
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
  test("PATCH request - status 200 - patches updated votes onto the article and responds with the article", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send({
        inc_votes: -100,
      })
      .then((result) => {
        const article = result.body.article;
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.topic).toBe("mitch");
        expect(Date.parse(article.created_at)).toEqual(
          1594329060000 - 60 * 60 * 1000
        );
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("PATCH request - status code 400 - non-existent article id", () => {
    return request(app)
      .patch(`/api/articles/hello`)
      .expect(400)
      .send({
        inc_votes: 10,
      })
      .then((result) => {
        const article = result.body;
        expect(article.msg).toBe("Bad Request");
      });
  });
  test("PATCH request - status code 404 - invalid article id", () => {
    return request(app)
      .patch(`/api/articles/23141`)
      .expect(404)
      .send({
        inc_votes: 10,
      })
      .then((result) => {
        const article = result.body;
        expect(article.msg).toBe("Not Found!");
      });
  });
  test("PATCH request - status code 400 - inc_votes is not a number", () => {
    return request(app)
      .patch(`/api/articles/2`)
      .expect(400)
      .send({
        inc_votes: "hello",
      })
      .then((result) => {
        const article = result.body;
        expect(article.msg).toBe("Bad Request");
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
});

describe("/api/articles", () => {
  test("GET request - status 200 responds with all the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.body).toBe("undefined");
          expect(typeof article.comment_count).toBe("string");
        });
        expect(articles).toBeSorted({
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
  test("GET request - status 200 responds with query just containing articles with a certain topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((result) => {
        expect(result.body.articles.length).toBe(1);
        result.body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("GET request - status 404 responds to a topic not found", () => {
    return request(app)
      .get("/api/articles?topic=whatever")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Topic Not Found!");
      });
  });
  test("GET request - status 200 responds to a topic is valid but there are no entries", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((result) => {
        expect(result.body.articles).toEqual([]);
      });
  });
  test("GET request - status 200 responds to a topic is valid but there are no entries", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then((result) => {
        expect(result.body.articles).toBeSorted({
          key: "author",
          descending: true,
        });
      });
  });
  test("GET request - status 200 responds with a default sort_by of date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        expect(result.body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("GET request - status 400 responds to an invalid topic", () => {
    return request(app)
      .get("/api/articles?sort_by=whatever")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid Sort Query!");
      });
  });
  test("GET request - status 200 responds to a valid sort_by and the order is asc", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then((result) => {
        expect(result.body.articles).toBeSorted({
          key: "author",
          descending: false,
        });
      });
  });
  test("GET request - status 200 responds to a valid sort_by and defaults to descending", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then((result) => {
        expect(result.body.articles).toBeSorted({
          key: "author",
          descending: true,
        });
      });
  });
  test("GET request - status 400 responds to a valid sort_by but an invalid order query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=whatever")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toEqual("Invalid Order Query!");
      });
  });
  test("POST request - status 201 responds with a new article ", () => {
    return request(app)
      .post("/api/articles")
      .expect(201)
      .send({
        author: "butter_bridge",
        title: "hello",
        body: "this is the body",
        topic: "mitch",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .then((response) => {
        const { article } = response.body;
        expect(article.article_id).toBe(13);
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("hello");
        expect(article.topic).toBe("mitch");
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(typeof article.created_at).toBe("string");
        expect(article.votes).toBe(0);
      });
  });
  test("POST request status 400 responds with error status and message invalid for a post request that is missing an element (no body) ", () => {
    return request(app)
      .post("/api/articles")
      .expect(400)
      .send({
        author: "butter_bridge",
        title: "hello",
        topic: "mitch",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Post Request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST request - status 201 responds with a new comment ", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .expect(201)
      .send({
        username: "rogersop",
        body: "This is a test comment!",
      })
      .then((response) => {
        const { comment } = response.body;
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe("This is a test comment!");
        expect(comment.votes).toBe(0);
        expect(comment.author).toBe("rogersop");
        expect(comment.article_id).toBe(3);
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("POST request - status 201 responds with a new comment and ignores all unnecessary properties. In this test votes and comment_id are unnecessary ", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .expect(201)
      .send({
        username: "rogersop",
        body: "This is a test comment!",
        comment_id: 4,
        votes: 5,
      })
      .then((response) => {
        const { comment } = response.body;
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe("This is a test comment!");
        expect(comment.votes).toBe(0);
        expect(comment.author).toBe("rogersop");
        expect(comment.article_id).toBe(3);
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("POST request status 400 responds with error status and message invalid post request (no body) ", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .expect(400)
      .send({
        username: "rogersop",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Post Request");
      });
  });
  test("POST request - status 400 responds due to invalid article id", () => {
    return request(app)
      .post("/api/articles/nonsense/comments")
      .expect(400)
      .send({
        username: "rogersop",
        body: "This is a test comment!",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("POST request - status 404 responds due to a valid but non-existent articleId", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .expect(404)
      .send({
        username: "rogersop",
        body: "This is a test comment!",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Not Found!");
      });
  });
  test("POST request - status 404 responds due to a valid but non-existent username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(404)
      .send({
        username: "chris",
        body: "This is a test comment!",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Not Found!");
      });
  });
});

describe("/api/users", () => {
  test("GET request - status 200 responds with all the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users.length).toEqual(userData.length);
        users.forEach((user) => {
          expect(typeof user.username).toEqual("string");
          expect(typeof user.name).toEqual("string");
          expect(typeof user.avatar_url).toEqual("string");
        });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE request - status 204 - deletes the comment by comment id, nothing returned", () => {
    return request(app)
      .delete(`/api/comments/8`)
      .expect(204)
      .then(() => {
        return connection.query(`SELECT * FROM comments;`);
      })
      .then((result) => {
        expect(result.rows.length).toBe(17);
        const comments = result.rows;
        comments.forEach((comment) => {
          expect(comment.comment_id).not.toBe(8);
        });
      });
  });
  test("DELETE request - status 400 - bad request", () => {
    return request(app)
      .delete(`/api/comments/hello`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("DELETE request - status 404 - comment does not exist", () => {
    return request(app)
      .delete(`/api/comments/3424`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment_ID Not Found!");
      });
  });
  test("PATCH request - status 200 - patches updated votes onto the comment and responds with the comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .expect(200)
      .send({
        inc_votes: 1,
      })
      .then((result) => {
        const comment = result.body.comment;
        expect(comment.body).toBe(
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        );
        expect(comment.article_id).toBe(9);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.votes).toBe(17);
        expect(Date.parse(comment.created_at)).toEqual(
          1586179020000 - 60 * 60 * 1000
        );
      });
  });
  test("PATCH request - status code 400 - non-existent comment id", () => {
    return request(app)
      .patch(`/api/comments/hello`)
      .expect(400)
      .send({
        inc_votes: 10,
      })
      .then((result) => {
        const comment = result.body;
        expect(comment.msg).toBe("Bad Request");
      });
  });
  test("PATCH request - status code 404 - invalid comment id", () => {
    return request(app)
      .patch(`/api/comments/23141`)
      .expect(404)
      .send({
        inc_votes: 10,
      })
      .then((result) => {
        const comment = result.body;
        expect(comment.msg).toBe("Comment_ID Not Found!");
      });
  });
  test("PATCH request - status code 400 - inc_votes is not a number", () => {
    return request(app)
      .patch(`/api/comments/2`)
      .expect(400)
      .send({
        inc_votes: "hello",
      })
      .then((result) => {
        const comment = result.body;
        expect(comment.msg).toBe("Bad Request");
      });
  });
});

describe("/api/users/:username", () => {
  test("GET request - status 200 responds with a user by username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((response) => {
        const user = response.body.user;
        expect(user.username).toBe("butter_bridge");
        expect(user.name).toBe("jonny");
        expect(user.avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });
  test("GET request - status 404 responds due to invalid username", () => {
    return request(app)
      .get("/api/users/nonsense")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found!");
      });
  });
});
