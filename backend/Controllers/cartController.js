import Cart from "../Models/Cart.js";
import Movie from "../Models/Movie.js";

const getUserCart = async (req, res) => {
  try {
    // Get all cart items for this user
    const cartItems = await Cart.find({ user: req.user._id }).populate({
      path: "movieDetail",
      select: "name price image quantity genre",
      populate: {
        path: "genre",
        select: "name",
      },
    });

    if (!cartItems || cartItems.length === 0) {
      // after
      if (!cartItems || cartItems.length === 0) {
        return res.status(200).json({ cartItems: [], totalPrice: 0 });
      }
    }

    // Calculate grand total
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    res.status(200).json({
      cartItems,
      totalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  const { movieId, quantity } = req.body;

  try {
    // Find if this user already has this movie in cart
    let cart = await Cart.findOne({ user: req.user._id, movieDetail: movieId });

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    if (movie.quantity <= quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Deduct stock
    movie.quantity -= quantity;
    await movie.save();

    const price = movie.price;

    if (!cart) {
      // Create new cart entry
      cart = new Cart({
        user: req.user._id,
        movieDetail: movieId,
        quantity,
        price,
        totalPrice: quantity * price,
      });
    } else {
      // Update existing cart entry
      cart.quantity += quantity;
      cart.totalPrice = cart.quantity * cart.price;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  const { movieId } = req.params;

  try {
    const userId = req.user._id;

    const cartItem = await Cart.findOne({ user: userId, movieDetail: movieId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Restore quantity
    const movie = await Movie.findById(movieId);
    if (movie) {
      movie.quantity += cartItem.quantity;
      await movie.save();
    }

    // Remove item
    await Cart.findOneAndDelete({ user: userId, movieDetail: movieId });

    // Get updated cart
    const remainingItems = await Cart.find({ user: userId }).populate({
      path: "movieDetail",
      select: "name price image quantity genre",
      populate: { path: "genre", select: "name" },
    });

    if (!remainingItems || remainingItems.length === 0) {
      return res.status(200).json({ cartItems: [], totalPrice: 0 });
    }

    const totalPrice = remainingItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    return res.status(200).json({
      cartItems: remainingItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Error in removeCartItem:", error);
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user._id });

    for (const item of cart) {
      const movie = await Movie.findById(item.movieDetail);
      if (movie) {
        movie.quantity += item.quantity;
        await movie.save();
      }
    }

    await Cart.deleteMany({ user: req.user._id });

    res.status(200).json({ cartItems: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export { getUserCart, addToCart, removeCartItem, clearCart };
