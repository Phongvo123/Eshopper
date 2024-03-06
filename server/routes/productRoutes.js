const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

const router = express.Router();

router.post(
  "/create-product",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  productController.createProductController
);

router.get("/getall-product", productController.allProductController);
router.get("/getall-product-pagination", productController.paginationProductController)
router.get("/single-product/:id", productController.singleProductController);

router.delete(
  "/delete-product/:id",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  productController.deleteProductController
);

router.put(
  "/update-product/:id",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  productController.updateProductController
);

router.post("/product-filters", productController.filterProductController);

module.exports = router;
