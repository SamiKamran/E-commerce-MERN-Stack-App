import { createContext, useContext, useEffect, useState } from "react";

const CartAuthContext = createContext();
export const useCartContext = () => useContext(CartAuthContext);

function Cart({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let existingCart = localStorage.getItem("cart");
    if (existingCart) {
      setCart(JSON.parse(existingCart));
    }
  }, []);
  return (
    <CartAuthContext.Provider value={{ cart, setCart }}>
      {children}
    </CartAuthContext.Provider>
  );
}

export default Cart;
