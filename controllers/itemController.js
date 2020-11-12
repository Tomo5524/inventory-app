var Item = require("../models/item");
var Genre = require("../models/genre");
var async = require("async");

exports.index = function (req, res) {
  async.parallel(
    // Item.find().exec(function (err, items) {
    //   if (err) {
    //     return next(err);
    //   }
    //   // Successful, so render
    //   // res.render("index", { title: "All the items", items });
    //   res.status(200).json(items);
    // }),

    Genre.find().exec(function (err, genre) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      // res.render("index", { title: "All the items", items });
      res.status(200).json(genre);
    })
    // res.render("index", { title: "Shop", error: err, data: results });
    // res.send("NOT IMPLEMENTED: Site Home Page");
  );
};

// Display list of all Authors.
exports.item_list = function (req, res) {
  res.send("NOT IMPLEMENTED: Author list");
};

// Display detail page for a specific Author.
exports.item_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: Author detail: " + req.params.id);
};

// Display Author create form on GET.
exports.item_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Author create GET");
};

// Handle Author create on POST.
exports.item_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Author create POST");
};

// Display Author delete form on GET.
exports.item_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Author delete on POST.
exports.item_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Author update form on GET.
exports.item_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.item_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Author update POST");
};
