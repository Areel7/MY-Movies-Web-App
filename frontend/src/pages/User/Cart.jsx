import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
// import banner from "../../assets/online-cinema-banner-with-computer-monitor-popcorn-3d-glasses-film-strip-cinematography-online-movie-banner-sign-bright-poster-illustration-vector.jpg";
import { Link } from "react-router-dom";
import {
  useGetCartQuery,
  useRemoveItemFromCartMutation,
} from "../../redux/api/cart";
import { toast } from "react-toastify";

const Cart = ({ open, setOpen }) => {
  // const [open, setOpen] = useState(true);
  const { data: cart, isLoading, isError, refetch } = useGetCartQuery();
  const [removeItemFromCart] = useRemoveItemFromCartMutation();
  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (cart?.cartItems) {
      setLocalCart(cart.cartItems);
    }
  }, [cart?.cartItems]);

  // Control scrolling
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const removeItem = async (movieId) => {
    try {
      await removeItemFromCart(movieId).unwrap();
      setLocalCart((prevItems) =>
        prevItems.filter((item) => item.movieDetail._id !== movieId)
      );

      toast.success("Item successfully removed");
    } catch (error) {
      console.error("Error removing item: ", error);
      toast.error("Failed to remove item");
    }
  };

  const totalQty = localCart.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    localCart.reduce((sum, item) => sum + item.quantity * item.price, 0) || 0;

  return (
    <div>
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition-all duration-500 ease-in-out bg-black text-white shadow-xl">
                <div className="flex h-full flex-col overflow-y-auto">
                  <div className="flex items-start justify-between p-6 border-b border-gray-700">
                    <DialogTitle className="text-lg font-semibold text-gray-300">
                      Shopping Cart
                    </DialogTitle>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="text-gray-500 hover:text-gray-400"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="flex-1 px-4 py-6 sm:px-6">
                    <ul className="-my-6 divide-y divide-gray-700">
                      {isLoading ? (
                        <p className="text-center text-gray-400">Loading...</p>
                      ) : isError ? (
                        <p className="text-center text-gray-400">
                          Your cart is empty
                        </p>
                      ) : !localCart.length ? (
                        <p className="text-center text-gray-400">
                          Your cart is empty
                        </p>
                      ) : (
                        localCart.map((item) => (
                          <li key={item._id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-700">
                              <img
                                src={`http://localhost:3000${item.movieDetail?.image}`}
                                alt={item.movieDetail?.name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div className="flex justify-between text-base font-medium text-gray-300">
                                <h3>
                                  {item.movieDetail?.name || "Unknown Movie"}
                                </h3>
                                <p className="ml-4">
                                  {item.movieDetail?.price != null
                                    ? `$${item.movieDetail.price.toFixed(2)}`
                                    : "N/A"}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.movieDetail?.genre?.name ||
                                  "Uncategorized"}
                              </p>
                              <div className="flex justify-between text-sm mt-2">
                                <p className="text-gray-500">
                                  Qty {item.quantity}
                                </p>
                                <button
                                  onClick={() =>
                                    removeItem(item.movieDetail._id)
                                  }
                                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  <div className="border-t border-gray-700 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-300">
                      <p>Subtotal</p>
                      <p>
                        $
                        {cart?.cartItems?.length
                          ? totalPrice.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Total Items: {totalQty}
                    </div>
                    <div className="mt-6">
                      {!localCart.length || totalPrice === 0 ? (
                        <div className="flex justify-center items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700">
                          Your Cart is Empty
                        </div>
                      ) : (
                        <Link
                          to="/cart/checkout"
                          className="flex justify-center items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
                        >
                          Checkout
                        </Link>
                      )}
                    </div>
                    <div className="mt-6 flex justify-center text-sm text-gray-500">
                      <p>
                        or{" "}
                        <Link
                          onClick={() => setOpen(false)}
                          className="text-indigo-400 hover:text-indigo-300"
                          to="/movies"
                        >
                          Continue Shopping &rarr;
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Cart;
