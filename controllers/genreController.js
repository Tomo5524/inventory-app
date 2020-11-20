var Genre = require("../models/genre");
var Item = require("../models/item");
var async = require("async");

// Display list of all Genre.
exports.genre_list = function (req, res) {
  Genre.find().exec(function (err, categories) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    res.render("category", { title: "All Categories", categories });
    // res.status(200).json(categories);
  });
};

// Display detail page for a specific Genre.
exports.genre_detail = function (req, res, next) {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },

      item_list: function (callback) {
        Item.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      console.log(results, "results///");
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        var err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre.name,
        item_list: results.item_list,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
  // res.send("NOT IMPLEMENTED: Genre create GET");
  res.render("genre_form", { title: "Add Category" });
};

// Handle Genre create on POST.
exports.genre_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre create POST");
};

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  console.log(req.params.id);
  const id = req.params.id;
  // _id is auto populated when new item is created
  Genre.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
      console.log(result);
    })
    .catch((err) => res.status(404).json(err));
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
