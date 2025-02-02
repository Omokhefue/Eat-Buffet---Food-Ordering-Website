const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  cartData: {
    type: Map,
    of: cartItemSchema, 
    default: {},
  },
  savedAddress: { type: Object, default: {} },
});

module.exports = mongoose.model("User", userSchema);
