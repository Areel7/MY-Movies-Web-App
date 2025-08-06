import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSpecificMovieQuery,
  useUpdateMoiveMutation,
  useUploadImageMutation,
  useDeleteMovieMutation,
} from "../../redux/api/movies.js";
import { toast } from "react-toastify";
import Sidebar from "./DashBoard/Sidebar/Sidebar.jsx";

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    rating: 0,
    image: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const { data: initialMovieData } = useGetSpecificMovieQuery(id);

  useEffect(() => {
    if (initialMovieData) {
      setMovieData(initialMovieData);
    }
  }, [initialMovieData]);

  const [updateMovie, { isLoading: isUpdatingMovie }] =
    useUpdateMoiveMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uplaodImageErrorDetails },
  ] = useUploadImageMutation();

  const [deleteMovie] = useDeleteMovieMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(movieData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleUpdateMovie = async () => {
    try {
      if (
        !movieData.name ||
        !movieData.detail ||
        !movieData.year ||
        !movieData.cast
      ) {
        toast.error("Please fill all fields");
        return;
      }

      let uploadedImagePath = movieData.image;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadImageResponse = await uploadImage(formData);

        if (uploadImageResponse.data) {
          uploadedImagePath = uploadImageResponse.data.image;
        } else {
          console.error("Failed to upload image", uplaodImageErrorDetails);
          toast.error("Image upload failed");
          return;
        }
      }

      const {  error } = await updateMovie({
        id,
        ...movieData,
        image: uploadedImagePath,
      });

      if (error) {
        console.error("Update error:", error);
        toast.error("Movie update failed");
      } else {
        toast.success("Movie updated successfully");
        navigate("/movies");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeleteMovie = async () => {
    try {
      toast.success("Movie deleted successfully");
      await deleteMovie(id);
      navigate("/movies");
    } catch (error) {
      console.error("Failed to delete Movie: ", error);
      toast.error("Failed to delete Movie");
    }
  };

  return (
    <>
    <div><Sidebar page={"Update Movie"}/></div>
    <div className="container flex justify-center items-center mt-4 ">
      <form>
        <p className=" text-green-200 w-[50rem] text-2xl mb-4">Update Movie</p>
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
              name="detail"
              value={movieData.detail}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
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
                setMovieData({ ...movieData, cast: e.target.value.split(", ") })
              }
              className="border px-2 py-1 w-full"
            />
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
          onClick={handleUpdateMovie}
          className="bg-teal-500 text-white px-4 py-2 rounded"
          disabled={isUpdatingMovie || isUploadingImage}
        >
          {isUpdatingMovie || isUploadingImage ? "Updating..." : "Update Movie"}
        </button>
        <button
          type="button"
          onClick={handleDeleteMovie}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
          disabled={isUpdatingMovie || isUploadingImage}
        >
          {isUpdatingMovie || isUploadingImage ? "Deleting..." : "Delete Movie"}
        </button>
      </form>
    </div>
    </>
  );
};

export default UpdateMovie;
