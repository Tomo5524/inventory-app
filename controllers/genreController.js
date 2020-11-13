var Genre = require("../models/genre");

// Display list of all Genre.
exports.genre_list = function (req, res) {
  Genre.find().exec(function (err, items) {
    if (err) {
      return next(err);
    }
    // Successful, so render
    // res.render("index", { title: "All the items", items });
    res.status(200).json(items);
  });
};

// Display detail page for a specific Genre.
exports.genre_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre detail: " + req.params.id);
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre create GET");
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
