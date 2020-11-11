#! /usr/bin/env node
// add data here

console.log("This script populates some test ");

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

function itemCreate(brand, category, stock, price, genre, desc, imgUrl, cb) {
  itemdetail = {
    brand: brand,
    category: category,
    stock: stock,
    price: price,
  };
  if (desc != false) itemdetail.desc = desc;
  if (genre != false) itemdetail.genre = genre;
  if (imgUrl != false) itemdetail.imgUrl = imgUrl;

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function genreCreate(name, desc, cb) {
  var genre = new Genre({ name: name, genre: desc });

  // if (desc != false) genre.desc = desc;

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Genre: " + genre);
    genres.push(genre);
    cb(null, genre);
  });
}

/////////////////// difference between async series and parallel

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        // [genres[1]]
        itemCreate(
          "Air Jorgan Chicago 1985",
          "Sneakers",
          3,
          65,
          "icon of Air Jordan,",
          callback
        );
      },
      function (callback) {
        // [genres[0]]
        itemCreate(
          "Jabra 75T active",
          "Ear puds",
          1,
          200,
          "Best Ear puds for workout",
          callback
        );
      },
      function (callback) {
        // [genres[2]]
        itemCreate(
          "Can't hurt me",
          "Biography",
          1,
          20,
          "game changer",
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

function createGenres(cb) {
  async.series(
    [
      function (callback) {
        genreCreate(
          "Electronics",
          "Shop for the best selection of electronics at Every Day Low Prices. Save Money, Live Better.",
          callback
        );
      },
      function (callback) {
        genreCreate(
          "Footwear",
          "Deals up to 75% off along with FREE Shipping on shoes, boots, sneakers, and sandals",
          callback
        );
      },
      function (callback) {
        genreCreate(
          "Books",
          "Looking for good books to read? This reading list shares the best books of all-time organized by category",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

// title, summary, isbn, author, genre, cb
// brand: { type: String, required: true },
//   category: { type: Schema.Types.ObjectId, required: true, ref: "category" },
//   stock: { type: Number, required: true },
//   price: { type: Number, required: true },
//   description: { type: String, default: "no description" },
//   imgUrl: { type: String, default: "/images/randomImg.png" },
// });

// function createBookInstances(cb) {
//   async.parallel(
//     [
//       function (callback) {
//         bookInstanceCreate(
//           books[0],
//           "London Gollancz, 2014.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[1],
//           " Gollancz, 2011.",
//           false,
//           "Loaned",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[2],
//           " Gollancz, 2015.",
//           false,
//           false,
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[3],
//           "New York Tom Doherty Associates, 2016.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[3],
//           "New York Tom Doherty Associates, 2016.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[3],
//           "New York Tom Doherty Associates, 2016.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[4],
//           "New York, NY Tom Doherty Associates, LLC, 2015.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[4],
//           "New York, NY Tom Doherty Associates, LLC, 2015.",
//           false,
//           "Maintenance",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[4],
//           "New York, NY Tom Doherty Associates, LLC, 2015.",
//           false,
//           "Loaned",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(books[0], "Imprint XXX2", false, false, callback);
//       },
//       function (callback) {
//         bookInstanceCreate(books[1], "Imprint XXX3", false, false, callback);
//       },
//     ],
//     // Optional callback
//     cb
//   );
// }

async.series(
  [createGenres, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    }
    // else {
    //   console.log("BOOKInstances: ");
    // }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
