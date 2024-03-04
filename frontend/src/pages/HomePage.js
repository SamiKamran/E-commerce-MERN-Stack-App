import React, { useEffect, useState } from "react";
import Layout from "./Layout";

import Image from "../images/banner.png";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../Routes/Price";
import { useCartContext } from "../context/Cart";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const { cart, setCart } = useCartContext();

  const [categories, setCategories] = useState([]);

  const [products, setProduct] = useState([]);

  const [checked, setChecked] = useState([]);

  const [radio, setRadio] = useState([]);

  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [pageNumbers, setPageNumbers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [filtersActive, setFiltersActive] = useState(false);

  useEffect(() => {
    ProductPaginationBtn(currentPage);
  }, [currentPage]);

  const ProductPaginationBtn = async (page) => {
    try {
      const response = await axios.get(`/api/v1/product/product-list/${page}`);
      setData(response.data.products);
      setTotalPages(response.data.totalPages);
      setPageNumbers(response.data.pageNumbers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage((oldPage) => (oldPage === 1 ? totalPages : oldPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((oldPage) => (oldPage === totalPages ? 1 : oldPage + 1));
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/get-category`);

      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleFilter = async (value, id) => {
    let all = [...checked];

    if (value) {
      all.push(id);
    } else {
      all = all.filter((r) => r !== id);
    }

    setChecked(all);
    setRadio([]); // Reset the price filter when category filter changes
    setCurrentPage(1); // Reset current page to 1 when filters change

    setFiltersActive(true);
  };

  useEffect(() => {
    setCurrentPage(1);
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProducts();
  }, [checked, radio]);

  const filterProducts = async () => {
    try {
      const { data } = await axios.post(`/api/v1/product/product-filters`, {
        checked,
        radio,
        page: currentPage,
      });
      setData(data?.products);
      setProduct(data?.products);
      setTotalPages(data.totalPages);
      setPageNumbers(data.pageNumbers);
    } catch (error) {
      console.log(error);
    }
  };



  

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product`);
      if (data?.success) {
        setProduct(data.products);
      }
    } catch (error) {
      console.error("Error fetching categories:", error); // Log any errors
      toast.error("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const addToCart = (p) => {
    const existingProductIndex = cart.findIndex((item) => item._id === p._id);

    if (existingProductIndex !== -1) {
      // Product already exists in the cart, update the quantity
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Product doesn't exist in the cart, add a new entry with quantity 1
      setCart([...cart, { ...p, quantity: 1 }]);
    }

    localStorage.setItem("cart", JSON.stringify([...cart, p]));
    toast.success("Item Added to cart");
  };

  return (
    <Layout>
      <div className="Image">
        <img src={Image} alt="" />
        <div className="row">
          <div className="col-md-2 mt-2">
            <h6 className="text-center">Filter By Category</h6>
            <div className="d-flex flex-column">
              {categories?.map((c) => {
                return (
                  <Checkbox
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                    key={c._id}
                  >
                    {c.name}
                  </Checkbox>
                );
              })}
            </div>

            {/* Price Filter  */}
            <h6 className="text-center mt-4">Filter By Price </h6>
            <div className="d-flex flex-column">
              <Radio.Group
                onChange={(e) => {
                  setRadio(e.target.value);
                }}
              >
                {Prices?.map((p) => {
                  return (
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                  );
                })}
              </Radio.Group>
            </div>

            <div className="d-flex flex-column">
              <button
                className="btn btn-danger"
                onClick={() => {
                  setChecked([]); // Reset checked filters
                  setRadio([]); // Reset radio filters
                  setCurrentPage(1); // Reset currentPage to 1
                  getAllProducts(); // Fetch initial products
                  setFiltersActive(false);
                  window.location.reload();
                }}
              >
                RESET FILTERS
              </button>
            </div>
          </div>

          <div className="col-md-9 mt-2">
            <h5 className="text-center">All Products</h5>

            <div className="d-flex justify-content-center item-center  flex-wrap">
              {data?.map((p) => {
                return (
                  <div
                    className="card m-2"
                    key={p._id}
                    style={{ width: "18rem" }}
                  >
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">
                        {p.description.substring(0, 60)}...
                      </p>

                      <p className="card-text">${p.price}</p>
                      <p className="card-text">{p.slug}</p>
                      <button
                        className="btn btn-primary ms-1"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-dark ms-1"
                        onClick={() => {
                          addToCart(p);

                          // OR

                          // setCart([...cart, p]);

                          // localStorage.setItem(
                          //   "cart",
                          //   JSON.stringify([...cart, p])
                          // );
                          // toast.success("Item Added to cart");
                        }}
                      >
                        ADD TO CART
                      </button>
                      {/* // So, setCart([...cart, p]); is essentially updating the state of the shopping cart by adding a new product (p) to it. */}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* <ul>
              {data.map((item) => (
                <li key={item.id}></li>
              ))}
            </ul> */}

            <div className="d-flex justify-content-center item-center">
              {filtersActive ? (
                ""
              ) : (
                <>
                  <button
                    onClick={handlePrevPage}
                    // disabled={currentPage === 1}
                  >
                    {"<"}
                  </button>
                  {pageNumbers?.map((page) => (
                    <button
                      className="btn btn-dark ms-1 text-center mt-3 mb-3"
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={page === currentPage}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={handleNextPage}
                    // disabled={currentPage === totalPages}
                  >
                    {">"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;

{
  /* <div className="d-flex justify-content-center item-center">
              <button
                onClick={handlePrevPage}

                // disabled={currentPage === 1}
              >
                {"<"}
              </button>
              {pageNumbers?.map((page) => (
                <button
                  className="btn btn-dark ms-1 text-center mt-3 mb-3 "
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={page === currentPage}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNextPage}

                // disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </div> */
}



// As a front-end developer preparing for interviews, it's essential to focus on understanding fundamental concepts, mastering common tools and technologies, and being able to demonstrate problem-solving skills rather than memorizing specific projects or code snippets. However, there are some typical areas you can expect to be asked about or might want to practice:

// HTML/CSS Projects:

// Basic web page layouts.
// Responsive design techniques.
// CSS animations and transitions.
// Knowledge of CSS frameworks like Bootstrap or Tailwind CSS.
// JavaScript Projects:

// DOM manipulation.
// Event handling.
// AJAX requests.
// Manipulating data structures like arrays and objects.
// Implementing common algorithms and data structures in JavaScript.
// Framework/Library Specific Projects:

// If you're proficient in a specific framework like React, Angular, or Vue.js, practice building small to medium-sized applications using these frameworks.
// Understanding state management, component lifecycle, routing, etc., depending on the framework/library you're using.
// Responsive Design Projects:

// Creating websites or web applications that work well on various devices and screen sizes.
// Understanding media queries and flexible layouts.
// Version Control:

// Familiarize yourself with Git and GitHub. Practice tasks such as creating repositories, branching, merging, resolving conflicts, etc.
// Problem-solving Exercises:

// Practice solving algorithmic challenges on platforms like LeetCode, HackerRank, or CodeSignal. These exercises can help you demonstrate your problem-solving abilities and understanding of algorithms and data structures.
// Portfolio Projects:

// Build a portfolio website showcasing your projects. Ensure it's well-designed, responsive, and easy to navigate. Your portfolio should highlight your skills and experiences effectively.
// Remember, while practicing these projects, focus on understanding the underlying concepts and best practices. Interviewers are often interested in your problem-solving approach, understanding of core concepts, and ability to write clean and maintainable code rather than memorized solutions. Additionally, be prepared to discuss your previous projects and experiences in detail during interviews.