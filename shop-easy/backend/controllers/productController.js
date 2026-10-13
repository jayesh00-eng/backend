const Product = require("../models/Product");

// GET: Products + Search + Filter + Pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      minPrice,
      maxPrice,
      page = 1,
      limit = 8,
    } = req.query;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(limit, 10) || 8)
    );

    const filter = {};

    if (search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    if (minPrice !== undefined && minPrice !== "") {
      const min = Number(minPrice);
      if (!Number.isFinite(min) || min < 0) {
        return res.status(400).json({
          message: "Invalid minimum price",
        });
      }
      filter.price = { ...filter.price, $gte: min };
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      const max = Number(maxPrice);
      if (!Number.isFinite(max) || max < 0) {
        return res.status(400).json({
          message: "Invalid maximum price",
        });
      }
      filter.price = { ...filter.price, $lte: max };
    }

    if (
      minPrice !== undefined &&
      minPrice !== "" &&
      maxPrice !== undefined &&
      maxPrice !== "" &&
      Number(minPrice) > Number(maxPrice)
    ) {
      return res.status(400).json({
        message: "Minimum price cannot exceed maximum price",
      });
    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res.json({
      products,
      currentPage,
      totalPages: Math.ceil(totalProducts / pageSize),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: Single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: "Invalid product ID",
    });
  }
};

// POST: Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description, image, stock } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      price === "" ||
      price === undefined ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "Valid name, category and price are required",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      description,
      image,
      stock: stock === "" || stock === undefined ? 0 : Number(stock),
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT: Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, description, image, stock } = req.body;

    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      return res.status(400).json({ message: "Invalid product name" });
    }

    if (
      category !== undefined &&
      (typeof category !== "string" || !category.trim())
    ) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (
      price !== undefined &&
      (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0)
    ) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (
      stock !== undefined &&
      (stock === "" || !Number.isFinite(Number(stock)) ||
        Number(stock) < 0 || !Number.isInteger(Number(stock)))
    ) {
      return res.status(400).json({ message: "Invalid stock" });
    }

    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (price !== undefined) updates.price = Number(price);
    if (category !== undefined) updates.category = category.trim();
    if (description !== undefined) updates.description = description;
    if (image !== undefined) updates.image = image;
    if (stock !== undefined) updates.stock = Number(stock);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Remove product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};