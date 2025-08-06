import {
  useGetSpecificMovieQuery,
  useDeleteCommentMutation,
} from "../../redux/api/movies";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./DashBoard/Sidebar/Sidebar";
import { useEffect, useState } from "react";

const MovieReview = () => {
  const { id } = useParams();
  const { data: movie, refetch } = useGetSpecificMovieQuery(id);
  const [prop, setProp] = useState("");

  const [deleteComment] = useDeleteCommentMutation();

  
  useEffect(() => {
    if (movie?.name) {
      setProp(movie.name);
    }
  }, [movie]);

  const handleDeleteComment = async (movieId, reviewId) => {
    try {
      await deleteComment({ movieId, reviewId });
      toast.success("Comment Deleted");
      refetch();
    } catch (error) {
      console.error("Error Deleting Comment:", error);
    }
  };

  return (
    <>
      <div className="">
        <Sidebar page={`${prop} Comments`} />
      </div>
      <div className="flex flex-col items-center">
        {movie?.reviews?.map((r) => (
          <div
            key={r._id}
            className="bg-[#1A1A1A] p-4 rounded-lg w-[50%] mt-[2rem]"
          >
            <div className="flex justify-between">
              <strong className="text-[#B0B0B0]">{r.name}</strong>
              <div className="flex flex-col ">
              <p className="text-[#B0B0B0] mb-5">{r.createdAt?.substring(0, 10)}</p>
              <p className="text-[#B0B0B0]">{`Rating is:  ${r.rating}/5`}</p>
              </div>
            </div>
            <p className="my-4">{r.comment}</p>
            <button
              className="text-red-500"
              onClick={() => handleDeleteComment(movie._id, r._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default MovieReview;
