const app = require("./app.js");
const fs = require("fs/promises");
const request = require("supertest");
const seed = require("./db/seeds/seed.js");
const connection = require("./db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("./db/data/test-data/index.js");
const express = require("express");
const { parse } = require("path");
app.use(express.json());

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

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Code 500 - server error!" });
});

describe("/api", () => {
  test("POST request - status 201 posts the endpoints", () => {
    return request(app)
      .post("/api")
      .expect(201)
      .then((response) => {
        const parsedResult = response.body.parsedEndpoints;
        expect(Object.keys(parsedResult).length).toBe(3);
        Object.values(parsedResult).forEach((value) => {
          expect(typeof value.description).toBe("string");
          expect(Array.isArray(value.queries)).toBe(true);
          expect(Object.keys(value.exampleResponse).length).not.toBe(0);
        });
      });
  });
  test("GET request - status 200 responds with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const parsedResult = response.body.jsonEndpoints;
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
