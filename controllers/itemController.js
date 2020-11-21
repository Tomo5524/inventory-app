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
exports.item_list = function (req, res, next) {
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
exports.item_detail = function (req, res, next) {
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
    // console.log(result, 'item result/////');
    res.render("item_detail", {
      title: result.brand,
      result,
      // UpdateUrl: `/catalog/item/${result.id}/update`,
      // DeleteUrl: `/catalog/item/${result.id}/delete`,
    });
  });
};

// Display Author create form on GET.
exports.item_create_get = function (req, res) {
  // res.send("NOT IMPLEMENTED: Author create GET");
  // selecting to return only name as we don't need description field
  Genre.find({}, "name").exec(function (err, genres) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    // console.log(genres);
    res.render("item_form", { title: "Add Item", genres });
  });
  // res.render("item_form", { title: "Create item" });
};

// Handle Author create on POST.
// exports.item_create_post = function (req, res, next) {
//   res.json(req.body);
//   // set validation, save new item, and store image
//   // has to upload file to get path
//   // console.log(req.file.path, "hiyaaaaa"); // returns public\images\image-1605778522433.jpg
// console.log(req.file.filename, "hiyaaaaa");
// };

exports.item_create_post = [
  // Validate and santise the name field.
  body("brand", "Name must be between 5 and 30 characters")
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("price", "Price must be higher than 0")
    .custom((value, { req }) => value > 0)
    .isNumeric()
    .escape(),
  body("stock", "Stock must be a positive number")
    .custom((value, { req }) => value > 0)
    .isNumeric()
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // console.log(req.body.brand, "req.body");
    // console.log(req.body.category, "req.body.category"); // 5fb06dddcc3e521c282ce22a req.body.category

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    // console.log(req.file.filename, "req.file.filename"); // image-1605787075046.jpg req.file.filename

    // if there is no corresponding image, gets error
    const filename = req.file
      ? `/images/${req.file.filename}`
      : "https://via.placeholder.com/300x200.jpg/f1f5f4/516f4e/?text=Product+Doesn%27t+Have+An+Image+Yet";
    // console.log(req.body, "req.body");
    var item = new Item({
      brand: req.body.brand,
      desc: req.body.desc,
      genre: req.body.genre,
      stock: req.body.stock,
      price: req.body.price,
      imgUrl: filename,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      Genre.find({}, "name").exec(function (err, genres) {
        if (err) {
          return next(err);
        }
        res.render("item_form", {
          title: "Add Item",
          genres,
          errors: errors.array(),
        });
      });
      return;
    } else {
      // Data from form is valid.
      // Check if item with same name already exists.
      Item.findOne({ brand: req.body.brand }).exec(function (err, found_item) {
        if (err) {
          return next(err);
        }
        if (found_item) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_item.url);
        } else {
          item.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(item.url);
          });
        }
      });
    }
  },
];

// Display Author delete form on GET.
exports.item_delete_get = function (req, res) {
  // res.send("NOT IMPLEMENTED: Author delete GET");
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
    res.render("item_delete", {
      title: result.brand,
      result,
    });
  });
};

// Handle Author delete on POST.
exports.item_delete_post = function (req, res) {
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
    Item.findByIdAndRemove(req.params.id, function ItemAuthor(err) {
      if (err) {
        return next(err);
      }
      // Success - go to author list
      res.redirect("/catalog/items");
    });
  });
};

// Display Author update form on GET.
exports.item_update_get = function (req, res, next) {
  async.parallel(
    {
      // get all names of genres
      genres: function (callback) {
        Genre.find({}, "name").exec(callback);
      },
      // get selected item
      item: function (callback) {
        Item.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      // console.log(results, "results///");
      if (err) {
        return next(err);
      }
      if (results.item.genre == null) {
        // No results.
        var err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("item_update", {
        title: "Item Update",
        genres: results.genres,
        result: results.item,
      });
    }
  );
};

// Handle Author update on POST.
exports.item_update_post = [
  // Validate and santise the name field.
  body("brand", "Name must be between 1 and 30 characters")
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("price", "Price must be higher than 0")
    .custom((value, { req }) => value > 0)
    .isNumeric()
    .escape(),
  body("stock", "Stock must be a positive number")
    .custom((value, { req }) => value > 0)
    .isNumeric()
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // console.log(req.body.brand, "req.body");
    // console.log(req.body.category, "req.body.category"); // 5fb06dddcc3e521c282ce22a req.body.category

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    // console.log(req.file.filename, "req.file.filename"); // image-1605787075046.jpg req.file.filename

    // if there is no corresponding image, gets error
    const filename = req.file
      ? `/images/${req.file.filename}`
      : "https://via.placeholder.com/300x200.jpg/f1f5f4/516f4e/?text=Product+Doesn%27t+Have+An+Image+Yet";
    // console.log(req.body, "req.body");
    var item = new Item({
      brand: req.body.brand,
      desc: req.body.desc,
      genre: req.body.genre,
      stock: req.body.stock,
      price: req.body.price,
      imgUrl: filename,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      // console.log(errors);
      // console.log("error detected//////// ");
      // console.log(req.body, "req.body//////////");
      // errors: [
      //   {
      //     value: undefined,
      //     msg: 'Name must be between 5 and 30 characters',
      //     param: 'brand',
      //     location: 'body'
      //   },
      //   {
      //     value: undefined,
      //     msg: 'Price must be higher than 0',
      //     param: 'price',
      //     location: 'body'
      //   },
      // ]
      Genre.find({}, "name").exec(function (err, genres) {
        if (err) {
          return next(err);
        }
        // Successful, so render
        // console.log(genres);
        res.render("item_form", { title: "Add Item", genres });
      });
      return;
    } else {
      // Data from form is valid.
      // Check if item with same name already exists.
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err, new_item) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to book detail page.
        res.redirect(new_item.url);
      });
    }
  },
];
