const express = require("express")
const app = express();
const {getTopics} = require("./controllers/topics.controllers")
const {postApis, getApis} = require("./controllers/apis.controllers")
app.use(express.json())

app.post("/api", postApis)

app.get("/api", getApis)

app.get("/api/topics", getTopics)



module.exports = app;