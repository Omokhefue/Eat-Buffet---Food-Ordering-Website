const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    ingredients: { type: [String], required: true },
    tags: { type: [String], required: true },
    servingSuggestion: { type: String },
    averageRating: { type: Number, default: 0 },
    deliveryTime: { type: Number, required: true },
  },
  { timestamps: true }
);

foodSchema.index(
  {
    name: "text",
    description: "text",
    tags: "text",
    ingredients: "text",
  },
  {
    weights: {
      name: 10,
      description: 5,
      tags: 3,
      ingredients: 1,
    },
  }
);

module.exports = mongoose.model("Food", foodSchema);
