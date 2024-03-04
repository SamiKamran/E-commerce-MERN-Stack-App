// errorHandlerMiddleware.js
import { CustomAPIError } from "../error/Custom-Error.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  return res
    .status(500)
    .json({ msg: "Something went wrong, please check the error" });
};

export default errorHandlerMiddleware;
