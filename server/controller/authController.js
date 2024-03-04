import { createCustomError } from "../error/Custom-Error.js";
import asyncWrapper from "../middleware/asyncWrap.js";
import { StatusCodes } from "http-status-codes";
import JWT from "jsonwebtoken";
import UserModel from "../model/userModels.js";
import bcrypt from "bcrypt";

import { comparePassword, hashPassword } from "../helpers/authHelper.js";

import {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} from "../error/index.js";
import orderModels from "../model/orderModels.js";

export const registerController = asyncWrapper(async (req, res, next) => {
  const { name, email, password, phone, address, answer } = req.body;

  if (!name) {
    throw new NotFoundError("Name is Required");
  }
  if (!email) {
    throw new NotFoundError("Email is Required");
  }

  if (!password) {
    throw new NotFoundError("Password is Required");
  }
  if (!phone) {
    throw new NotFoundError("Phone is Required");
  }
  if (!address) {
    throw new NotFoundError("Address is Required");
  }
  if (!answer) {
    throw new NotFoundError("Answer is Required");
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    return next(
      createCustomError(
        `Already Register please login Do IT NOW`,
        StatusCodes.CONFLICT
      )
    );
  }

  const hashedPassword = await hashPassword(password);

  // const user = await new userModels({name,email,phone,address,password: hashedPassword,}).save();

  // OR

  const user = await UserModel.create({
    name,
    email,
    phone,
    address,
    password: hashedPassword,
    answer,
  });

  return res
    .status(201)
    .json({ message: "User registered successfully.", success: true, user });
});

export const loginController = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new NotFoundError("Please Provide Email and Password");
  }

  const user = await UserModel.findOne({ email }).select("+password");

  // The select method in Mongoose is used to specify the fields that should be included or excluded from the query results. In the context of your code:
  if (!user) {
    throw new UnauthenticatedError("Email is not Registered");
  }

  const match = await comparePassword(password, user.password);

  if (!match) {
    throw new BadRequestError(
      "InValid Password Please Provide Correct Password"
    );
  }

  const token = await JWT.sign({ _id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(200).send({
    success: true,
    message: "Login Successfully",
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    },
    token,
  });
});

export const forgotPasswordController = async (req, res) => {
  const { email, answer, currentPassword, newPassword, confirmPassword } =
    req.body;

  if (!email) {
    throw new NotFoundError("Email is Reuqired");
  }
  if (!newPassword) {
    throw new NotFoundError("New Password is Reuqired");
  }
  if (!currentPassword) {
    throw new NotFoundError("Current password is required");
  }
  if (!answer) {
    throw new NotFoundError("Answer is Reuqired");
  }

  if (newPassword !== confirmPassword) {
    throw new NotFoundError("New passwords do not match");
  }

  const user = await UserModel.findOne({ email, answer });

  if (!user) {
    throw new BadRequestError("Wrong Email or Answer");
  }
  if (!user.password) {
    throw new BadRequestError("User password is not available");
  }
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new BadRequestError("Current password is incorrect");
  }

  const hashed = await hashPassword(newPassword);

  await UserModel.findByIdAndUpdate(user._id, { password: hashed });

  res.json({ success: true, message: " Password  Reset Successfully" });
};

export const updateProfileController = asyncWrapper(async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  const user = await UserModel.findById(req.user._id);

  if (password && password.length < 6) {
    return res
      .status(400)
      .send({ error: "The password must be at least 6 characters long." });
  }

  const hashedPassword = await hashPassword(password);

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: name || user.name,
      password: hashedPassword || user.password,
      phone: phone || user.phone,
      address: address || user.address,
    },
    { new: true }
  );
  res.status(200).send({
    success: true,
    message: "  Updated the Profile Successfully  ",
    updatedUser,
  });
});

export const getOrderController = async (req, res) => {
  try {
    const orders = await orderModels
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting  the Orders ",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModels
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
export const OrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const orders = await orderModels.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders Status",
      error,
    });
  }
};
