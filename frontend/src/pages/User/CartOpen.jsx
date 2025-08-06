// src/pages/CartOpen.jsx or similar

import { useEffect, useState } from "react";
import Cart from "../User/Cart"; // adjust path as needed

const CartOpen = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Automatically open the cart when this component mounts
  useEffect(() => {
    setIsCartOpen(true);
  }, []);

  return (
    <div>
      <Cart open={isCartOpen} setOpen={setIsCartOpen} />

             <button
        onClick={() => setIsCartOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Cart
      </button>
      
    </div>
  );
};

export default CartOpen;

