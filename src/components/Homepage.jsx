import {
  faArrowRight,
  faDog,
  faMagnifyingGlass,
  faPaw,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AuthorizationError from "../common/AuthorizationError";
import Footer from "../common/Footer";
import Navigation from "../common/Navigation";

export default function Homepage() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [authError, setAuthError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [petDetails, setPetDetails] = useState(null);
  const [sessionDate, setSessionDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookingError, setBookingError] = useState(null);
  const [startTimeError, setStartTimeError] = useState(null);
  const [endTimeError, setEndTimeError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setAuthError(true);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/api/pet", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
        if (error.response && error.response.status === 401) {
          setAuthError(true);
        }
      }
    };

    fetchPets();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pets.filter((pet) =>
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPets(filtered);
    } else {
      setFilteredPets(pets);
    }
  }, [searchTerm, pets]);

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    setStartTimeError(null);
    setEndTimeError(null);
  };

  const handleCloseModal = () => {
    setSelectedPet(null);
    setPetDetails(null);
  };

  const handleOutsideClick = (e) => {
    if (selectedPet && e.target.classList.contains("modal-overlay")) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    const fetchPetDetails = async () => {
      if (selectedPet) {
        const authToken = localStorage.getItem("authToken");
        try {
          const response = await axios.get(
            `http://localhost:3000/api/pet/${selectedPet._id}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setPetDetails(response.data);
        } catch (error) {
          console.error("Error fetching pet details:", error);
        }
      }
    };

    fetchPetDetails();
  }, [selectedPet]);

  if (authError) {
    return <AuthorizationError />;
  }

  const handleBookNow = async () => {
    setBookingError(null);
    setStartTimeError(null);
    setEndTimeError(null);
    const authToken = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!sessionDate || !startTime || !endTime) {
      setBookingError("Please fill in all booking details.");
      return;
    }

    const startTimeFormatted = startTime.replace(":", "");
    const endTimeFormatted = endTime.replace(":", "");

    if (!/^\d{4}$/.test(startTimeFormatted)) {
      setStartTimeError("Invalid start time format (HH:MM).");
      return;
    }

    if (!/^\d{4}$/.test(endTimeFormatted)) {
      setEndTimeError("Invalid end time format (HH:MM).");
      return;
    }

    const startMinutes =
      parseInt(startTimeFormatted.slice(0, 2)) * 60 +
      parseInt(startTimeFormatted.slice(2, 4));
    const endMinutes =
      parseInt(endTimeFormatted.slice(0, 2)) * 60 +
      parseInt(endTimeFormatted.slice(2, 4));

    if ((endMinutes - startMinutes) % 60 !== 0 || endMinutes <= startMinutes) {
      setEndTimeError("End time must be an hourly increment of start time.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/therapysessions",
        {
          date: sessionDate,
          start_time: parseInt(startTimeFormatted),
          end_time: parseInt(endTimeFormatted),
          status: "scheduled",
          user_id: userId,
          pet_id: selectedPet._id,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      handleCloseModal();
    } catch (error) {
      setBookingError(error.response?.data?.error || "Failed to book session.");
    }
  };

  return (
    <>
      <Navigation />
      <div
        className={`w-screen h-[80vh] mt-[20vh] overflow-auto p-8 flex flex-col ${
          selectedPet ? "filter blur-lg" : ""
        }`}
        onClick={handleOutsideClick}
      >
        <div className="mb-8 w-[40%] self-center relative">
          <input
            type="text"
            placeholder="Search by breed..."
            className="w-full p-2 pr-8 rounded-xl bg-gray-50 shadow-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ color: "#000000" }}
            className="absolute top-1/2 right-3 transform -translate-y-1/2"
          />
        </div>
        {filteredPets
          .reduce((rows, pet, index) => {
            if (index % 2 === 0) rows.push([]);
            rows[rows.length - 1].push(pet);
            return rows;
          }, [])
          .map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-4">
              {row.map((pet) => (
                <div
                  key={pet._id}
                  className={`rounded-lg shadow-md flex flex-col overflow-hidden m-1 w-1/3 mr-10 transition-transform duration-300 pt-4 transform hover:scale-105 cursor-pointer relative ${
                    pet.availability ? "bg-white" : "bg-gray-100"
                  }`}
                  style={{ maxWidth: "30%" }}
                  onClick={() => handlePetClick(pet)}
                >
                  <img
                    src={`http://localhost:3000/uploadsPets/${pet.image}`}
                    alt={pet.name}
                    className="w-60 h-60 object-fill self-center"
                  />
                  {pet.availability && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full w-4 h-4"></div>
                  )}
                  <div className="p-4 flex flex-col justify-between">
                    <h3 className="text-xl font-semibold font-mont">
                      {pet.name}
                    </h3>
                    <p className="text-md text-gray-600 ">
                      {pet.age} years old
                    </p>
                    <p className="text-lg text-gray-600 font-bold">
                      <FontAwesomeIcon
                        icon={faPaw}
                        style={{ color: "#ab6b21" }}
                        size="lg"
                      />{" "}
                      {pet.breed}
                    </p>
                    <p className="text-md text-green-600">
                      Rs {pet.charge_per_hour}/hour
                    </p>
                    {pet.availability ? (
                      <button className="mt-4 w-fit self-end bg-gray-100 hover:bg-gray-400 cursor-pointer text-black font-bold py-2 px-4 rounded">
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          size="lg"
                          style={{ color: "#000000" }}
                        />
                      </button>
                    ) : (
                      <p className="mt-4 text-gray-600 self-end">
                        Currently unavailable
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
      <Footer />
      {selectedPet && (
        <div className="fixed inset-0  h-[80vh] mt-[20vh] bg-transparent flex justify-center items-center modal-overlay">
          <div className="h-[90%] rounded-lg  bg-gray-100 shadow-xl py-40 w-3/4 relative flex overflow-y-scroll custom-scrollbar-one">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 cursor-pointer right-4 text-gray-600 hover:text-gray-800"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="w-1/2 self-center ">
              <img
                src={`http://localhost:3000/uploadsPets/${selectedPet.image}`}
                alt={selectedPet.name}
                className="w-90 h-90 object-fill rounded-lg"
              />
            </div>
            <div className="w-1/2 mt-40 mr-10 flex flex-col justify-center">
              <h3 className="text-4xl font-semibold mb-4 font-mont">
                <FontAwesomeIcon
                  icon={faDog}
                  size="xl"
                  style={{ color: "#813909" }}
                />{" "}
                {selectedPet.name}
              </h3>
              <p className="text-lg text-gray-600 mt-2">
                {selectedPet.age} years old
              </p>
              <p className="font-bold text-gray-600 mt-2 text-lg font-mont">
                <FontAwesomeIcon
                  icon={faPaw}
                  style={{ color: "#ab6b21" }}
                  size="lg"
                />{" "}
                {selectedPet.breed}
              </p>
              <p className="text-lg text-gray-600 mt-2">
                {selectedPet.description}
              </p>
              <p className="text-lg text-green-600 mt-2">
                Rs {selectedPet.charge_per_hour}/hour
              </p>

              {petDetails && (
                <>
                  {petDetails.healthRecord && (
                    <p className="text-sm text-gray-600 mt-2">
                      Last Checkup: {petDetails.healthRecord.last_checkup_date}
                    </p>
                  )}
                  {petDetails.medicalHistory.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold">Medical History</h4>
                      <ul className="list-disc list-inside">
                        {petDetails.medicalHistory.map((history) => (
                          <li
                            key={history._id}
                            className="text-sm text-gray-600"
                          >
                            {history.condition} (Treatment date:{" "}
                            {history.treatment_date})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {petDetails.specialNeeds.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold">Special Needs</h4>
                      <ul className="list-disc list-inside">
                        {petDetails.specialNeeds.map((need) => (
                          <li key={need._id} className="text-sm text-gray-600">
                            {need.special_need}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {petDetails.vaccinations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold">Vaccinations</h4>
                      <ul className="list-disc list-inside">
                        {petDetails.vaccinations.map((vaccination) => (
                          <li
                            key={vaccination._id}
                            className="text-sm text-gray-600"
                          >
                            {vaccination.vaccine_name} (Vaccination date:{" "}
                            {vaccination.vaccination_date})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Conditional Booking Form and Button */}
              {selectedPet.availability ? (
                <>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Session Date
                    </label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time (HH:MM)
                      </label>
                      <input
                        type="text"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                          startTimeError ? "border-red-500" : ""
                        }`}
                      />
                      {startTimeError && (
                        <p className="text-red-500 text-sm">{startTimeError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Time (HH:MM)
                      </label>
                      <input
                        type="text"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                          endTimeError ? "border-red-500" : ""
                        }`}
                      />
                      {endTimeError && (
                        <p className="text-red-500 text-sm">{endTimeError}</p>
                      )}
                    </div>
                  </div>

                  {bookingError && (
                    <p className="text-red-500 mt-2">{bookingError}</p>
                  )}

                  <button
                    onClick={handleBookNow}
                    className="mt-4 border bg-yellow-600 hover:bg-yellow-800 shadow-2xl cursor-pointer text-white font-bold py-2 px-4 rounded"
                  >
                    Book Now
                  </button>
                </>
              ) : (
                <p className="mt-4 text-gray-600">Currently unavailable</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
