import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthorizationErrorAdmin from "../common/AuthorizationErrorAdmin";
import AdminCustomer from "./admin/AdminCustomer";
import AdminHealthRecord from "./admin/AdminHealthRecord";
import AdminNavigation from "./admin/AdminNavigation";
import AdminPets from "./admin/AdminPets";
import AdminTherapySession from "./admin/AdminTherapySession";

export default function Admin() {
  const [selectedComponent, setSelectedComponent] = useState("pets");
  const [profile, setProfile] = useState(null);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId");
      const authToken = localStorage.getItem("authToken");

      if (userId && authToken) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/customer/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setProfile(response.data);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setAuthError(true);
          }
        }
      }
    };

    fetchUserProfile();
  }, []);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "healthrecord":
        return <AdminHealthRecord />;
      case "therapysession":
        return <AdminTherapySession />;
      case "customer":
        return <AdminCustomer />;
      default:
        return <AdminPets />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    navigate("/");
  };
  if (authError) {
    return <AuthorizationErrorAdmin />;
  }

  return (
    <div className="w-screen h-screen flex">
      {/* Pass setSelectedComponent function to AdminNavigation */}
      <AdminNavigation onSelect={setSelectedComponent} />

      <div className="flex-1 flex flex-col">
        {/* Top Admin Bar */}
        <div className="h-[20%] mb-2 border-b-1 flex items-center justify-between px-8">
          <div className="flex items-center">
            <img
              src="src/assets/authentication/Logo_2.png"
              alt="Logo"
              className="w-30 h-30 mr-4"
            />
            <span className="text-4xl font-great">Zentails Wellness</span>
          </div>

          {/* Display Welcome Message and User's Full Name */}
          <div className="text-xl font-bold">Welcome Admin</div>

          <div className="flex items-center">
            {/* Display Profile Picture or Default Icon */}
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-2">
              {profile && profile.profilePicture ? (
                <img
                  src={`http://localhost:3000/uploadsCustomer/${profile.profilePicture}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} size="lg" />
              )}
            </div>
            <span className="mr-4">
              {profile ? profile.full_name : "Admin User"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-red-700 shadow-2xl text-white px-4 py-2 rounded cursor-pointer transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="mr-1" />
              Logout
            </button>
          </div>
        </div>

        {/* Render the selected component inside this div */}
        <div className="h-[76%] bg-gray-100 p-4 overflow-y-auto">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}
