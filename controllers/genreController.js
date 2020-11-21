var Genre = require("../models/genre");
var Item = require("../models/item");
var async = require("async");
const { body, validationResult } = require("express-validator");

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
      // console.log(results, "results///");
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
exports.genre_create_post = [
  // Validate and santise the name field.
  body("category", "Name must be between 1 and 30 characters")
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("desc", "Decription must be between 1 and 90 characters")
    .isLength({ min: 1, max: 90 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // console.log(req.body.brand, "req.body");
    // console.log(req.body.category, "req.body.category"); // 5fb06dddcc3e521c282ce22a req.body.category

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    // if there is no corresponding image, gets error
    const filename = req.file
      ? `/images/${req.file.filename}`
      : "https://via.placeholder.com/300x200.jpg/f1f5f4/516f4e/?text=Product+Doesn%27t+Have+An+Image+Yet";
    // console.log(req.body, "req.body");
    var new_genre = new Genre({
      name: req.body.category,
      desc: req.body.desc,
      imgUrl: filename,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages
      // console.log(new_genre, "error ////////");
      res.render("genre_form", {
        title: "Add Category",
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ genre: req.body.category }).exec(function (
        err,
        found_genre
      ) {
        if (err) {
          return next(err);
        }
        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          new_genre.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            // console.log(new_genre);
            res.redirect("/catalog/genres");
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  // res.send("NOT IMPLEMENTED: Genre delete GET");
  Genre.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      // No results.
      var err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    // console.log(result, "result //////////");
    res.render("genre_delete", {
      title: result.name,
      result,
    });
  });
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  Genre.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      // No results.
      var err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    Genre.findByIdAndRemove(req.params.id, function ItemAuthor(err) {
      if (err) {
        return next(err);
      }
      // Success - go to author list
      res.redirect("/catalog/genres");
    });
  });
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  // res.send("NOT IMPLEMENTED: Genre update GET");
  // res.send("NOT IMPLEMENTED: Author delete GET");
  Genre.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      // No results.
      var err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    console.log(result, "genre result///////////");
    res.render("genre_update", {
      title: result.name,
      result,
    });
  });
};

// Handle Genre update on POST.
exports.genre_update_post = [
  // Validate and santise the name field.
  body("category", "Name must be between 1 and 30 characters")
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("desc", "Decription must be between 1 and 90 characters")
    .isLength({ min: 1, max: 90 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const filename = req.file
      ? `/images/${req.file.filename}`
      : "https://via.placeholder.com/300x200.jpg/f1f5f4/516f4e/?text=Product+Doesn%27t+Have+An+Image+Yet";
    // Create a genre object with escaped and trimmed data.
    // console.log(req.body, "req.body");
    var genre = new Genre({
      name: req.body.category,
      desc: req.body.desc,
      imgUrl: filename,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      Genre.find({}, "name").exec(function (err, genres) {
        if (err) {
          return next(err);
        }
        // Successful, so render
        // console.log(genres);
        res.render("genre_form", { title: "Add Category" });
      });
      return;
    } else {
      // Data from form is valid.
      // Check if item with same name already exists.
      Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, genre) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to book detail page.
        res.redirect("/catalog/genres");
      });
    }
  },
];
