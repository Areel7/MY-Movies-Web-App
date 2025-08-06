import cron from "node-cron";
import Cart from "../Models/Cart.js";
import Movie from "../Models/Movie.js";

cron.schedule("* * * * * *", async () => {
  console.log("⏰ Running cron job to clear expired cart items...");
  const cutoff = new Date(Date.now() - 60 * 1000);
  const expired = await Cart.find({
    isPaid: false,
    createdAt: { $lt: cutoff },
  });

  for (const item of expired) {
    const movie = await Movie.findById(item.movieDetail);
    if (movie) {
      movie.quantity += item.quantity;
      await movie.save();
    }
    await Cart.deleteOne({ _id: item._id });
  }

  console.log(
    `✅ Cleared ${expired.length} item(s) at ${new Date().toISOString()}`
  );
});
