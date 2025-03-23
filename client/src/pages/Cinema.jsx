import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import CinemaLists from "../components/CinemaLists";
import Navbar from "../components/Navbar";
import TheaterListsByCinema from "../components/TheaterListsByCinema";
import { AuthContext } from "../context/AuthContext";

const Cinema = () => {
  const { auth } = useContext(AuthContext);
  const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
    parseInt(sessionStorage.getItem("selectedCinemaIndex")) || 0
  );
  const [cinemas, setCinemas] = useState([]);
  const [isFetchingCinemas, setIsFetchingCinemas] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState(
    sessionStorage.getItem("selectedLocation")
  );

  const fetchCinemas = async (newSelectedCinema) => {
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

      // console.log(response.data.data)
      setCinemas(response.data.data);
      if (newSelectedCinema) {
        response.data.data.map((cinema, index) => {
          if (cinema.name === newSelectedCinema) {
            setSelectedCinemaIndex(index);
            sessionStorage.setItem("selectedCinemaIndex", index);
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingCinemas(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  const props = {
    cinemas,
    selectedCinemaIndex,
    setSelectedCinemaIndex,
    fetchCinemas,
    auth,
    isFetchingCinemas,
    selectedLocation,
  };
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-red-500">
      <Navbar {...props} />
      {console.log(sessionStorage.getItem("selectedLocation"))}
      <div className="container mx-auto p-4">
        <CinemaLists {...props} />
        {cinemas[selectedCinemaIndex]?.name && (
          <TheaterListsByCinema {...props} />
        )}
      </div>
    </div>
  );
};

export default Cinema;
