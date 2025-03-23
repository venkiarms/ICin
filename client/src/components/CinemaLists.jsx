import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
import Modal from "react-modal";

const CinemaLists = ({
  cinemas,
  selectedCinemaIndex,
  setSelectedCinemaIndex,
  fetchCinemas,
  auth,
  isFetchingCinemas = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [isAdding, SetIsAdding] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const openLocationModal = () => {
    setLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setLocationModalOpen(false);
  };

  const onAddCinema = async (data) => {
    try {
      SetIsAdding(true);
      const response = await axios.post("/cinema", data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      // console.log(response.data)
      reset();
      fetchCinemas(data.name);
      toast.success("theater added successfully!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error adding theater.", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      SetIsAdding(false);
      setLocationModalOpen(false);
    }
  };

  const CinemaLists = ({ cinemas }) => {
    const cinemasList = cinemas?.filter((cinema) =>
      cinema.name.toLowerCase().includes(watch("search")?.toLowerCase() || "")
    );

    return cinemasList.length ? (
      cinemasList.map((cinema, index) => {
        return cinemas[selectedCinemaIndex]?._id === cinema._id ? (
          <button
            className="w-fit  bg-gradient-to-br from-indigo-800 to-blue-700 px-2.5 py-1.5 text-lg font-medium text-white drop-shadow-xl hover:from-indigo-700 hover:to-blue-600"
            onClick={() => {
              setSelectedCinemaIndex(null);
              sessionStorage.setItem("selectedCinemaIndex", null);
            }}
            key={index}
          >
            {cinema.name}
          </button>
        ) : (
          <button
            className="w-fit  bg-gradient-to-br from-indigo-800 to-blue-700 px-2 py-1 font-medium text-white drop-shadow-md hover:from-indigo-700 hover:to-blue-600"
            onClick={() => {
              setSelectedCinemaIndex(index);
              sessionStorage.setItem("selectedCinemaIndex", index);
            }}
            key={index}
          >
            {cinema.name}
          </button>
        );
      })
    ) : (
      <div>No theaters found</div>
    );
  };

  return (
    <>
      <div className="container mx-auto p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-red-500">
        <div className="flex justify-between items-center">
          {auth.role=="admin" ? <h1 className="text-3xl font-semibold text-white">Theaters</h1> : <h1 className="text-3xl font-semibold text-white">Theaters in your area</h1> }
          
          {auth.role === "admin" && (
            <button
              className="rounded-full bg-white p-3 shadow-lg hover:bg-gray-100 transition duration-300"
              aria-label="Add Theater"
              onClick={openLocationModal}
            >
              Add New Theater +
            </button>
          )}
          {locationModalOpen && (
            <Modal
              isOpen={locationModalOpen}
              onRequestClose={closeLocationModal}
              shouldCloseOnOverlayClick={false}
              contentLabel="Location Modal"
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 50,
                },
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  marginRight: '-50%',
                  transform: 'translate(-50%, -50%)',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '2rem',
                  maxWidth: '32rem',
                  width: '90%',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
              }}>
              <h2 className="text-2xl font-bold bg-white mb-4 rounded-t-md">
                Select location:
              </h2>
              <form
                className="flex flex-col gap-4 bg-gradient-to-br from-indigo-900 to-red-500 p-8 rounded-lg shadow-md"
                onSubmit={handleSubmit(onAddCinema)}
              >
                <input
                  placeholder="Theater Name"
                  className="w-full rounded-lg border-0 px-4 py-2 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-300"
                  required
                  {...register("name", { required: true })}
                />
                <input
                  placeholder="Location"
                  className="w-full rounded-lg border-0 px-4 py-2 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-300"
                  required
                  {...register("location", { required: true })}
                />
                <button
                  disabled={isAdding}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold tracking-wide transition duration-150 ease-in-out hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isAdding ? "Adding..." : "Add Theater"}
                </button>
                <button
                  onClick={closeLocationModal}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold tracking-wide transition duration-150 ease-in-out hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Cancel
                </button>
              </form>
            </Modal>
          )}
        </div>
        <div className="mt-6 mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              placeholder="Search Theaters"
              {...register("search")}
            />
          </div>
        </div>
        {isFetchingCinemas ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cinemas
              .filter((cinema) =>
                cinema.name
                  .toLowerCase()
                  .includes(watch("search")?.toLowerCase() || "")
              )
              .map((cinema, index) => (
                <div
                  className={`p-4 transition-shadow border rounded-lg hover:shadow-lg ${selectedCinemaIndex === index
                    ? "border-pink-300"
                    : "border-white"
                    } bg-white`}
                  onClick={() => setSelectedCinemaIndex(index)}
                  key={cinema._id}
                >
                  <h3 className="text-lg font-bold text-gray-800">
                    {cinema.name}
                  </h3>
                  <p className="text-sm text-gray-600">{cinema.location}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CinemaLists;
