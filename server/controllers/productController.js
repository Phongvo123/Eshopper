const slugify = require("slugify");
const Product = require("../models/productModel");
const fs = require("fs");

const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, rating, image } =
      req.body;
    //validations
    switch (true) {
      case !name:
        return res.status(404).send({ error: "Name is Required" });
      case !description:
        return res.status(404).send({ error: "Description is Required" });
      case !price:
        return res.status(404).send({ error: "Price is Required" });
      case !category:
        return res.status(404).send({ error: "Category is Required" });
      case !quantity:
        return res.status(404).send({ error: "Quantity is Required" });
      case !rating:
        return res.status(404).send({ error: "Rating is Required" });
      case !image:
        return res.status(500).send({ error: "Image is Required" });
    }
    const checkProduct = await Product.findOne({ slug: slugify(name) });
    if (checkProduct) {
      return res.status(200).send({
        success: false,
        message: "Product Already Exisits",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      quantity: Number(quantity),
      rating,
      image,
      slug: slugify(name),
    });
    return res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

//get all product
const allProductController = async (req, res) => {
  try {
    const { limit = null, page = 0, filter } = req.query;
    let allProducts = [];
    const counTotal = await Product.countDocuments();
    if (filter) {
      const label = filter[0];
      const allObjectFilter = await Product.find({
        [label]: { $regex: filter[1] },
      })
        .populate("category")
        .limit(limit)
        .skip(page * limit)
        .sort({ createdAt: -1, updatedAt: -1 });
      return res.status(200).send({
        success: true,
        message: "AllProducts",
        allObjectFilter,
        totalProduct: counTotal,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(counTotal / limit),
      });
    }
    if (!limit) {
      allProducts = await Product.find()
        .populate("category")
        .sort({ createdAt: -1, updatedAt: -1 });
    } else {
      allProducts = await Product.find()
        .populate("category")
        .limit(limit)
        .skip(page * limit)
        .sort({ createdAt: -1, updatedAt: -1 });
    }
    return res.status(200).send({
      success: true,
      message: "AllProducts",
      allProducts,
      totalProduct: counTotal,
      pageCurrent: Number(page + 1),
      totalPage: Math.ceil(counTotal / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};

//single product
const singleProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId }).populate(
      "category"
    );
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

//delete product
const deleteProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete({
      _id: req.params.id,
    }).populate("category");
    return res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//update product
const updateProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { ...data, slug: slugify(data?.name) },
      {
        new: true,
      }
    ).populate("category");
    return res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

//product filter
const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length > 0) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }
    const products = await Product.find(args).populate("category");
    return res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

//product pagination 
const paginationProductController = async (req, res) => {
  try {
    const page = req.query.page || 1
    const ITEM_PER_PAGE = 5
    const skip = (page - 1)*ITEM_PER_PAGE
    const countProduct = await Product.countDocuments();
    const allProducts = await Product.find().limit(ITEM_PER_PAGE).populate("category").skip(skip).sort({createdAt: -1, updatedAt: -1});
    return res.status(200).send({
      success: true,
      message: "All Products List",
      allProducts,
      totalProduct: countProduct,
      totalPage: Math.ceil(countProduct / ITEM_PER_PAGE)
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting all product",
    });
  }
};

module.exports = {
  createProductController,
  allProductController,
  singleProductController,
  deleteProductController,
  updateProductController,
  filterProductController,
  paginationProductController
};
