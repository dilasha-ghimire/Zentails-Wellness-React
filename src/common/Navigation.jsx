import {
  faHouseUser,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const isProfilePage = location.pathname === "/profile";
  const isHomePage = location.pathname === "/homepage";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const authToken = localStorage.getItem("authToken"); // Retrieve the token
      if (!userId || !authToken) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/customer/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Set the Authorization header
            },
          }
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    navigate("/");
  };

  return (
    <div className="h-[20vh] fixed top-0 left-0 w-full z-50 shadow-md flex bg-white">
      <div className="h-[100%] w-[40%] flex">
        <div className="h-[100%] w-[30%] flex flex-col justify-center items-end">
          <img
            src="src/assets/authentication/Logo_2.png"
            className="w-36 h-34"
          />
        </div>
        <div className="h-[100%] w-[70%] flex flex-col justify-center pl-3">
          <p className="font-mont text-3xl font-semibold mb-2 ml-2 tracking-wide">
            Welcome to
          </p>
          <p className="font-great text-6xl tracking-wider">
            Zentails Wellness
          </p>
        </div>
      </div>

      {!isProfilePage && (
        <div className="h-[100%] w-[15%] flex justify-end items-end">
          <Link
            to="/homepage"
            className="border-[#5D4037] border-b-[4px] pb-1 h-fit w-fit tracking-wider text-xl font-semibold cursor-pointer"
          >
            <FontAwesomeIcon icon={faHouseUser} style={{ color: "#000000" }} />{" "}
            HOME
          </Link>
        </div>
      )}

      <div className="h-[100%] w-[45%] flex justify-between">
        <div className="h-[100%] w-[40%] flex justify-center items-center gap-4 ml-20">
          <button className="relative group overflow-hidden py-2 px-2 h-fit text-lg cursor-pointer">
            History
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </button>
          <Link
            to="/profile"
            className={`relative group overflow-hidden py-2 px-2 h-fit text-lg cursor-pointer ${
              isProfilePage ? "border-b-[2px] border-black" : ""
            }`}
          >
            Profile
            <span
              className={`absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-300 ease-in-out ${
                isProfilePage ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
        </div>

        <div className="flex h-[100%] w-[30%] justify-center items-center gap-2">
          <button
            className="relative group overflow-hidden py-2 px-2 h-fit cursor-pointer"
            onClick={handleLogout} // Add onClick handler
          >
            <FontAwesomeIcon icon={faRightFromBracket} size="xl" />
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </button>
          <div className="flex flex-col h-[100%] w-[70%] items-center px-2 py-5 justify-end">
            <div className="w-20 h-20 rounded-full bg-[#e5e4e4] flex items-center justify-center overflow-hidden shadow-lg">
              {profile?.profilePicture ? (
                <img
                  src={`http://localhost:3000/uploadsCustomer/${profile.profilePicture}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  size="2xl"
                  style={{ color: "#000000" }}
                />
              )}
            </div>
            <p className="mt-2 font-mont text-xl">
              {profile?.full_name || "Username"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
