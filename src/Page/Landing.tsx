import React from 'react';
import { useNavigate } from 'react-router-dom';



const Landing: React.FC = () => {

  const navigate=useNavigate()
  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-500 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 max-w-3xl text-white p-8 md:p-12">
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center leading-tight">
          <span className="text-yellow-400">Aadhaar</span> Verification<br />
          <span className="text-white">via OCR</span>
        </h1>

        {/* Aadhaar Cards */}
        <div className="relative mt-8 flex justify-center items-center">
          <img
            src="https://aadhaarkyc.io/wp-content/uploads/2020/02/updated-aadhaar@4x-1-300x177.png"
            alt="Aadhaar Card Front"
            className="w-80 md:w-96 h-auto rounded-lg shadow-xl transform rotate-2 absolute -top-8 left-0"
          />
          <img
            src="https://qph.cf2.quoracdn.net/main-qimg-09995aeca5fc834dc24c5743348592fe"
            alt="Aadhaar Card Back"
            className="w-80 md:w-96 h-auto rounded-lg shadow-xl transform -rotate-2 z-10"
          />
        </div>

        {/* Buttons */}
        <div className="mt-12 flex justify-center space-x-6">
        <button
            className="bg-yellow-400 text-blue-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-300 transition duration-300"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
          <button
            className="bg-white text-blue-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>

      {/* Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-700 rounded-full opacity-50 blur-md"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-800 rounded-full opacity-50 blur-md"></div>
      </div>
    </div>
  );
};

export default Landing;
