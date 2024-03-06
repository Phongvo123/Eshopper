const Category = require("../models/categoryModel");
const slugify = require("slugify");

//create category
const createCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    if (!image) {
      return res.status(401).send({ message: "Image is required" });
    }
    const existingCategory = await Category.findOne({ slug: slugify(name) });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exisits",
      });
    }
    const category = await Category.create({
      name,
      slug: slugify(name),
      image,
    });
    return res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Errro in Category",
    });
  }
};

//update category
const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const existingCategory = await Category.findOne({ slug: slugify(name) });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exisits",
      });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name), image },
      { new: true }
    );
    return res.status(201).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

//getAll category
const allCategoryController = async (req, res) => {
  try {
    const category = await Category.find();
    return res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

//get single category
const singleCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
    });
    return res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//delete category
const deleteCategoryCOntroller = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Categry Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  allCategoryController,
  singleCategoryController,
  deleteCategoryCOntroller,
};
