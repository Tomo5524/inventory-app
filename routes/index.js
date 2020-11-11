var express = require("express");
var router = express.Router();
// var mongoose = require("mongoose");
// var Item = require("../models/genre");
// var Genre = require("../models/genre");

/* GET home page. */
// redirect to anohter page
router.get("/", function (req, res, next) {
  // res.render("index", { title: "Express" });
  res.redirect("/catalog");
});

module.exports = router;
