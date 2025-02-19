// Back.jsx
import { CircleArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router


const Back = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <button
      className="btn btn-link text-light p-0 d-flex align-items-center"
      onClick={handleBackClick}
      aria-label="Go back"
    >
      <CircleArrowLeft />
    </button>
  );
};

export default Back;
