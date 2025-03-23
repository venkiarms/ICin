import React from "react";
import Loading from "../components/Loading";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom"; 
import "react-toastify/dist/ReactToastify.css";

const SelectedMovie = ({
  movies,
  selectedMovieIndex,
  setSelectedMovieIndex,
  isFetchingMoviesDone,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    setSelectedMovieIndex(null);
    sessionStorage.setItem("selectedMovieIndex", null);
    navigate('/');
  };

  if (!isFetchingMoviesDone) {
    return <Loading />;
  }

  if (!movies.length || selectedMovieIndex === null) {
    return (
      <div className="text-center text-xl text-white py-12">
        There are no movies available
      </div>
    );
  }

  const movie = movies[selectedMovieIndex];

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-red-500 py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
        </div>
        <div className="rounded-lg shadow-lg overflow-hidden md:flex bg-white">
          <div className="md:flex-shrink-0">
            <img
              src={movie.img}
              alt={movie.name}
              className="h-200 w-full object-cover md:h-full md:w-60" 
            />
          </div>
          <div className="p-4">
            <h3 className="text-2xl font-bold">{movie.name}</h3>
            <p className="text-lg">
              <strong>Movie duration:</strong> {movie.length} minutes
            </p>
            <p className="text-lg">
              <strong>Genre:</strong> {movie.genre || "Action, Thriller"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedMovie;
