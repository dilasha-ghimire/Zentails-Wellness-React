import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AdminTherapySession() {
  const [therapySessions, setTherapySessions] = useState([]);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchTherapySessions();
  }, []);

  const fetchTherapySessions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/therapysessions",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setTherapySessions(response.data);
    } catch (error) {
      console.error("Error fetching therapy sessions:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/therapysessions/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchTherapySessions(); 
    } catch (error) {
      console.error("Error deleting therapy session:", error);
    }
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const hours = time.toString().slice(0, 2);
    const minutes = time.toString().slice(2, 4);
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex flex-wrap gap-6 w-full justify-start">
        {therapySessions.map((session) => (
          <div
            key={session._id}
            className="bg-white p-6 rounded-lg shadow-lg w-[350px]"
          >
            <h3 className="text-xl font-semibold mb-2">
              Therapy Session #{session._id}
            </h3>
            <p className="text-gray-600">
              Date: {new Date(session.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              Start Time: {formatTime(session.start_time)}
            </p>
            <p className="text-gray-600">
              End Time: {formatTime(session.end_time)}
            </p>
            <p className="text-gray-600">
              Pet: {session.pet_id?.name || "N/A"}
            </p>
            <p className="text-gray-600">
              Customer: {session.user_id?.full_name || "N/A"}
            </p>
            <p className="text-gray-600">Status: {session.status}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleDelete(session._id)}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded cursor-pointer"
              >
                <FontAwesomeIcon icon={faTrash} className="text-black" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
