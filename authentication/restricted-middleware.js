module.exports = (req, res, next) => {
  //check that we remember the client,
  //that the client logged in already
  /** 2 - 3 Server verifies credentials then creates session */
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
};
