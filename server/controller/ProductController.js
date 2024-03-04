import slugify from "slugify";
import { NotFoundError } from "../error/index.js";
import asyncWrapper from "../middleware/asyncWrap.js";
import ProductModel from "../model/ProductModel.js";
import OrderModels from "../model/orderModels.js";

import fs from "fs";

import { json } from "express";
import CategoryModel from "../model/CategoryModel.js";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();
// payment GateWay
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// throw new NotFoundError("Name is Required");
export const createProductController = asyncWrapper(async (req, res) => {
  const { name, description, price, category, quantity, shipping } = req.fields;
  const { photo } = req.files;

  switch (true) {
    case !name:
      throw new NotFoundError("Name is Required");
    case !description:
      throw new NotFoundError("description is Required");
    case !price:
      throw new NotFoundError("price is Required");
    case !category:
      throw new NotFoundError("category is Required");
    case !quantity:
      throw new NotFoundError("quantity is Required");
    case photo && photo.size > 100000:
      return res
        .status(500)
        .send({ error: "photo is Required and should be less then 1mb" });
  }

  const products = new ProductModel({ ...req.fields, slug: slugify(name) });

  if (photo) {
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }

  await products.save();
  res.status(200).send({
    success: true,
    message: "Product Created Successfully",
    products,
  });
});

export const getAllProductController = asyncWrapper(async (req, res) => {
  const products = await ProductModel.find({})
    .populate("category")
    .select("-photo")
    .limit(12)
    .sort({ createdAt: -1 });

  res.status(200).send({
    success: true,
    countTotal: products.length,
    message: "All Products",
    products,
  });
});

export const deleteProductController = asyncWrapper(async (req, res) => {
  const product = await ProductModel.findByIdAndDelete(req.params.pid);

  res.status(200).send({
    success: true,
    message: " Deleting the product successfully  ",
    product,
  });
});

export const SingleProdctControllr = asyncWrapper(async (req, res) => {
  const product = await ProductModel.findOne({ slug: req.params.slug })
    .populate("category")
    .select("-photo");

  res.status(200).send({
    success: true,
    message: " Single the  Product Fetched  ",
    product,
  });
});
// export const productPhotoContrller = asyncWrapper(async (req, res) => {
//   const product = await ProductModel.findById(req.params.pid).select("photo");

//   if (product.photo.data) {
//     res.set("Content-type", product.photo.contentType);
//     return res.status(200).send(product.photo.data);
//   }
// });

export const productPhotoContrller = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error IN Getting  Photo  ",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Updated  Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating the product",
    });
  }
};

export const productFiltersController = asyncWrapper(async (req, res) => {
  const { checked, radio } = req.body;

  const args = {};

  if (checked.length > 0) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

  const products = await ProductModel.find(args);
  res.status(201).send({
    success: true,
    products,
  });
});

export const productCountController = asyncWrapper(async (req, res) => {
  const total = await ProductModel.find({}).estimatedDocumentCount();

  res.status(200).send({
    success: true,
    total,
  });
});

export const productListController = async (req, res) => {
  try {
    const perPage = 3;

    const page = req.params.page ? req.params.page : 1;

    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalProducts = await ProductModel.countDocuments();

    const totalPages = Math.ceil(totalProducts / perPage);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    res.status(200).json({
      success: true,
      products,
      totalPages,
      currentPage: page,
      pageNumbers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message, // Sending error message for debugging
      message: "Error fetching the products",
    });
  }
};

export const SearchProductController = asyncWrapper(async (req, res) => {
  const { keyword } = req.params;

  const result = await ProductModel.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  }).select("-photo");

  res.json(result);
});

export const relatedProductController = asyncWrapper(async (req, res) => {
  const { pid, cid } = req.params;

  const products = await ProductModel.find({
    category: cid,
    _id: { $ne: pid },
  })
    .select("-photo")
    .limit(4)
    .populate("category");

  res.status(200).send({
    success: true,
    products,
  });
});

export const productCategroyController = async (req, res) => {
  try {
    // Use findOne to get a single category based on the provided slug
    const category = await CategoryModel.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Use the category _id to find products
    const products = await ProductModel.find({
      category: category._id,
    }).populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting Category Product",
    });
  }
};

export const braintreeTokenController = asyncWrapper(async (req, res) => {
  try {
    // Generate client token
    const response = await gateway.clientToken.generate({});
    res.status(200).send(response);
  } catch (error) {
    // Handle errors
    res.status(500).send(error);
  }
});

export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;

    // Calculate total amount
    cart.forEach((item) => {
      total += item.price;
    });

    // Create new transaction
    const result = await gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      // Save order to database
      const order = await new OrderModels({
        products: cart,
        payment: result,
        buyer: req.user._id,
      }).save();
      res.json({ ok: true });
    } else {
      // Handle transaction failure
      res.status(500).send(result.message);
    }
  } catch (error) {
    // Handle other errors
    console.log(error);
    res.status(500).send(error.message);
  }
};

// export const braintreeTokenController = asyncWrapper(async (req, res) => {
//   // token is getting from gateway ok
//   gateway.clientToken.generate({}, function (err, response) {
//     if (!gateway) {
//       throw new Error("Braintree gateway is not properly initialized.");
//     }

//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(200).send(response);
//     }
//   });
// });

// //  before creating this payment Method we want store our order in our database
// export const braintreePaymentController = async (req, res) => {
//   try {
//     const { nonce, cart } = req.body;
//     let total = 0;
//     cart.map((i) => {
//       total += i.price;
//     });
//     let newTransaction = gateway.transaction.sale(
//       {
//         amount: total,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       function (error, result) {
//         if (result) {
//           const order = new OrderModels({
//             products: cart,
//             payment: result,
//             buyer: req.user._id,
//           }).save();
//           res.json({ ok: true });
//         } else {
//           res.status(500).send(error);
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
