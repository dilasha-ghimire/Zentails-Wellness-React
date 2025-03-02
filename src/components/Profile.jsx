import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthorizationError from "../common/AuthorizationError";
import Footer from "../common/Footer";
import Navigation from "../common/Navigation";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    profilePicture: null,
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [authError, setAuthError] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const authToken = localStorage.getItem("authToken");

      if (!userId || !authToken) {
        setAuthError(true); 
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/customer/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setProfile({
          profilePicture: response.data.profilePicture || null,
          fullName: response.data.full_name || "",
          email: response.data.email || "",
          phone: response.data.contact_number || "",
          address: response.data.address || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);

        if (error.response && error.response.status === 401) {
          console.log("Authorization failed");
          setAuthError(true);
        }
      }
    };

    fetchUserData();
  }, [navigate, localStorage.getItem("authToken")]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedFormats = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
    ];
    if (!allowedFormats.includes(file.type)) {
      setError("Only JPG, JPEG, PNG, and GIF formats are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be under 2MB.");
      return;
    }

    setError("");
    setSelectedImage(URL.createObjectURL(file));
  };
  const handleUpdate = async () => {
    const userId = localStorage.getItem("userId");
    const updatedProfile = {
      full_name: profile.fullName,
      email: profile.email,
      contact_number: profile.phone,
      address: profile.address,
      profilePicture: selectedImage ? selectedImage : profile.profilePicture,
    };

    try {
      const formData = new FormData();
      if (selectedImage) {
        const file = document.getElementById("profileUpload").files[0];
        formData.append("profilePicture", file);
      }
      formData.append("full_name", updatedProfile.full_name);
      formData.append("email", updatedProfile.email);
      formData.append("contact_number", updatedProfile.contact_number);
      formData.append("address", updatedProfile.address);

      const response = await axios.put(
        `http://localhost:3000/api/customer/updateWithImage/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        setUpdateMessage("Your profile has been updated.");
        setTimeout(() => {
          navigate("/homepage");
        }, 2000); 
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An error occurred while updating your profile.");
    }
  };
  if (authError) {
    return <AuthorizationError />; 
  }
  return (
    <>
      <Navigation />
      <div className="relative flex justify-center items-center bg-green-100 h-[67vh] mt-[20vh]">
        {/* Homepage Button (Top Right) */}
        <button
          onClick={() => navigate("/homepage")}
          className="absolute top-5 right-75      group overflow-hidden py-2 px-3 text-lg cursor-pointer flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Homepage
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 ease-in-out group-hover:w-full"></span>
        </button>

        {/* Profile Container */}
        <div className="bg-white shadow-lg rounded-2xl pt-9 pr-8 flex w-[60%] h-[60%]">
          {/* Left Section - Profile Image */}
          <div className="flex flex-col items-center w-1/3">
            <label htmlFor="profileUpload" className="cursor-pointer">
              <div className="w-40 h-40 rounded-full mt-5 bg-gray-200 flex items-center justify-center shadow-lg border-4 border-gray-300 relative">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : profile.profilePicture ? (
                  <img
                    src={`http://localhost:3000/uploadsCustomer/${profile.profilePicture}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUser}
                    size="4x"
                    className="text-gray-600"
                  />
                )}
              </div>
            </label>
            <input
              type="file"
              id="profileUpload"
              accept="image/jpeg, image/png, image/jpg, image/gif"
              className="hidden"
              onChange={handleImageChange}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Right Section - User Information */}
          <div className="w-2/3 flex flex-col justify-center space-y-4">
            {/* Row 1: Full Name & Email */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
                />
              </div>
            </div>

            {/* Row 2: Phone Number & Address */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  readOnly
                  className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-semibold text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Row 3: Update Button */}
            <div className="flex justify-center">
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md
               hover:bg-green-700 transition duration-300 ease-in-out"
              >
                Update
              </button>
            </div>
            {updateMessage && (
              <div className="text-green-500 text-center mt-4">
                {updateMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
