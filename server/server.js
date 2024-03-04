import express from "express";
import connectDBS from "./db/connected.js";
import dotenv from "dotenv";

import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/CategoryRoute.js";
import productRoute from "./routes/ProductsRoute.js";

import morgan from "morgan";
import { fileURLToPath } from "url";
import cors from "cors";

import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/frontend/build"))); // Serve static files
app.use(morgan("dev")); // Use Morgan for logging
app.use(cors()); // Enable CORS

const PORT = process.env.PORT || 9000;

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

const start = async () => {
  try {
    await connectDBS(process.env.MONGO_URL);
    app.listen(PORT, () => console.log("Server Connected to the Port", PORT));
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

start();

// import express from "express";
// import connectDBS from "./db/connected.js";
// import dotenv from "dotenv";

// import authRoute from "./routes/authRoute.js";
// import categoryRoute from "./routes/CategoryRoute.js";
// import productRoute from "./routes/ProductsRoute.js";

// import morgan from "morgan";
// import { fileURLToPath } from "url";
// import cors from "cors";

// import path from "path";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const app = express();

// app.use(express.json());
// app.use(express.static(path.join(__dirname, "/frontend/build"))); // Serve static files
// app.use(morgan("dev")); // Use Morgan for logging
// app.use(cors()); // Enable CORS

// app.use(express.json());

// const PORT = process.env.PORT || 9000;

// app.use("/api/v1/auth", authRoute);

// app.use("/api/v1/category", categoryRoute);
// app.use("/api/v1/product", productRoute);

// app.use("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
// });

// const start = async () => {
//   try {
//     await connectDBS(process.env.MONGO_URL);
//     app.listen(PORT, () => console.log("Server Connected to the Port", PORT));
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//   }
// };

// start();
