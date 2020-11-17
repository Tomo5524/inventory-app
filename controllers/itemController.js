var Item = require("../models/item");
var Genre = require("../models/genre");
var async = require("async");
const { body, validationResult } = require("express-validator");

// http://localhost:3000/catalog/item/:id/delete
exports.index = function (req, res) {
  async.parallel(
    {
      item_count: function (callback) {
        Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      genre_count: function (callback) {
        Genre.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "The biggest e-commerce in our village",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all items.
exports.item_list = function (req, res) {
  Item.find().exec(function (err, items) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    // console.log(each_item);
    res.render("items", { title: "All the items", items });
    // res.status(200).json(each_item);
  });
};

// Display detail page for a specific Author.
exports.item_detail = function (req, res) {
  // console.log("hiya");
  // res.send("NOT IMPLEMENTED: Author detail: " + req.params.id);
  Item.findById(req.params.id).exec(function (err, result) {
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
    console.log(result);
    res.render("item_detail", {
      title: result.brand,
      result,
    });
  });
};

// Display Author create form on GET.
exports.item_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Author create GET");
  // res.render("item_form", { title: "Create item" });
};

// Handle Author create on POST.
// exports.item_create_post = function (req, res) {
//   res.send("NOT IMPLEMENTED: Author create POST");
// };

// Handle Author create on POST.
exports.item_create_post = [
  // Validate and santise the name field.
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

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
