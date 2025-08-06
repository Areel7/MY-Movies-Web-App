import {
  useDeleteCommentMutation,
  useGetAllMoviesQuery,
} from "../../redux/api/movies.js";
import { toast } from "react-toastify";
import Sidebar from "./DashBoard/Sidebar/Sidebar.jsx";

const AllComments = () => {
  const { data: movie, refetch } = useGetAllMoviesQuery();

  const [deleteComment] = useDeleteCommentMutation();

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
    <div>
      <div className="">
        <Sidebar page={"All Comments"} />
      </div>
      {movie?.map((m) => (
        <section
          key={m._id}
          className="flex flex-col justify-center items-center"
        >
          {m?.reviews.map((r) => (
            <div
              key={r._id}
              className="bg-[#1A1A1A] p-4 rounded-lg w-[50%] mt-[2rem]"
            >
              <div className="flex justify-center">
                <h2 className="text-2xl text-[#B0B0B0]">{m.name}</h2>
              </div>
              <div className="flex justify-between">
                <strong className="text-[#B0B0B0]">{r.name}</strong>
                <div className="flex flex-col ">
                  <p className="text-[#B0B0B0] mb-5">
                    {r.createdAt?.substring(0, 10)}
                  </p>
                  <p className="text-[#B0B0B0]">{`Rating is:  ${r.rating}/5`}</p>
                </div>
              </div>
              <p className="my-4">{r.comment}</p>
              <button
                className="text-red-500"
                onClick={() => handleDeleteComment(m._id, r._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};

export default AllComments;
