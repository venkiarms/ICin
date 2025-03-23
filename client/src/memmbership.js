// Import necessary React libraries
import React from 'react';
import './memmbership.css'; // Ensure this matches the actual file name's case

const memmbership = () => {
  return (
    <div className="membership-page">
      <header className="header">
        <h1>Your Movie Rewards</h1>
      </header>
      
      <div className="membership-options">
        <button className="membership-button free">Regular Membership is Free</button>
        <button className="membership-button premium">Premium Membership - $15/Year</button>
      </div>

      <div className="movies-watched">
        <h2>Movies Watched in the Last 30 Days</h2>
        {/* Placeholder for movie list */}
      </div>

      <div className="rewards">
        <button className="rewards-button">Accumulated Rewards Points</button>
      </div>

      <footer className="footer">
        <p>Premium members get online service fee waived for any booking.</p>
      </footer>
    </div>
  );
};

export default memmbership; // Export with PascalCase
