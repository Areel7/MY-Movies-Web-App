import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";
import { useAddItemInCartMutation } from "../../redux/api/cart";
import MovieTabs from "./MovieTabs";
import Cart from "../User/Cart";

const MovieDetail = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: movie, refetch } = useGetSpecificMovieQuery(movieId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();
  const [addItemInCart] = useAddItemInCartMutation();
  const [averageRating, setAverageRating] = useState(0);
  

  useEffect(() => {
    if (movie?.reviews?.length > 0) {
      const total = movie.reviews.reduce((acc, curr) => acc + curr.rating, 0);
      const avg = total / movie.reviews.length;
      setAverageRating(avg.toFixed(1));
    } else {
      setAverageRating(0);
    }
  }, [movie]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ id: movieId, rating, comment }).unwrap();
      refetch();
      setComment("");
      toast.success("Review Created Successfully");
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  const addItem = async (movieId) => {
    try {
      await addItemInCart({ movieId, quantity: 1 }).unwrap();
      toast.success("Item Added successfully");
      setIsCartOpen(true); // auto open cart after adding item
    } catch (error) {
      toast.error("Error While Adding Item in Cart",error);
    }
  };

  return (
    <>
      <div>
        <Link to="/" className="text-white font-semibold hover:underline ml-[20rem]">
          Go Back
        </Link>
      </div>

      <div className="flex justify-center items-center text-3xl text-blue-500">
        {movie?.quantity <= 0 ? "Out of Stock" : "In Stock"}
      </div>

      <div className="mt-[2rem]">
        <Cart open={isCartOpen} setOpen={setIsCartOpen} />

        <div className="flex justify-center items-center">
          <img
            src={`http://localhost:3000${movie?.image}`}
            alt={movie?.name}
            className="w-[70%] h-150 rounded"
          />
        </div>

        <div className="flex justify-center my-2">
          {movie?.price > 0 && movie?.quantity >= 0 ? (
            <button
              onClick={() => addItem(movie._id)}
              className="bg-teal-600 text-white py-2 px-4 ml-5 rounded-lg"
            >
              Add To Cart
            </button>
          ) : (
            <button className="bg-teal-600 text-white py-2 px-4 ml-5 rounded-lg">
              Out of Stock
            </button>
          )}

          {movie?.price > 0 && (
            <div className="flex justify-end my-2">
              <span className="text-red-600 text-xl ml-5">
                <span className="text-white">Price:</span> ${movie?.price}
              </span>
            </div>
          )}
        </div>

        <div className="container flex justify-between ml-[20rem] mt-[3rem]">
          <section>
            <h2 className="text-5xl my-4 font-extrabold ">{movie?.name}</h2>
            <p className="my-4 xl:w-[35rem] text-[#B0B0B0]">{movie?.detail}</p>
          </section>

          <div className="mr-[5rem]">
            <p className="text-2xl font-semibold">Releasing Date: {movie?.year}</p>
            <div>
              {movie?.cast.map((c) => (
                <ul key={c._id}>
                  <li className="mt-[1rem]">{c}</li>
                </ul>
              ))}
            </div>
            <div className="flex items-center mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${averageRating >= star ? "text-yellow-400" : "text-gray-600"}`}
                >
                  ★
                </span>
              ))}
              <span className="text-white text-lg ml-2">({averageRating}/5)</span>
            </div>
          </div>
        </div>

        <div className="container ml-[20rem]">
          <MovieTabs
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
