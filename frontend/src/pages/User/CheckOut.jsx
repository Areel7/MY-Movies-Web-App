import { useEffect, useState } from "react";
import { useGetCartQuery } from "../../redux/api/cart";
import { useOrderMutation } from "../../redux/api/order";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    zip: "",
  });

  const navigate = useNavigate();

  const { data: cart, refetch } = useGetCartQuery();
  const [createOrder] = useOrderMutation();

  // State to manage the order confirmation message
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.cardNumber ||
        !formData.zip
      ) {
        return toast.error("Please fill all fields");
      }

      if (!/^\d{5}$/.test(formData.zip)) {
        return toast.error("ZIP code must be exactly 5 digits");
      }
      await createOrder({
        ...formData,
        cardNumber: formData.cardNumber.slice(-4),
      }).unwrap();

      toast.success("Order Placed Sucessfully");

      
      setOrderPlaced(true);

      setFormData({
        name: "",
        email: "",
        cardNumber: "",
        zip: "",
      });
      refetch();

      setTimeout(() => {
  navigate("/movies");
}, 3000); 


    } catch (error) {
      toast.error(`Error while placing order: ${error.message || error}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row gap-8">
        {/* Movie Details Section */}
        <div className="md:w-1/3 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold mb-4 text-purple-400">Checkout</h2>

          {cart?.cartItems?.length ? (
            cart.cartItems.map((item) => (
              <div key={item._id} className="mb-6">
                <img
                  src={`http://localhost:3000${item.movieDetail?.image}`}
                  alt={item.movieDetail?.name}
                  className="rounded-lg shadow-md mb-4 w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/400x600/000000/FFFFFF?text=Image+Not+Found";
                  }}
                />
                <h3 className="text-2xl font-semibold mb-2">
                  {item.movieDetail?.name}
                </h3>
                <p className="text-xl text-green-400 mb-1">
                  ${item.movieDetail?.price.toFixed(2)}
                </p>
                <p className="text-gray-400">Qty: {item.quantity}</p>
                <p className="text-gray-400">
                  Genre: {item.movieDetail?.genre?.name}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Your cart is empty</p>
          )}
        </div>

        {/* Checkout Form Section */}
        <div className="md:w-2/3">
          {orderPlaced ? (
            <div className="text-center text-green-500 text-2xl font-bold py-10">
              <p>Your order has been placed successfully!</p>
              <p className="text-lg text-white mt-4">
                Thank you for your purchase!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Your Information
              </h3>

              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <h3 className="text-2xl font-semibold mb-4 text-center">
                Payment Details
              </h3>

              {/* Card Number Input */}
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="**** **** **** ****"
                  maxLength="16"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label
                    htmlFor="cvv"
                    className="block text-gray-300 text-sm font-bold mb-2"
                  >
                    zip
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
              >
                Place Order
              </button>
            </form>
          )}
          <div className="flex justify-center  items-center my-10">
            <div className="text-3xl text-green-500">
              Total Price : $ {cart?.totalPrice?.toFixed(2) || "0.00"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
