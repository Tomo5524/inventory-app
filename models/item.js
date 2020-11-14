const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  brand: { type: String, required: true },
  category: { type: String, required: true, ref: "category" },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  desc: { type: String, default: "" },
  imgUrl: { type: String, default: "" },
});

// this returns the absolute URL required to get a particular instance of the model
// so we can get id when clicking a particular item
itemSchema.virtual("url").get(function () {
  return `/catalog/items/${this._id}`;
});

module.exports = mongoose.model("item", itemSchema);
