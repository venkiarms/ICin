import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import MovieLists from "../components/MovieLists";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Movie = () => {
  const { auth } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [movies, setMovies] = useState([]);
  const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false);
  const [isAddingMovie, SetIsAddingMovie] = useState(false);
  const fetchMovies = async (data) => {
    try {
      setIsFetchingMoviesDone(false);
      const response = await axios.get("/movie");
      // console.log(response.data.data)
      reset();
      setMovies(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMoviesDone(true);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onAddMovie = async (data) => {
    try {
      data.length =
        (parseInt(data.lengthHr) || 0) * 60 + (parseInt(data.lengthMin) || 0);
      SetIsAddingMovie(true);
      const response = await axios.post("/movie", data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      fetchMovies();
      toast.success("Movie added successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add movie", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      SetIsAddingMovie(false);
    }
  };

  const handleDelete = async (movie) => {
    const confirmed = window.confirm(
      `Do you really want to delete "${movie.name}"?`
    );
    if (confirmed) {
      onDeleteMovie(movie._id);
    }
  };

  const onDeleteMovie = async (id) => {
    try {
      const response = await axios.delete(`/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      // console.log(response.data)
      fetchMovies();
      toast.success("Movie deleted successfully!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete movie", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  const inputHr = parseInt(watch("lengthHr")) || 0;
  const inputMin = parseInt(watch("lengthMin")) || 0;
  const sumMin = inputHr * 60 + inputMin;
  const hr = Math.floor(sumMin / 60);
  const min = sumMin % 60;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-900 to-red-500  ">
      <Navbar />
      <div className="container mx-auto mt-4 flex w-full max-w-7xl flex-col items-center justify-center gap-8 rounded-lg bg-white/80 p-6 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900">Movie Lists</h2>
        <form
          onSubmit={handleSubmit(onAddMovie)}
          className="w-full rounded-lg bg-white/90 p-4 shadow"
        >
          <h3 className="mb-4 text-2xl font-semibold text-gray-800">
            Add Movie
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2 font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: true })}
                className="w-full rounded-md border-gray-300 p-2 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Poster URL
              </label>
              <input
                type="text"
                required
               
                {...register("img", { required: true })}
				className="w-full rounded-md border-gray-300 p-2 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="lengthHr"
                className="mb-2 font-medium text-gray-700"
              >
                Length (hr:min)
              </label>
              <div className="flex gap-2">
                <input
                  id="lengthHr"
                  type="number"
                  min="0"
                  max="20"
                  maxLength="2"
                  {...register("lengthHr")}
                  className="w-full rounded-md border-gray-300 p-2 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="pt-2">:</span>
                <input
                  id="lengthMin"
                  type="number"
                  {...register("lengthMin")}
                  className="w-full rounded-md border-gray-300 p-2 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-5 py-2 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isAddingMovie}
            >
              {isAddingMovie ? "Adding..." : "Add Movie"}
            </button>
          </div>
        </form>
        <div className="relative w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="search"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search for movies..."
            {...register("search")}
          />
        </div>
        {isFetchingMoviesDone ? (
          <MovieLists
            movies={movies}
            search={watch("search")}
            handleDelete={handleDelete}
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Movie;
