const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("../users/users-model");

//post to register user. guided project auth 1 for reference
//*** 1 Client sends credentials */
/*** 7-9 client stores and sends cookie on every request */
router.post("/register", (req, res) => {
  const userInfo = req.body;

  // const ROUNDS = process.env.HASHING_ROUNDS || 8;
  const hash = bcrypt.hashSync(userInfo.password, 8);

  userInfo.password = hash;
  Users.add(userInfo)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((err) => {
      res.status(500).json(error);
    });
});

//post for user login input
/**** 1  Client sends credentials */
/** 7-9 client stores and sends cookie on every request */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findby({ username })
    .then(([user]) => {
      console.log(user);
      /** 4 - 6  produces  stores and sends cookie when verified by server */
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = {
          id: user.id,
          username: user.username,
        };
        res.status(200).json({ hello: user.username });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//logout request to end session for logged in user

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "you can checkout any time you like" });
      } else {
        res.status(200).json({ message: "logged out successfully" });
      }
    });
  } else {
    res.status(200).json({ message: "already logged out" });
  }
});

module.exports = router;
