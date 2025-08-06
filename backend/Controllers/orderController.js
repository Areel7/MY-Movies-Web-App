import Order from "../Models/Order.js";
import Cart from "../Models/Cart.js";

const placeOrder = async (req, res) => {
  const { name, email, cardNumber, zip } = req.body;

  try {
    // Get all cart items for the user
    const cartItems = await Cart.find({ user: req.user._id }).populate({
      path: "movieDetail",
      select: "name price genre",
      populate: {
        path: "genre",
        select: "name",
      },
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Prepare order items
    const orderItems = cartItems.map((item) => ({
      name: item.movieDetail?.name || "Unknown",
      price: item.movieDetail?.price || 0,
      genre: item.movieDetail?.genre?.name || "Uncategorized",
      quantity: item.quantity || 1,
    }));

    // Calculate total price
    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create and save the order
    const order = new Order({
      user: req.user._id,
      name,
      email,
      cardNumber: cardNumber.slice(-4),
      zip,
      items: orderItems,
      total,
    });

    await order.save();

    // Clear the cart (restore quantities if needed)
    await Cart.deleteMany({ user: req.user._id });

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: error.message });
  }
};

export { placeOrder };
