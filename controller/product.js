const Product = require("../model/product");
const User = require("../model/user");
const {
  cloudinaryUploader,
  cloudinaryDeleter,
} = require("../util/cloudinaryHelper");
const fs = require("fs");

//creating prodct start here

const createProduct = async (req, res) => {
  const { name, price } = req.body;

  try {
    if (!name || !price) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }
    const { public_id, url } = await cloudinaryUploader(req.file.path);

    console.log(req.user.user_id);

    // Find user in local DB
    const user = await User.findOne({ user_id: req.user.user_id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const product = await Product.findOne({ name });

    if (product) {
      return res.status(400).json({
        success: false,
        message: "product with that name already exist",
      });
    }

    const createdProduct = await Product.create({
      name,
      price,
      image_url: url,
      public_id,
      userId: user._id,
    });

    if (req.file) fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//fetch all product start here
const fetchProduct = async (req, res) => {
  try {
    const products = await Product.find({});

    return res.status(200).json({
      success: true,
      message: "product ferched successfully",
      allProduct: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//delete product start here
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "id is missing",
    });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product do not exist with that id",
      });
    }

    const user = await User.findOne({ user_id: req.user.user_id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (product.userId.toString() !== user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "cannot delete a post that was not yours",
      });
    }

    //delete from cloudinary start here

    await cloudinaryDeleter(product.public_id);

    //delete from database
    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `product with id: ${id} has been deleted successfully`,
      id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//edit prodct start here
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!id || !name || !price) {
    return res
      .status(400)
      .json({ success: false, message: "all fields are required" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product do not exist",
      });
    }

    const user = await User.findOne({ user_id: req.user.user_id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (product.userId.toString() !== user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "cannot edit a post that was not yours",
      });
    }

    let url;
    let public_id;

    if (req.file) {
      await cloudinaryDeleter(product.public_id);
      const result = await cloudinaryUploader(req.file.path);
      url = result.url;
      public_id = result.public_id;

      //deletefrom from local machine
      fs.unlinkSync(req.file.path);
    }

    product.name = name;
    product.price = price;
    product.image_url = url || product.image_url;
    product.public_id = public_id;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `product has been updated successfully`,
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createProduct, fetchProduct, deleteProduct, editProduct };
