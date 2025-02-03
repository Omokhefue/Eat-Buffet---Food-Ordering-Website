const { Router } = require("express");
const router = Router();

const uploadMiddleware = require("../middleware/imageUpload");

const {
  addFood,
  getAllFood,
  removeFood,
  getSingleFood,
  searchFood,
  getAdminFood,
  filterByCategory,
  updateFood,
} = require("../controllers/food");

router.get("/all", getAllFood);
router.put(
  "/update/:id",
  (req, res, next) => {
    if (req.files && req.files.image) {
      return uploadMiddleware("food")(req, res, next);
    }
    next();
  },
  updateFood
);
router.get("/filterByCategory", filterByCategory);
router.get("/admin", getAdminFood);
router.get("/search", searchFood);
router.get("/:id", getSingleFood);
router.post("/add", uploadMiddleware("food"), addFood);
router.delete("/delete/:id", removeFood);

module.exports = router;
