import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useCartContext } from "../context/Cart";
import { useAuthContext } from "../context/AuthFile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";

function CartPage() {
  const { auth, setAuth } = useAuthContext();
  const { cart, setCart } = useCartContext();
  const [clientToken, setClientToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [instance, setInstance] = useState("");
  const navigate = useNavigate();
  const totalPrice = () => {
    try {
      let total = 0;

      cart?.map((item) => {
        total = total + item.price * item.quantity;
      });

      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeCartItem = (pid) => {
    try {
      const myCart = [...cart];

      //   creates a new array
      //   const index = myCart.filter((item) => item._id !== pid);
      //   setCart(index);

      //   but it is updating or removing the item in original array

      let index = myCart.findIndex((item) => item._id !== pid);
      console.log(index);
      myCart.splice(index, 1);

      setCart(myCart);

      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/braintree/token`);

      console.log(data);

      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(`/api/v1/product/braintree/payment`, {
        nonce,
        cart,
      });

      console.log(nonce, cart);
      console.log(data);

      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const updatecart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );

    // const updatedCart = cart.map((item) =>
    //   item._id === productId ? { ...item, quantity: newQuantity } : item
    // );

    setCart(updatecart);

    localStorage.setItem("cart", JSON.stringify(updatecart));
  };
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {cart?.map((p, index) => {
              return (
                <div className="row m-2 card flex-row " key={index}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width={"200px"}
                      height={"200px"}
                    />
                  </div>
                  <div className="col-md-4 m-2">
                    <h4> Name: {p.name}</h4>
                    <p>{p.description.substring(0, 30)}</p>

                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleQuantityChange(p._id, p.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <span className="mx-2">{p.quantity}</span>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        handleQuantityChange(p._id, p.quantity - 1);

                        if (p.quantity <= 1) {
                          removeCartItem(p._id);
                        }
                      }}
                      // disabled={p.quantity === 1}
                    >
                      -
                    </button>

                    <h4>Price {p.price}</h4>
                    <h6>Quantity {p.quantity}</h6>
                  </div>

                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        removeCartItem(p._id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-md-4">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()} </h4>

            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                    // if we dont write state:"cart " when we login
                    //  it will show home page by default but if we write it
                    //  will navigate us to cart page directly after login
                  >
                    Plase Login to checkout
                  </button>
                )}
              </div>
            )}

            <div className="mt-2">
              {!clientToken || !auth?.token || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
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

export default CartPage;

// const removeCartItem = (pid) => {
//   try {
//     const myCart = [...cart];

//     //   creates a new array
//     //   const index = myCart.filter((item) => item._id !== pid);
//     //   setCart(index);

//     //   but it is updating or removing the item in original array

//     let index = myCart.findIndex((item) => item._id !== pid);
//     console.log(index);
//     myCart.splice(index, 1);

//     setCart(myCart);

//     localStorage.setItem("cart", JSON.stringify(myCart));
//   } catch (error) {
//     console.log(error);
//   }
// };

//   The first snippet is using the filter method. It creates a new array (index) by filtering out the items that satisfy the condition item._id !== pid. It returns a new array containing only the items that passed the condition. Then, it updates the myCart state with this new array using setCart(index).

// The second snippet is using the findIndex method to find the index of the first element in the array that satisfies the condition item._id !== pid. Once it finds the index, it uses the splice method to remove one element at that index from the myCart array. Then, it updates the myCart state with the modified array using setCart(myCart).

// Now, why are they not the same?

// The difference lies in how they handle the removal of the item:

// The filter method creates a new array without modifying the original array. It's a non-destructive operation.

// The splice method, on the other hand, directly modifies the original array by removing elements from it. It's a destructive operation.
