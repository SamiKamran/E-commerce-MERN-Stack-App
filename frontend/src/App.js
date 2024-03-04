import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/ForgotPassword";
import GrandPermissionPrivateRoute from "./Routes/GrandPermissionPrivateRoute";
import AdminDashBoard from "./Admin/AdminDashBoard";
import AdminProtectedRoute from "./Routes/AdminProtectedRoute";
import DashBoard from "./user/DashBoard";
import CreateCategory from "./Admin/CreateCategory";
import CreateProduct from "./Admin/CreateProduct";
import Product from "./Admin/Product";
import NowUpdateProduct from "./Admin/NowUpdateProduct";
import Search from "./pages/Search";
import CartPage from "./pages/CartPage";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import Profile from "./user/Profile";
import AdminOrder from "./Admin/AdminOrder";
import Orders from "./user/Orders";

// react login register forgot password header and home page
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categories" element={<Categories />} />

        <Route path="/category/:slug" element={<CategoryProduct />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        {/* user Protected  route  */}

        <Route path="/dashboard" element={<GrandPermissionPrivateRoute />}>
          <Route path="user" element={<DashBoard />} />

          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>

        {/* admin Protected  route  */}
        <Route path="/dashboard" element={<AdminProtectedRoute />}>
          <Route path="admin" element={<AdminDashBoard />} />

          <Route path="admin/create-category" element={<CreateCategory />} />

          <Route path="admin/create-product" element={<CreateProduct />} />

          <Route path="admin/product/:slug" element={<NowUpdateProduct />} />

          <Route path="admin/products" element={<Product />} />

          <Route path="admin/orders" element={<AdminOrder />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-Password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;

// Much more to learn in Header component ?

// In your code, the active class you mentioned is a part of Bootstrap's NavLink component from react-router-dom. When a NavLink corresponds to the current URL, it gets the active class automatically applied to it by the NavLink component, allowing you to style active links differently.

// ms-auto: It stands for "margin start auto." It applies margin-left: auto;, pushing the element to the rightmost side of its container within a flex layout.

// me-auto: It stands for "margin end auto." It applies margin-right: auto;, pushing the element to the leftmost side of its container within a flex layout.

// m-auto : center it
