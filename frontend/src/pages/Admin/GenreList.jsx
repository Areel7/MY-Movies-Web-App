import { useState } from "react";
import {
  useCreateGenreMutation,
  useDeleteGenreMutation,
  useFetchGenresQuery,
  useUpdateGenreMutation,
} from "../../redux/api/genre.js";
import { toast } from "react-toastify";
import GenreForm from "../../components/GenreForm.jsx";
import Modal from "../../components/Modal.jsx";
import Sidebar from "./DashBoard/Sidebar/Sidebar.jsx";

const GenreList = () => {
  const { data: genres, refetch } = useFetchGenresQuery();

  const [name, setName] = useState("");
  const [selectGenre, setSelectGenre] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createGenre] = useCreateGenreMutation();
  const [updateGenre] = useUpdateGenreMutation();
  const [deleteGenre] = useDeleteGenreMutation();

  const handleCreateGenre = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Genre name is required");
      return;
    }

    try {
      const result = await createGenre({ name }).unwrap();
      if (result) {
        toast.success("Genre created successfully");
        setName("");
        refetch();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create genre");
    }
  };

  const handleUpdateGenre = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Genre name is required");
      return;
    }

    try {
      const result = await updateGenre({
        id: selectGenre._id,
        updateGenre: { name: updatingName },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Genre updated successfully");
        refetch();
        setSelectGenre(null);
        setModalVisible(false);
        setUpdatingName("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update genre");
    }
  };

  const handleDeleteGenre = async () => {
    try {
      const result = await deleteGenre(selectGenre._id).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Genre deleted successfully");
        setSelectGenre(null);
        setModalVisible(false);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete genre");
    }
  };


  console.log("Genre is:", genres);

  return (
    <>
    <div className="">
      <Sidebar page={"Genres"}/>
    </div>
    <div className="ml-[20rem] flex flex-col md:flex-row ">
      <div className="md:w-3/4 p-3">
        <h1 className="h-12">Mange Genres</h1>
        <GenreForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateGenre}
        />
        <br />
        <div className="flex flex-wrap">
          {genres?.map((genre) => (
            <div key={genre._id}>
              <button
                className="bg-white border border-teal-500 text-teal-500 py-2 px-4 rounded-lg m-3 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                onClick={() => {
                  {
                    setModalVisible(true);
                    setSelectGenre(genre);
                    setUpdatingName(genre.name);
                  }
                }}
              >
                {genre.name}
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <GenreForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateGenre}
            buttonText="Update"
            handleDelete={handleDeleteGenre}
          />
        </Modal>
      </div>
    </div>
    </>
  );
};

export default GenreList;
