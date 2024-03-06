const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/create-order",
  authMiddleware.requireSignIn,
  orderController.createOrder
);

router.get(
  "/get-details-order/:id",
  authMiddleware.requireSignIn,
  orderController.getOrderDetails
);
router.get(
  "/get-order-by-userid/:id",
  authMiddleware.requireSignIn,
  orderController.getOrderByUserId
);

router.delete(
  "/cancel-order/:id",
  authMiddleware.requireSignIn,
  orderController.cancelOrderDetails
);

router.get(
  "/get-all-order",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  orderController.getAllOrder
);

router.get(
  "/user-cancel-order/:id",
  authMiddleware.requireSignIn,
  orderController.userCancelOrderDetails
);

router.get(
  "/complete-order/:id",
  authMiddleware.requireSignIn,
  orderController.completeOrder
);
module.exports = router;
