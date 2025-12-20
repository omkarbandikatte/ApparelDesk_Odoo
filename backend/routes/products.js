const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate, requireAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Public routes
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);

// Admin routes - support single OR multiple images
router.post(
  "/",
  authenticate,
  requireAdmin,
  upload.array("images", 5), // up to 5 images
  productController.createProduct
);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  upload.array("images", 5), // up to 5 images for update
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  productController.deleteProduct
);

module.exports = router;
