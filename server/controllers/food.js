const fs = require("fs");
const Food = require("../models/Food");
const Review = require("../models/Review");

exports.addFood = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    ingredients,
    tags,
    servingSuggestion,
    deliveryTime,
  } = req.body;

  console.log(ingredients, tags);

  const ingrArray = ingredients.split(",").map((str) => str.trim());
  const tagsArray = tags.split(",").map((str) => str.trim());
  console.log(ingrArray, tagsArray);

  try {
    const food = await Food.create({
      name,
      description,
      price: Number(price),
      deliveryTime: Number(deliveryTime),
      category,
      ingredients: ingrArray,
      tags: tagsArray,
      servingSuggestion,
      image: `uploads/food/${req.file.name}`,
    });
    res.status(201).json({ message: "Food item added successfully", food });
  } catch (error) {
    fs.unlink(`uploads/food/${req.file.name}`, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error deleting image",
          err,
        });
      }
    });
    res
      .status(500)
      .json({ message: "Error adding food item", error: error.message });
  }
};
exports.getAllFood = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = page === 1 ? 10 : 20;
    const skip = page === 1 ? 0 : 10 + (page - 2) * 20;
    const foods = await Food.find().skip(skip).limit(size);

    const totalFoods = await Food.countDocuments();

    res.status(200).json({
      message: "All food items",
      noOfFoods: foods.length,
      totalFoods,
      currentPage: page,
      totalPages: Math.ceil(totalFoods / size),
      data: foods,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting foods", error: error.message });
  }
};
exports.getAdminFood = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "All food items",

      data: foods,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting foods", error: error.message });
  }
};

exports.getSingleFood = async (req, res) => {
  try {
    const foodItem = await Food.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const reviews = await Review.find({ food: foodItem._id }).sort({
      createdAt: -1,
    });

    const similarFoods = await Food.find(
      {
        _id: { $ne: foodItem._id },
        $text: {
          $search: `${foodItem.description} ${foodItem.ingredients.join(
            " "
          )} ${foodItem.tags.join(" ")}`,
        }, // Search across multiple fields
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(8);

    res.json({
      foodItem,
      reviews,
      recommendations: similarFoods,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchFood = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let searchQuery = req.query.searchQuery;
  let size = page === 1 ? 10 : 20;
  const skip = page === 1 ? 0 : 10 + (page - 2) * 20;

  if (!searchQuery) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const totalFoods = await Food.countDocuments({
      $text: { $search: searchQuery },
    });

    const foods = await Food.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(size);
    res.status(200).json({
      totalFoods,
      data: foods,
      currentPage: page,
      totalPages: Math.ceil(totalFoods / size),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFood = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  try {
    const food = await Food.findById(id);

    // fs.unlink(`${food.image}`, (err) => {
    //   if (err) {
    //     return res.status(500).json({
    //       message: "Error deleting image",
    //       err,
    //     });
    //   }
    // });

    await Food.findByIdAndDelete(id);

    res.status(201).json({
      message: `Food with id ${id} successfully deleted`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Could not delete food with id ${id}`,
      error: error.message,
    });
  }
};

exports.filterByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = page === 1 ? 10 : 20;
    const skip = page === 1 ? 0 : 10 + (page - 2) * 20;
    const category = req.query.category;

    const totalFoods = await Food.countDocuments({ category });
    const foods = await Food.find({ category }).skip(skip).limit(size);
    console.log(page);
    res.status(200).json({
      message: `Foods in category: ${category}`,
      totalFoods,
      currentPage: page,
      totalPages: Math.ceil(totalFoods / size),
      data: foods,
    });
  } catch (error) {
    console.error("Error fetching food by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateFood = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    category,
    ingredients,
    tags,
    servingSuggestion,
    deliveryTime,
    existingImage,
  } = req.body;

  console.log(ingredients, tags);

  const ingrArray = ingredients.split(",").map((str) => str.trim());
  const tagsArray = tags.split(",").map((str) => str.trim());
  console.log(ingrArray, tagsArray);

  try {
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found." });
    }

    const updatedFields = {
      name,
      description,
      price: Number(price),
      deliveryTime: Number(deliveryTime),
      category,
      ingredients: ingrArray,
      tags: tagsArray,
      servingSuggestion,
      image: req.file ? `uploads/food/${req.file.name}` : existingImage,
    };

    if (req.file) {
      // fs.unlink(`${food.image}`, (err) => {
      //   if (err) {
      //     return res.status(500).json({
      //       message: "Error deleting image",
      //       err,
      //     });
      //   }
      // });
    }
    const updatedFood = await Food.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Food item updated successfully.",
      food: updatedFood,
    });
  } catch (error) {
    fs.unlink(`uploads/food/${req.file.name}`, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error deleting image",
          err,
        });
      }
    });
    console.log(error);
    return res.status(500).json({
      message: "Error updating food item.",
      error: error.message,
    });
  }
};
