import { Link } from "react-router";

const MovieCard = ({ movie }) => {
  return (
    <div key={movie._id} className="relative group m-[2rem] ">
      <Link to={`/movies/${movie._id}`}>
        <img
          src={`http://localhost:3000${movie.image}`}
          alt={movie.name}
          className="w-[15rem] h-[15rem] rounded m-0 p-0 transition duration-300 ease-in-out transform group-hover:opacity-50"
        />
      </Link>
      <p className="absolute top-[85%] left-[2rem] right-0 bottom-0 opacity-0 transition duration-300 ease-in-out transform group-hover:opacity-100">
        {movie.name}
      </p>
    </div>
  );
};

export default MovieCard;
