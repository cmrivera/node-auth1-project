const express = require("express");
const session = require("express-session");

const usersRouter = require("./users/users-router");
const authRouter = require("./authentication/router");
const restricted = require("./authentication/restricted-middleware");

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, //true in production to send only in https
    httpOnly: true, //true means no access from Javascript
  },
  resave: false,
  saveUninitialized: true, //GDPR laws require to check with client
};

server.use(express.json());
server.use(session(sessionConfig));
server.use("/users", restricted, usersRouter);
server.use("/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up and running " });
});

module.exports = server;
