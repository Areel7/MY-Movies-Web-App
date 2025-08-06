import { Link } from "react-router";

const MovieTabs = ({
  userInfo,
  submitHandler,
  comment,
  setComment,
  rating,
  setRating,
  movie,
}) => {
  return (
    <div>
      <section>
        {userInfo ? (
          <form onSubmit={submitHandler}>
            {/* ⭐ Rating Stars */}
            <div className="flex items-center mb-4">
              <label className="block text-xl mr-4">Rate this movie:</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-400"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* 💬 Comment Box */}
            <div className="my-2">
              <label htmlFor="comment" className="block text-xl mb-2">
                Write Your Review
              </label>
              <textarea
                id="comment"
                rows="6"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="p-2 border rounded-lg xl:w-[40rem] text-black"
              ></textarea>
            </div>

            {/* ✅ Submit Button */}
            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-4 ml-5 rounded-lg"
            >
              Submit
            </button>
          </form>
        ) : (
          <p>
            Please <Link to="/login" className="text-blue-500 underline">Sign In</Link> to write a review
          </p>
        )}
      </section>

      {/* 📋 Reviews Section */}
      <section className="mt-[3rem]">
        <div>{movie?.reviews?.length === 0 && <p>No Reviews</p>}</div>
        <div>
          {movie?.reviews.map((r) => (
            <div
              key={r._id}
              className="bg-[#1A1A1A] p-4 rounded-lg w-[50%] mt-[2rem]"
            >
              <div className="flex justify-between">
                <strong className="text-[#B0B0B0]">{r.name}</strong>
                <p className="text-[#B0B0B0]">{r.createdAt.substring(0, 10)}</p>
              </div>
              {/* ⭐ Show rating */}
              <div className="text-yellow-400 text-lg mt-1">
                {"★".repeat(r.rating)}{" "}
                <span className="text-gray-500 text-sm">
                  ({r.rating}/5)
                </span>
              </div>
              <p className="my-4 text-white">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};


export default MovieTabs;
