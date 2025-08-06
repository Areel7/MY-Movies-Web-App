import { Link } from "react-router-dom";
import { useGetAllMoviesQuery } from "../../redux/api/movies.js";
import { useEffect } from "react";
import Sidebar from "./DashBoard/Sidebar/Sidebar.jsx";

const AdminMoviesList = () => {
  const { data: movies, isLoading, error, refetch } = useGetAllMoviesQuery();

  useEffect(() => {
    refetch();
  });

  if (isLoading)
    return <div className="text-center mt-10">Loading movies...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load movies.
      </div>
    );

  return (
    <>
        <div className="">
      <Sidebar page={`ALL Movies(${movies?.length})`}/>
    </div>
    <div className="container mx-[15rem]">
      <div className="flex flex-col md:flex-row ">
        <div className="p-3">
          <div className="ml-[2rem] text-xl font-bold h-12">
            All Movies ({movies?.length})
          </div>
          <div className="flex flex-wrap justify-around items-center p-[2rem]">
            {movies.map((movie) => (
              <Link
                key={movie._id}
                to={`/admin/movies/update/${movie._id}`}
                className="block mb-4 overflow-hidden"
              >
                <div className="flex">
                  <div className="max-w-sm m-[2rem] rounded overflow-hidden shadow-lg">
                    <img
                      src={`http://localhost:3000${movie.image}`}
                      alt={movie.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="px-6 py-4 border border-gray-500">
                      <div className="font-bold text-xl mb-2 flex justify-center">
                        {movie.name}
                      </div>
                    </div>
                    <p className="text-gray-700 text-base">{movie.detail}</p>
                    <div className="mt-[2rem] mb-[1rem]">
                      <span className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded inline-block mt-2">
                        Update Movie
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminMoviesList;
