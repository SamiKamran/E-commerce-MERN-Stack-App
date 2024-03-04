import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { useCartContext } from "../context/Cart";
import toast from "react-hot-toast";

function ProductDetails() {
  const { cart, setCart } = useCartContext();
  const [product, setProduct] = useState([]);
  const [productRelated, setRelatedProducts] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) getSingleProduct();
  }, [params?.slug]);

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      console.log(data?.products);

      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  //   one problem  is that you are creating two function  with same name addToCart

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
      <div className="row container">
        <div className="col-md-6 mt-5">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top mt-3"
            alt={product.name}
            height={"500px"}
            width={"500px"}
          />
        </div>

        <div className="col-md-6 mt-3 product-details-info">
          <h1 className="text-center mt-5">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>Price : {product.price}</h6>
          <h6>Category : {product?.category?.name}</h6>
          <button
            className="btn btn-secondary ms-1"
            onClick={() => {
              addToCart(product);
            }}
          >
            ADD TO CART
          </button>
        </div>

        <div className="d-flex flex-wrap">
          {productRelated?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={p._id ? `/api/v1/product/product-photo/${p._id}` : ""}
                className="card-img-top"
                alt={p.name}
              />

              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price"></h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr />
    </Layout>
  );
}

export default ProductDetails;
