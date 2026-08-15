import Product from "../models/Product.js";

// @route POST /api/products  (seller only)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user.userId, // taken from JWT, not from request body — prevents faking ownership
      status: "pending",
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products  (public — only approved products)
export const getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, search } = req.query;

    const filter = { status: "approved" };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const products = await Product.find(filter).populate("seller", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products/:id  (public)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/products/:id  (seller who owns it, or admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isOwner = product.seller.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to edit this product" });
    }

    Object.assign(product, req.body);
    // if a seller edits their product, it needs re-approval
    if (isOwner && !isAdmin) product.status = "pending";

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/products/:id  (seller who owns it, or admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isOwner = product.seller.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/products/:id/approve  (admin only)
export const approveProduct = async (req, res) => {
    try {
      console.log("Product ID:", req.params.id);
      console.log("Status:", req.body.status);
  
      const id = req.params.id.trim();

      console.log("ID length:", id.length);
      console.log("ID:", JSON.stringify(id));

      const product = await Product.findOne({ _id: id });
      console.log("Request ID:", req.params.id);

      const allProducts = await Product.find();
      console.log("Products in DB:", allProducts.map(p => p._id.toString()));
      console.log("Found product:", product);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      product.status = req.body.status;
      await product.save();
  
      console.log("Updated product:", product);
  
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };