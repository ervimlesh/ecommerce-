import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Importing star icons from react-icons
// import 'bootstrap/dist/css/bootstrap.min.css'; 

const Rating = ({ totalStars = 5, initialRating = 0, onRate, }) => {
  const [rating, setRating] = useState(initialRating);

  const handleClick = (rate) => {
    setRating(rate);
    if (onRate) {
      onRate(rate); // Call a callback when a rating is clicked
    }
  };

  return (
    <div className="rating">
      {Array.from({ length: totalStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            size={30}
            color={starValue <= rating ? "#ffc107" : "#e4e5e9"}
            className="mx-1"
            onClick={() => handleClick(starValue)}
            style={{ cursor: 'pointer' }}
          />
        );
      })}
    </div>
  );
};

export default Rating;
