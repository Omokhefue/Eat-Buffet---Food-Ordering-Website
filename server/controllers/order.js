const Order = require("../models/Order");
const User = require("../models/User");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
exports.placeOrder = async (req, res) => {
  const { items, amount, address } = req.body;

  const userId = req.user._id;
  const frontendUrl = "http://localhost:5173";
  try {
    const order = await Order.create({ userId, items, amount, address });

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },

        unit_amount: item.price * 10 * 80,
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${order._id}`,
    });

    res.status(200).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
exports.saveAddress = async (req, res) => {
  let user;
  let userId = req.user._id;
  const { save } = req.query;
  const { address } = req.body;
  console.log(address.phone);
  try {
    if (save === "true") {
      user = await User.findByIdAndUpdate(
        userId,
        {
          savedAddress: address,
        },
        { new: true }
      );
    } else if (save === "false") {
      user = await User.findByIdAndUpdate(
        userId,
        {
          savedAddress: {},
        },
        { new: true }
      );
    }
    console.log("user", user);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

exports.verify = async (req, res) => {
  const { orderId, success } = req.body;
  console.log(req.body);
  const userId = req.user._id;

  try {
    if (success) {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      const user = await User.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Paid", user });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};
exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    res.status(201).json({ success: true, message: "updated!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};
