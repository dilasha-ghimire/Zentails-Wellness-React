import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/authentication/Logo_2.png"; // Import the logo

const AuthorizationError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Redirect to login page
    }, 2000);

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r bg-white">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex items-center justify-center">
        <img src={Logo} alt="Zentails Wellness Logo" className="h-30 mr-4" />
        <h1 className="text-4xl font-semibold text-gray-800 font-mont">
          Zentails Wellness
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-semibold text-black mb-4">
            You must log in to access this page.
          </h2>
          <p className="text-gray-600">Redirecting to login page...</p>
          <div className="mt-6">
            <svg
              className="animate-spin h-6 w-6 text-indigo-600 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationError;
