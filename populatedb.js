#! /usr/bin/env node

console.log("This script populates some test ");
// add data here

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
  if (!userArgs[0].startsWith('mongodb')) {
      console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
      return
  }
  */
var async = require("async");
var Item = require("./models/item");
var Genre = require("./models/genre");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var genres = [];

function genreCreate(name, desc, imgUrl, cb) {
  var genre = new Genre({ name: name, desc: desc });
  if (imgUrl) genre.imgUrl = imgUrl;

  // if (desc != false) genre.desc = desc;

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Genre: " + genre);
    genres.push(genre);
    // console.log(cb);
    cb(null, genre);
  });
}

function itemCreate(brand, genre, stock, price, desc, imgUrl, cb) {
  var itemdetail = {
    brand: brand,
    genre: genre,
    stock: stock,
    price: price,
  };
  if (desc) itemdetail.desc = desc;
  if (imgUrl) itemdetail.imgUrl = imgUrl;

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New item: " + item);
    items.push(item);
    // console.log(cb);
    cb(null, item);
  });
}

/////////////////// difference between async series and parallel

function createGenres(cb) {
  async.series(
    [
      function (callback) {
        genreCreate(
          "Electronics",
          "Shop for the best selection of electronics at Every Day Low Prices. Save Money, Live Better.",
          "/images/dealmaster091919-800x444.png",
          callback
        );
      },
      function (callback) {
        genreCreate(
          "Footwear",
          "Deals up to 75% off along with FREE Shipping on shoes, boots, sneakers, and sandals",
          "/images/download.jpg",
          callback
        );
      },
      function (callback) {
        genreCreate(
          "Books",
          "Looking for good books to read? This reading list shares the best books of all-time organized by category",
          "/images/06critics-list1-facebookJumbo.jpg",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        // [genres[1]]
        // console.log(genres[1].name);
        itemCreate(
          "Air Jorgan Chicago 1985",
          // the reason why this is nested is that geners [1] is object
          [genres[1]],
          3,
          65,
          "icon of Air Jordans",
          "/images/Air-Jordan-1-OG-Chicago-1985-Product.jpg",
          callback
        );
      },
      function (callback) {
        // [genres[0]]
        itemCreate(
          "Jabra 75T active",
          [genres[0]],
          1,
          200,
          "Best Ear puds for workout",
          "/images/71qeTRmEfrL._AC_SL1500_.jpg", // right path
          callback
        );
      },
      function (callback) {
        // [genres[2]]
        itemCreate(
          "Can't hurt me",
          [genres[2]],
          1,
          20,
          "game changer",
          "/images/518TWTLsAyL.jpg",
          callback
        );
      },
      // function (callback) {
      //   bookCreate(
      //     "Test Book 2",
      //     "Summary of test book 2",
      //     "ISBN222222",
      //     authors[4],
      //     false,
      //     callback
      //   );
      // },
    ],
    // optional callback
    cb
  );
}

// name: { type: String, required: true },
// description: { type: String, required: true },

async.series(
  [createGenres, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("succeeded");
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
