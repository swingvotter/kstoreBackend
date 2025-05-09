const {
  createProduct,
  fetchProduct,
  deleteProduct,
  editProduct,
} = require("../controller/product");
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const cookieAuth = require("../middleware/cookieAuth");

router.post("/create", cookieAuth, upload.single("image"), createProduct);
router.get("/products", cookieAuth, fetchProduct);
router.patch("/edit/:id", cookieAuth, upload.single("image"), editProduct);
router.delete("/delete/:id", cookieAuth, deleteProduct);

module.exports = router;
