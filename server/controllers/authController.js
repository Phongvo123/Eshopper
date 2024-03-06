const User = require("../models/userModel");
const authHelper = require("../helpers/authHelper");
const JWT = require("jsonwebtoken");
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    //check user
    const exisitingUser = await User.findOne({ email: email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await authHelper.hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });
    return res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validations
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await authHelper.comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(201).send({
      success: true,
      message: "login successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    res.send({ error });
  }
};

const forgotPasswordController = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    if (!email) {
      return res.status(400).send({ message: "Emai is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "New Password is required" });
    }
    //check user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Wrong Email",
      });
    }
    const hashedPassword = await authHelper.hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    return res.status(201).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    return res.status(200).send({
      success: true,
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update user",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateUserController,
};
