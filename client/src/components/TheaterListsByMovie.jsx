

import axios from "axios";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import CinemaLists from "./CinemaLists";
import DateSelector from "./DateSelector";
import Loading from "./Loading";
import TheaterShort from "./TheaterShort";
import { useLocation } from "../context/LocationContext";

const TheaterListsByMovie = ({
  movies,
  selectedMovieIndex,
  setSelectedMovieIndex,
  auth,
  isFetchingMoviesDone,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    (sessionStorage.getItem("selectedDate") &&
      new Date(sessionStorage.getItem("selectedDate"))) ||
      new Date()
  );
  const [theaters, setTheaters] = useState([]);
  const [isFetchingTheatersDone, setIsFetchingTheatersDone] = useState(false);
  const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
    parseInt(sessionStorage.getItem("selectedCinemaIndex"))
  );
  const [cinemas, setCinemas] = useState([]);
  const [isFetchingCinemas, setIsFetchingCinemas] = useState(true);
  const { selectedLocation, updateLocation } = useLocation();

  const fetchCinemas = async (data) => {
    try {
      setIsFetchingCinemas(true);
      let response;
      if (auth.role === "admin") {
        response = await axios.get("/cinema/unreleased", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
      } else {
        response = await axios.get("/cinema");
      }
      console.log(response.data.data);
      let filteredCinemas = response.data.data;
      if (selectedLocation !== null) {
        filteredCinemas = response.data.data.filter(
          (cinema) => cinema.location === selectedLocation
        );
      }
      console.log(filteredCinemas);
      setCinemas(filteredCinemas);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingCinemas(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchTheaters = async (data) => {
    try {
      setIsFetchingTheatersDone(false);
      let response;
      if (auth.role === "admin") {
        response = await axios.get(
          `/theater/movie/unreleased/${
            movies[selectedMovieIndex]._id
          }/${selectedDate.toISOString()}/${new Date().getTimezoneOffset()}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
      } else {
        response = await axios.get(
          `/theater/movie/${
            movies[selectedMovieIndex]._id
          }/${selectedDate.toISOString()}/${new Date().getTimezoneOffset()}`
        );
      }
      setTheaters(
        response.data.data.sort((a, b) => {
          if (a.cinema.name > b.cinema.name) return 1;
          if (a.cinema.name === b.cinema.name && a.number > b.number) return 1;
          return -1;
        })
      );
      setIsFetchingTheatersDone(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, [selectedMovieIndex, selectedDate]);

  const props = {
    cinemas,
    selectedCinemaIndex,
    setSelectedCinemaIndex,
    fetchCinemas,
    auth,
    isFetchingCinemas,
  };

  const filteredTheaters = theaters.filter((theater) => {
    if (selectedCinemaIndex === 0 || !!selectedCinemaIndex) {
      return theater.cinema?.name === cinemas[selectedCinemaIndex]?.name;
    }
    return true;
  });

  return (
    <>
      <CinemaLists {...props} />
      <div className="mx-4 h-fit rounded-md bg-gradient-to-br from-indigo-900 to-red-500 text-white drop-shadow-lg sm:mx-8">
        <div className="flex flex-col gap-6 p-4 sm:p-6">
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <div className="flex flex-col gap-4 rounded-md bg-white py-4 px-4 shadow-md">
            <div className="flex items-center">
              <div className="flex justify-center items-center w-40 h-40 rounded-full overflow-hidden bg-white p-1">
                <img
                  src={movies[selectedMovieIndex].img}
                  className="h-full w-auto"
                  alt={movies[selectedMovieIndex].name}
                />
              </div>
              <div className="ml-4">
                <h4 className="text-3xl font-bold text-gray-800">
                  {movies[selectedMovieIndex].name}
                </h4>
                <p className="text-md text-gray-600">
                  Length: {movies[selectedMovieIndex].length || "-"} min
                </p>
              </div>
            </div>
          </div>
          {isFetchingTheatersDone ? (
            <div className="flex flex-col">
              {filteredTheaters.map((theater, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    index !== 0 &&
                    filteredTheaters[index - 1]?.cinema.name !==
                      filteredTheaters[index].cinema.name &&
                    "mt-6"
                  }`}
                >
                  {filteredTheaters[index - 1]?.cinema.name !==
                    filteredTheaters[index].cinema.name && (
                    <div className=" bg-violet-700 px-2 py-1.5 text-center text-4xl font-semibold text-white sm:py-2">
                      <h2>{theater.cinema.name}</h2>
                    </div>
                  )}
                  <TheaterShort
                    theaterId={theater._id}
                    movies={movies}
                    selectedDate={selectedDate}
                    filterMovie={movies[selectedMovieIndex]}
                    rounded={
                      index === filteredTheaters.length - 1 ||
                      filteredTheaters[index + 1]?.cinema.name !==
                        filteredTheaters[index].cinema.name
                    }
                  />
                </div>
              ))}
              {filteredTheaters.length === 0 && (
                <p className="text-center text-xl font-semibold">
                  There are no showtimes available.
                </p>
              )}
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};

export default TheaterListsByMovie;


