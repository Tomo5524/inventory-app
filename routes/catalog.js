var express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer"); //
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    // console.log(
    //   file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    // ); // returns image-1605776509358.jpg
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
}).single("image");

// Require controller modules.
var genre_controller = require("../controllers/genreController");
var item_controller = require("../controllers/itemController");

/// Item ROUTES ///

// GET catalog home page.
router.get("/", item_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating Book.
router.post("/item/create", upload, item_controller.item_create_post);

// GET request to delete Book.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Book.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Book.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Book.
router.post("/item/:id/update", upload, item_controller.item_update_post);

// GET request for one Book.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Book items.
router.get("/items", item_controller.item_list);

/// GENRE ROUTES ///
// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", upload, genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", upload, genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

module.exports = router;
