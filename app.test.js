const app = require("./app.js");
const request = require("supertest");
const connection = require("./db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("./db/data/test-data/index.js");
const express = require("express");
app.use(express.json());

describe("/api", () => {
  test.only("GET request - status 200 responds with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const parsedResult = JSON.parse(response.body.endPoints);
        expect(Object.keys(parsedResult).length).toBe(3);
        Object.values(parsedResult).forEach((value) => {
          expect(typeof value.description).toBe("string");
          expect(Array.isArray(value.queries)).toBe(true);
          expect(Object.keys(value.exampleResponse).length).not.toBe(0);
        });
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
