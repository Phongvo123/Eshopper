const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.get(
  "/test",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  authController.testController
);

//protected route auth
router.get("/user-auth", authMiddleware.requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get(
  "/admin-auth",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  (req, res) => {
    res.status(200).send({ ok: true });
  }
);

//Forgot Password || POST
router.post("/forgot-password", authController.forgotPasswordController);

//Update User
router.put(
  "/update-user/:id",
  authMiddleware.requireSignIn,
  authController.updateUserController
);

module.exports = router;
