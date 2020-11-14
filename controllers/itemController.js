var Item = require("../models/item");
var async = require("async");

// http://localhost:3000/catalog/item/:id/delete
exports.index = function (req, res) {
  // res.render("index", { title: "All the items" });
  Item.find().exec(function (err, items) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    res.render("index", { title: "All the items", items });
    // res.status(200).json(items);
  });

  //   // Genre.find().exec(function (err, genre) {
  //   //   if (err) {
  //   //     return next(err);
  //   //   }
  //   //   // Successful, so render
  //   //   res.render("index", { title: "All the items", items });
  //   //   res.status(200).json(genre);
  //   // }
  //   res.render("index", { title: "Shop", error: err, data: results });
  //   // res.send("NOT IMPLEMENTED: Site Home Page");
  // );
};

// Display list of all Authors.
exports.item_list = function (req, res) {
  Item.find().exec(function (err, items) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    // console.log(items);
    res.render("items", { title: "All the items", items });
    // res.status(200).json(items);
  });
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
  console.log(req.params.id);
  const id = req.params.id;
  // _id is auto populated when new item is created
  Item.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
      console.log(result);
    })
    .catch((err) => res.status(404).json(err));
};

// Display Author update form on GET.
exports.item_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.item_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Author update POST");
};
