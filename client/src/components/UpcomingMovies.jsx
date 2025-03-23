import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Loading from "./Loading";

const UpcomingMovies = ({ auth }) => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const scrollRef = useRef(null);

  const handleMouseEnter = () => {
    setScrollSpeed(0);
  };

  const handleMouseLeave = () => {
    setScrollSpeed(7);
  };

  const posterWidth = window.innerWidth / 5;

  const scrollSpeedRef = useRef(scrollSpeed);

  useEffect(() => {
    scrollSpeedRef.current = scrollSpeed;
  }, [scrollSpeed]);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get("/movie/unreleased/showingForUser", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setUpcomingMovies(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUpcomingMovies();

    const scrollStep = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += scrollSpeedRef.current;
      }
    };

    const scrollInterval = setInterval(scrollStep, 30);
    return () => clearInterval(scrollInterval);
  }, [auth.token]);

  return (
    <div className="mx-4 flex flex-col bg-gradient-to-br from-green-200 to-green-200 p-4 text-gray-900 drop-shadow-md sm:mx-8 sm:p-6">
      <h5 className="text-5xl items-center justify-center text-center font-bold">
        Upcoming Movies
      </h5>
      {isFetching ? (
        <Loading />
      ) : (
        <div
          ref={scrollRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            whiteSpace: "nowrap",
            padding: "1rem 0",
          }}
        >
          {upcomingMovies.map((movie, index) => (
            <div
              key={index}
              style={{
                width: `${posterWidth}px`,
                flex: "0 0 auto",
                marginRight: "20px",
                cursor: "pointer",
                display: "inline-block",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                padding: "5px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <img
                src={movie.img}
                alt={movie.name}
                style={{
                  height: "auto",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div
                style={{
                  padding: "10px",
                }}
              >
                <p
                  className="text-center text-xl font-bold"
                  style={{
                    marginTop: "5px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                  }}
                >
                  {movie.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMovies;
