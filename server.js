const express = require("express");
//server session support
const session = require("express-session");
const factory = require("connect-session-knex");

const KnexSessionStore = factory(session);

// 5 client stores cookie
const store = new KnexSessionStore(/*options here*/); //default to sqlite database

const usersRouter = require("./users/users-router");
const authRouter = require("./authentication/router");
const restricted = require("./authentication/restricted-middleware");

const server = express();

/** 2 - 3 Server verifies credentials to start session then creates session */
//server session support
const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, //true in production to send only in https
    httpOnly: true, //true means no access from Javascript
  },
  resave: false,
  saveUninitialized: true,
  //GDPR laws require to check with client
  store: store,
};

server.use(express.json());
server.use(session(sessionConfig));

/*server.use("/", (req, res) => {
  const n = req.session.views || 0;
  req.session.views = n + 1;
  res.end(`${n} views`);
});*/

server.use("/users", restricted, usersRouter);
server.use("/auth", authRouter);

/*setInterval(() => {
  store.length().then((length) => {
    console.log(`There are ${JSON.stringify(length)} sessions`);
  });
}, 2000);

setInterval(() => {
  store.clear().then((length) => {
    console.log(`Cleared ${JSON.stringify(length)} sessions`);
  });
}, 30000);*/

server.get("/", (req, res) => {
  res.json({ api: "up and running " });
});

module.exports = server;

/*Client sends credentials.
Server verify credentials.
Server creates a session for the client.
Server produces and sends back cookie.
Client stores the cookie.
Client sends cookie on every request.
Server verifies that cookie is valid.
Server provides access to resource.*/
