import { faDog, faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AuthorizationError from "../common/AuthorizationError";
import Footer from "../common/Footer";
import Navigation from "../common/Navigation";

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      const authToken = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (!authToken || !userId) {
        setAuthError(true);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/therapysessions/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        if (error.response && error.response.status === 401) {
          setAuthError(true);
        }
      }
    };

    fetchSessions();
  }, []);

  if (authError) {
    return <AuthorizationError />;
  }

  const formatTime = (time) => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <Navigation />
      <div className="h-[90vh] w-screen  flex justify-center items-center">
        <div className="w-[80%] h-[70%] mt-35  flex flex-col overflow-y-auto custom-scrollbar-one px-10 py-6">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="w-[100%]  h-[60%] shadow-2xl border-b-1 rounded mb-4 flex items-center p-6"
            >
              {/* Pet Image */}
              <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
                <img
                  src={`http://localhost:3000/uploadsPets/${session.pet_id.image}`}
                  alt={session.pet_id.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Pet Name and Breed */}
              <div className="flex-grow flex flex-col">
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon
                    icon={faDog}
                    className="text-amber-700 mr-2"
                    size="2xl"
                  />
                  <p className="text-2xl font-semibold font-mont">
                    {session.pet_id.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faPaw}
                    className="text-amber-700 mr-2"
                  />
                  <p className="text-gray-600 font-mont text-xl">
                    {session.pet_id.breed}
                  </p>
                </div>
              </div>

              {/* Date, Time, and Total Charge */}
              <div className="flex-grow ml-6">
                <p className="text-gray-600 mb-1">
                  Date: {new Date(session.date).toDateString()}
                </p>
                <p className="text-gray-600 mb-1">
                  Time: {formatTime(session.start_time)} -{" "}
                  {formatTime(session.end_time)}
                </p>
                <p className="text-gray-600">
                  Total Charge: Rs. {session.total_charge}
                </p>
              </div>

              {/* Status */}
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  {session.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
