import Product from "../models/Product.js";


// GET PRODUCTS
export const getProducts = async (req, res) => {
  try {

    const products = await Product.find()
      .sort({ createdAt: -1 });

    return res.writeHead(200, {
      "Content-Type": "application/json",
    }).end(JSON.stringify(products));

  } catch (error) {

    console.log(error);

    return res.writeHead(500, {
      "Content-Type": "application/json",
    }).end(
      JSON.stringify({
        message: "Failed to get products",
      })
    );
  }
};


// GET SINGLE PRODUCT
export const getProduct = async (req, res, id) => {
  try {

    const product = await Product.findById(id);

    if (!product) {
      return res.writeHead(404, {
        "Content-Type": "application/json",
      }).end(
        JSON.stringify({
          message: "Product not found",
        })
      );
    }

    return res.writeHead(200, {
      "Content-Type": "application/json",
    }).end(JSON.stringify(product));

  } catch (error) {

    return res.writeHead(500, {
      "Content-Type": "application/json",
    }).end(
      JSON.stringify({
        message: "Failed to get product",
      })
    );
  }
};


// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      category,
      image,
      stock,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    return res.writeHead(201, {
      "Content-Type": "application/json",
    }).end(
      JSON.stringify({
        message: "Product added successfully",
        product,
      })
    );

  } catch (error) {

    console.log(error);

    return res.writeHead(500, {
      "Content-Type": "application/json",
    }).end(
      JSON.stringify({
        message: "Failed to add product",
      })
    );
  }
};


// UPDATE PRODUCT
export const updateProduct = async (
  req,
  res,
  id
) => {
  try {

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!product) {
      return res.writeHead(404, {
        "Content-Type": "application/json",
      }).end(
        JSON.stringify({
          message: "Product not found",
        })
      );
    }

    return res.writeHead(200, {
      "Content-Type": "application/json",
    }).end(
      JSON.stringify({
        message: "Product updated successfully",
        product,
      })
    );

  } catch (error) {

    console.log(error);

    return res.writeHead(500, {
      "Content-Type": "application/json",
    }).end(
      JSON.stringify({
        message: "Failed to update product",
      })
    );
  }
};


// DELETE PRODUCT
export const deleteProduct = async (
  req,
  res,
  id
) => {
  try {

    const product =
      await Product.findByIdAndDelete(id);

    if (!product) {
      return res.writeHead(404, {
        "Content-Type": "application/json",
      }).end(
        JSON.stringify({
          message: "Product not found",
        })
      );
    }

    return res.writeHead(200, {
      "Content-Type": "application/json",
    }).end(
      JSON.stringify({
        message: "Product deleted successfully",
      })
    );

  } catch (error) {

    console.log(error);

    return res.writeHead(500, {
      "Content-Type": "application/json",
    }).end(
      JSON.stringify({
        message: "Failed to delete product",
      })
    );
  }
};