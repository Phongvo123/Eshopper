const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Email = require("../controllers/emailController");

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt,
      email,
      status = "Đang vận chuyển",
    } = req.body;
    const promises = orderItems.map(async (order) => {
      const productData = await Product.findOneAndUpdate(
        {
          _id: order.product,
          quantity: { $gte: order.amount },
        },
        {
          $inc: {
            quantity: -order.amount,
            selled: +order.amount,
          },
        },
        {
          new: true,
        }
      );
      if (productData) {
        return {
          status: "OK",
          message: "SUCCESS",
        };
      } else {
        return {
          status: "OK",
          message: "ERR",
          id: order.product,
        };
      }
    });
    const results = await Promise.all(promises);
    const newData = results && results.filter((item) => item.id);
    if (newData.length) {
      const arrId = [];
      newData.forEach((item) => {
        arrId.push(item.id);
      });
      return res.status(404).send({
        success: false,
        message: `San pham voi id: ${arrId.join(",")} khong du hang`,
      });
    } else {
      const order = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user,
        isPaid,
        paidAt,
        email,
        status,
      });
      if (order) {
        // await Email.sendEmailCreateOrder(email, fullName);
        return res.status(200).send({
          success: true,
          message: "success",
          order,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById({
      _id: orderId,
    });
    return res.status(200).send({
      success: true,
      message: "Get Order Details Successfully",
      order,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error While getting Order Details",
    });
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({
      user: userId,
    }).sort({ createdAt: -1, updatedAt: -1 });
    if (orders === null) {
      return res.status(404).send({
        success: false,
        message: "The orders is not defined",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "SUCCESS",
        orders,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error While getting Orders By UserId",
    });
  }
};

const cancelOrderDetails = async (req, res) => {
  try {
    const data = req.body.orderItems;
    const orderId = req.body.orderId;
    let order = [];
    const promises = data.map(async (order) => {
      const productData = await Product.findOneAndUpdate(
        {
          _id: order.product,
          selled: { $gte: order.amount },
        },
        {
          $inc: {
            quantity: +order.amount,
            selled: -order.amount,
          },
        },
        { new: true }
      );
      if (productData) {
        order = await Order.findByIdAndDelete(orderId);
        if (order === null) {
          return {
            status: "ERR",
            message: "The order is not defined",
          };
        } else {
          return {
            status: "OK",
            message: "SUCCESS",
            id: order.product,
          };
        }
      }
    });
    const results = await Promise.all(promises);
    const newData = results && results[0] && results[0].id;
    if (newData) {
      return res.status(404).send({
        success: false,
        message: `San pham voi id: ${newData} khong ton tai`,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Hủy đơn hàng thành công",
        order,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Lỗi trong quá trình hủy đơn hàng",
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Get All Order Successfully",
      allOrder,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error",
    });
  }
};

const userCancelOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "Chờ hủy" },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Yêu cầu hủy đơn hàng",
      order,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Lỗi trong quá trình yêu cầu hủy đơn hàng",
    });
  }
};

const completeOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "Đã giao hàng",
        isPaid: true,
        isDelivered: true,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Đơn hàng đã giao",
      order,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Lỗi trong quá trình giao đơn hàng",
    });
  }
};

module.exports = {
  createOrder,
  getOrderDetails,
  getOrderByUserId,
  cancelOrderDetails,
  getAllOrder,
  userCancelOrderDetails,
  completeOrder,
};
