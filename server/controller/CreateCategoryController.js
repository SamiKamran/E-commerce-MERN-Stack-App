import slugify from "slugify";
import categoryModel from "../model/CategoryModel.js";
import { BadRequestError, NotFoundError } from "../error/index.js";
import asyncWrapper from "../middleware/asyncWrap.js";

export const createCategoryController = asyncWrapper(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new BadRequestError("Name is required");
  }

  const existingCategory = await categoryModel.findOne({ name });

  if (existingCategory) {
    return res.status(200).send({
      success: false,
      message: "Category Already Exists",
    });
  }

  const category = await categoryModel.create({ name, slug: slugify(name) });

  res.status(201).send({
    success: true,
    message: "New category created",
    category,
  });
});

export const updateCategoryController = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    throw new BadRequestError("Name is required");
  }

  const category = await categoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );

  res.status(200).send({
    success: true,
    message: "Category Updated Successfully ",
    category,
  });
});

export const AllCategoryController = asyncWrapper(async (req, res) => {
  const category = await categoryModel.find({});

  res.status(200).send({ success: true, message: "All Categories", category });
});

export const DeleteCategoryController = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  await categoryModel.findByIdAndDelete(id);
  res.status(200).send({
    success: true,
    message: "Category Deleted Successfully",
  });
});

export const SingleCategoryController = asyncWrapper(async (req, res) => {
  const category = await categoryModel.findOne({ slug: req.params.slug });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  res.status(200).send({
    success: true,
    message: "Single Category Found",
    category,
  });
});
