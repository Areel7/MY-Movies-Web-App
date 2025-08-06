import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies.js";
import { useFetchGenresQuery } from "../../redux/api/genre.js";
import { toast } from "react-toastify";
import Sidebar from "./DashBoard/Sidebar/Sidebar.jsx";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    price: 0,
    cast: [],
    rating: 0,
    image: null,
    genre: "",
    quantity: 0,
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [
    createMovie,
    { isLoading: isCreatingMovie, error: createMovieErrorDetail },
  ] = useCreateMovieMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uplaodImageErrorDetail },
  ] = useUploadImageMutation();

  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (genres) {
      setMovieData((prevData) => ({
        ...prevData,
        genre: genres[0]?.id || "",
      }));
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "genre") {
      const selectedGenre = genres.find((genre) => genre.name === value);
      setMovieData((prevData) => ({
        ...prevData,
        genre: selectedGenre ? selectedGenre._id : "",
      }));
    } else {
      setMovieData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleCreateMovie = async () => {
    try {
      if (
        !movieData.name ||
        !movieData.cast ||
        !movieData.detail ||
        !movieData.year ||
        !selectedImage
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      let uploadedImagePath = null;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadImageResponse = await uploadImage(formData);

        if (uploadImageResponse.data) {
          uploadedImagePath = uploadImageResponse.data.image;
        } else {
          console.error("Failed to upload image: ", uplaodImageErrorDetail);
          toast.error("Failed to upload image");
          return;
        }

        await createMovie({
          ...movieData,
          image: uploadedImagePath,
        });

        navigate("/admin/movies-list");

        setMovieData({
          name: "",
          year: 0,
          detail: "",
          cast: [],
          rating: 0,
          image: null,
          genre: "",
          quantity: 0,
        });

        toast.success("Movie Added To Database");
      }
    } catch {
      console.error("Failed to create Movie: ", createMovieErrorDetail);
      toast.error(` ${createMovieErrorDetail?.message}`);
    }
  };

  return (
    <>
      <div>
        <Sidebar page={"Create New Movie"} />
      </div>
      <div className="container flex justify-center item-center mt-4">
        <form>
          <p className="text-green-200 w-[50rem] text-2xl mb-4">Create Movie</p>
          <div className="mb-4">
            <label className="block">
              Name:
              <input
                type="text"
                name="name"
                value={movieData.name}
                onChange={handleChange}
                className="border px-2 py-1 w-full"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block">
              Year:
              <input
                type="number"
                name="year"
                value={movieData.year}
                onChange={handleChange}
                className="border px-2 py-1 w-full"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block">
              Detail:
              <textarea
                type="text"
                name="detail"
                value={movieData.detail}
                onChange={handleChange}
                className="border px-2 py-1 w-full"
              ></textarea>
            </label>
          </div>

          <div className="mb-4">
            <label className="block">
              Cast (comma-seprated):
              <input
                type="text"
                name="cast"
                value={movieData.cast.join(", ")}
                onChange={(e) =>
                  setMovieData({
                    ...movieData,
                    cast: e.target.value.split(", "),
                  })
                }
                className="border px-2 py-1 w-full"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block">
              Price:
              <input
                type="decimal"
                name="price"
                value={movieData.price}
                onChange={handleChange}
                className="border px-2 py-1 w-full"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block">
              Quantity:
              <input
                type="number"
                name="quantity"
                value={movieData.quantity}
                onChange={handleChange}
                className="border px-2 py-1 w-full"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block">
              Genre:
              <select
                name="genre"
                value={movieData.genre}
                onChange={handleChange}
                className="border px-2 py-1 w-full"
              >
                {isLoadingGenres ? (
                  <option>Loading genres...</option>
                ) : (
                  genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))
                )}
              </select>
            </label>
          </div>

          <div className="mb-4">
            <label
              style={
                !selectedImage
                  ? {
                      border: "1px solid #888",
                      borderRadius: "5px",
                      padding: "8px",
                    }
                  : { border: "0", borderRadius: "0", padding: "0" }
              }
            >
              {!selectedImage && "upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: !selectedImage ? "none" : "block" }}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleCreateMovie}
            className="bg-teal-500 text-white px-4 py-2 rounded"
            disabled={isCreatingMovie || isUploadingImage}
          >
            {isCreatingMovie || isUploadingImage
              ? "Creating..."
              : "Creating Movie"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateMovie;
