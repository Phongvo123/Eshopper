const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  image: {
    type: String,
    required: true,
  },
});
const Category = mongoose.model("category", categorySchema);
module.exports = Category;
