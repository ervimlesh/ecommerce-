
import React, { useState } from "react";
// import profilePng from "../../assets/images/Home/user_ratings.png"
import Rating from "./Rating.jsx";

const ReviewCard = ({ review }) => {
  const [userRating, setUserRating] = useState(0);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const handleRating = (rate) => {
    setUserRating(rate);
    console.log(`User rated: ${rate}`);
  };
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="reviewCard">
      {/* <img src={profilePng} alt="User" style={{maxWidth:"70px"}}/> */}
      <p>{review.name}</p>
      <Rating totalStars={5} initialRating={review.rating}  readOnly={true}/>
      
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
