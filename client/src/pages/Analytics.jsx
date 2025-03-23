import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Analytics = () => {
    const { auth } = useContext(AuthContext);
    const [rawData, setRawData] = useState([]);
    const [occupancyData, setOccupancyData] = useState([]);
    const [period, setPeriod] = useState(30);
    const [locationFilter, setLocationFilter] = useState('All');
    const [movieFilter, setMovieFilter] = useState('All');
    const [theaterFilter, setTheaterFilter] = useState('All');

    useEffect(() => {
        const fetchOccupancyData = async () => {
            try {
                const response = await axios.get(`/showtime/occupancy?period=${period}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                setRawData(response.data.data);
                processOccupancyData(response.data.data, 'All', 'All', 'All');
            } catch (error) {
                console.error('Error fetching occupancy data:', error);
            }
        };

        fetchOccupancyData();
    }, [period, auth.token]);

    const processOccupancyData = (data, location, movie, theater) => {
        const filteredData = data.filter(item => 
            (location === 'All' || item.location === location) &&
            (movie === 'All' || item.movie === movie) &&
            (theater === 'All' || item.theater === theater)
        );
        setOccupancyData(filteredData);
    };

    const handleLocationChange = (e) => {
        setLocationFilter(e.target.value);
        processOccupancyData(rawData, e.target.value, movieFilter, theaterFilter);
    };

    const handleMovieChange = (e) => {
        setMovieFilter(e.target.value);
        processOccupancyData(rawData, locationFilter, e.target.value, theaterFilter);
    };

    const handleTheaterChange = (e) => {
        setTheaterFilter(e.target.value);
        processOccupancyData(rawData, locationFilter, movieFilter, e.target.value);
    };

    const uniqueLocations = ['All', ...new Set(rawData.map(item => item.location))];
    const uniqueMovies = ['All', ...new Set(rawData.map(item => item.movie))];
    const uniqueTheaters = ['All', ...new Set(rawData.map(item => item.theater))];

    return (
        <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
            <Navbar />
            <div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
                <h2 className="text-3xl font-bold text-gray-900">Theater Occupancy Analytics</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="my-4 w-full">
                        <label htmlFor="period-select" className="block text-lg font-medium text-gray-700">Select Period:</label>
                        <select id="period-select" value={period} onChange={(e) => {setPeriod(e.target.value);setLocationFilter('All');setMovieFilter('All');setTheaterFilter('All')}} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="30">Last 30 Days</option>
                            <option value="60">Last 60 Days</option>
                            <option value="90">Last 90 Days</option>
                        </select>
                    </div>
                    <div className="my-4 w-full">
                        <label htmlFor="location-select" className="block text-lg font-medium text-gray-700">Select Location:</label>
                        <select id="location-select" value={locationFilter} onChange={handleLocationChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            {uniqueLocations.map(location => (
                                <option key={location} value={location}>{location}</option>
                            ))}
                        </select>
                    </div>
                    <div className="my-4 w-full">
                        <label htmlFor="movie-select" className="block text-lg font-medium text-gray-700">Select Movie:</label>
                        <select id="movie-select" value={movieFilter} onChange={handleMovieChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            {uniqueMovies.map(movie => (
                                <option key={movie} value={movie}>{movie}</option>
                            ))}
                        </select>
                    </div>
                    <div className="my-4 w-full">
                        <label htmlFor="theater-select" className="block text-lg font-medium text-gray-700">Select Theater:</label>
                        <select id="theater-select" value={theaterFilter} onChange={handleTheaterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            {uniqueTheaters.map(theater => (
                                <option key={theater} value={theater}>{theater}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    {occupancyData.length > 0 ? (
                        <div>
                            {occupancyData.map((data, index) => (
                                <div key={index} className="mb-4 p-4 rounded bg-white shadow">
                                    <h4 className="text-xl font-semibold">{data.movie} - {data.theater} - {data.location}</h4>
                                    <p>Total Seats Sold: {data.totalSeatsSold}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No data available for the selected period, location, movie, or theater.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
