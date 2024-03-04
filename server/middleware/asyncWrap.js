// import { createCustomError } from "../error/Custom-Error.js";

// const asyncWrapper = (fn, errorMessage, statusCode) => {
//   return async (req, res, next) => {
//     try {
//       if (!req.body) {
//         throw createCustomError(errorMessage, statusCode);
//       }

//       await fn(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

// export default asyncWrapper;

const asyncWrapper = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default asyncWrapper;

//  simply use all the error code its working properly and also asyncWrapper just copy both error (all) and  asyncWrapper
