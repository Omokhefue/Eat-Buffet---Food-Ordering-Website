const User = require("../models/User");

exports.addCart = async (req, res) => {
  const { itemId, name, price, image, quantity } = req.body;
  try {
    let userData = await User.findById(req.user._id);
    let cartData = userData.cartData;

    if (!cartData.has(itemId)) {
      cartData.set(itemId, { name, price, image, quantity });
    } else {
      const existingItem = cartData.get(itemId);
      existingItem.quantity = quantity;
      cartData.set(itemId, existingItem);
    }

    await User.findByIdAndUpdate(req.user._id, { cartData });

    res.status(201).json({
      success: true,
      cartData,
      message: "Added to Cart",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error",
    });
  }
};

exports.removeCart = async (req, res) => {
  const userId = req.user._id;
  const { itemId, quantity, action } = req.body;

  try {
    const userData = await User.findById(userId);

    const cartData = userData.cartData;

    if (action === "remove-completely") {
      cartData.delete(itemId);
    } else if (cartData.has(itemId)) {
      const item = cartData.get(itemId);
      item.quantity -= quantity;

      if (item.quantity <= 0) {
        cartData.delete(itemId);
      } else {
        cartData.set(itemId, item);
      }
    }

    userData.markModified("cartData");
    await userData.save();
    return res.status(200).json({
      success: true,
      cartData,
      message:
        action === "remove-completely"
          ? "Item completely removed from cart"
          : "Removed from cart",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error removing item from cart",
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);

    let cart = user.cartData;

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error" });
  }
};
