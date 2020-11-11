const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  brand: { type: String, required: true },
  category: { type: String, required: true, ref: "category" },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "no description" },
  imgUrl: { type: String, default: "/images/randomImg.png" },
});

// this returns the absolute URL required to get a particular instance of the model
// so we can get id when clicking a particular item
itemSchema.virtual("url").get(function () {
  return `/shop/items/${this._id}`;
});

module.exports = mongoose.model("item", itemSchema);
