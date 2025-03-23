import React, { useState, useRef, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollStep = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += scrollSpeed;
      }
    };

    const scrollInterval = setInterval(scrollStep, 30);
    return () => clearInterval(scrollInterval);
  }, [scrollSpeed]);

  const handleMouseEnter = () => {
    setScrollSpeed(0);
  };

  const handleMouseLeave = () => {
    setScrollSpeed(7);
  };

  const posterWidth = window.innerWidth / 5; 

  return (
    <div className="mx-4 flex flex-col  p-4 text-gray-900 drop-shadow-md sm:mx-8 sm:p-6">
      <h5 className="text-5xl items-center justify-center text-center font-bold">Now Showing</h5>
      {isFetchingMoviesDone ? (
        movies.length ? (
          <div 
            ref={scrollRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ 
              display: 'flex', 
              overflowX: 'auto', 
              scrollBehavior: 'smooth', 
              whiteSpace: 'nowrap',
              padding: '1rem 0'
            }}
          >
            {movies.map((movie, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedMovieIndex(index);
                  sessionStorage.setItem('selectedMovieIndex', index);
                }}
                style={{ 
                  width: `${posterWidth}px`, 
                  flex: '0 0 auto', 
                  marginRight: '20px', 
                  cursor: 'pointer', 
                  display: 'inline-block',
                  backgroundColor: selectedMovieIndex === index ? 'rgba(255, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                  padding: '5px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px'
                }}
              >
                <img
                  src={movie.img}
                  alt={movie.name}
                  style={{ height: 'auto', width: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
                <p className="truncate text-center text-3xl font-bold" style={{ marginTop: '5px' }}>
                  {movie.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-center">No movies available</p>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default NowShowing;




