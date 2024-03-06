const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/create-category",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  categoryController.createCategoryController
);

router.put(
  "/update-category/:id",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  categoryController.updateCategoryController
);

router.get("/getall-category", categoryController.allCategoryController);

router.get("/single-category/:id", categoryController.singleCategoryController);

router.delete(
  "/delete-category/:id",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  categoryController.deleteCategoryCOntroller
);

module.exports = router;
