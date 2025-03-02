import axios from "axios";
import React, { useEffect, useState } from "react";

export default function AdminHealthRecord() {
  const [petData, setPetData] = useState([]);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchPetsWithDetails();
  }, []);

  const fetchPetsWithDetails = async () => {
    try {
      const petsResponse = await axios.get("http://localhost:3000/api/pet", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const pets = petsResponse.data;

      const petDetailsPromises = pets.map(async (pet) => {
        const detailsResponse = await axios.get(
          `http://localhost:3000/api/pet/${pet._id}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        return detailsResponse.data;
      });

      const petDetails = await Promise.all(petDetailsPromises);
      setPetData(petDetails);
    } catch (error) {
      console.error("Error fetching pet details:", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex flex-wrap gap-6 w-full justify-start">
        {petData.map((data) => (
          <div
            key={data.pet._id}
            className="bg-white p-6 rounded-lg shadow-lg w-[350px]"
          >
            <img
              src={`http://localhost:3000/uploadsPets/${data.pet.image}`}
              alt={data.pet.name}
              className="w-50 h-40 object-fill rounded-lg mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }} 
            />
            <h3 className="text-xl font-semibold mb-2">{data.pet.name}</h3>
            <p className="text-gray-600">
              Last Checkup: {data.healthRecord?.last_checkup_date || "N/A"}
            </p>
            {data.medicalHistory && data.medicalHistory.length > 0 && (
              <div className="mb-2">
                <p className="font-semibold">Medical History:</p>
                <p className="text-gray-600">
                  Condition: {data.medicalHistory[0].condition}
                </p>
                <p className="text-gray-600">
                  Treatment: {data.medicalHistory[0].treatment_date}
                </p>
              </div>
            )}
            {data.specialNeeds && data.specialNeeds.length > 0 && (
              <p className="text-gray-600">
                Special Need: {data.specialNeeds[0].special_need}
              </p>
            )}
            {data.vaccinations && data.vaccinations.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Vaccinations:</p>
                <p className="text-gray-600">
                  Vaccine: {data.vaccinations[0].vaccine_name}
                </p>
                <p className="text-gray-600">
                  Date: {data.vaccinations[0].vaccination_date}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
