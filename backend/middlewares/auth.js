const express = require("express");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "Not Authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token is not valid" });

    req.userId = decoded.id;

    next();
  });
};

module.exports = verifyToken;
