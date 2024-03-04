import JWT from "jsonwebtoken";
import asyncWrapper from "./asyncWrap.js";
import Usermodel from "../model/userModels.js";

export const requiredSignIn = asyncWrapper(async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    // Verify the token with the provided secret key
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
});

export const isAdmin = asyncWrapper(async (req, res, next) => {
  try {
    const user = await Usermodel.findById(req.user._id);

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
