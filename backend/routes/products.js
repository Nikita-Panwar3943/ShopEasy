import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ Multer config for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder name
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  },
});
const upload = multer({ storage });

// ✅ Add Product API
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, price, color, discount } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const product = new Product({
      name,
      price,
      color,
      discount,
      image: `/uploads/${req.file.filename}`, // store relative path
    });

    await product.save();
    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// backend/routes/products.js
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
