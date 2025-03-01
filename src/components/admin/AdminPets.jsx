import {
  faCheck,
  faEdit,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import AuthorizationErrorAdmin from "./../../common/AuthorizationErrorAdmin";

export default function AdminPets() {
  const [pets, setPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [newPet, setNewPet] = useState({
    name: "",
    age: "",
    breed: "",
    description: "",
    availability: true,
    charge_per_hour: "",
    image: null,
  });
  const [imageFile, setImageFile] = useState(null);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/pet", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setPets(response.data);
      } catch (err) {
        console.error("Error fetching pets:", err);
        if (err.response && err.response.status === 400) {
          setAuthError(true);
        }
      }
    };

    fetchPets();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  // Add new pet
  const addPet = async () => {
    const formData = new FormData();
    formData.append("name", newPet.name);
    formData.append("age", newPet.age);
    formData.append("breed", newPet.breed);
    formData.append("description", newPet.description); // Include description
    formData.append("availability", newPet.availability);
    formData.append("charge_per_hour", newPet.charge_per_hour);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await axios.post("http://localhost:3000/api/pet", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setPets([...pets, res.data]);
      setNewPet({
        name: "",
        age: "",
        breed: "",
        description: "", // Reset description field
        availability: true,
        charge_per_hour: "",
      });
      setImageFile(null);
    } catch (err) {
      console.error("Error adding pet:", err);
    }
  };

  const handleEdit = (pet) => setEditingPet(pet);

  const handleSave = async (editedPet) => {
    try {
      await axios.put(
        `http://localhost:3000/api/pet/${editedPet._id}`,
        editedPet,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setPets(pets.map((pet) => (pet._id === editedPet._id ? editedPet : pet)));
      setEditingPet(null);
    } catch (err) {
      console.error("Error updating pet:", err);
    }
  };

  // Delete pet
  const deletePet = (id) => {
    axios
      .delete(`http://localhost:3000/api/pet/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(() => setPets(pets.filter((pet) => pet._id !== id)))
      .catch((err) => console.error("Error deleting pet:", err));
  };

  if (authError) {
    return <AuthorizationErrorAdmin />;
  } else {
    return (
      <div className="flex flex-col items-center h-full p-6 bg-gray-100">
        {/* Add Pet Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-[90%] max-w-[600px]">
          <h2 className="text-xl font-semibold mb-4">Add New Pet</h2>
          <div className="flex flex-col space-y-4">
            {/* Image Placeholder */}
            <div
              className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Pet Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  Upload Image
                </p>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Input Fields */}
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newPet.name}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Age"
                value={newPet.age}
                onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Breed"
                value={newPet.breed}
                onChange={(e) =>
                  setNewPet({ ...newPet, breed: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Charge Per Hour"
                value={newPet.charge_per_hour}
                onChange={(e) =>
                  setNewPet({ ...newPet, charge_per_hour: e.target.value })
                }
                className="p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={newPet.description}
                onChange={(e) =>
                  setNewPet({ ...newPet, description: e.target.value })
                }
                className="p-2 border rounded"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={addPet}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded mt-4 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlus} className="text-black mr-2" />
              Add Pet
            </button>
          </div>
        </div>

        {/* Pet Cards */}
        <div className="flex flex-wrap gap-6 w-[90%] justify-center">
          {pets.map((pet) =>
            editingPet && editingPet._id === pet._id ? (
              <div
                key={pet._id}
                className="bg-white p-6 rounded-lg shadow-lg w-[300px] flex flex-col"
              >
                {/* Editable Pet Form */}
                <input
                  type="text"
                  value={editingPet.name}
                  onChange={(e) =>
                    setEditingPet({ ...editingPet, name: e.target.value })
                  }
                  className="p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  value={editingPet.age}
                  onChange={(e) =>
                    setEditingPet({ ...editingPet, age: e.target.value })
                  }
                  className="p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  value={editingPet.breed}
                  onChange={(e) =>
                    setEditingPet({ ...editingPet, breed: e.target.value })
                  }
                  className="p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  value={editingPet.charge_per_hour}
                  onChange={(e) =>
                    setEditingPet({
                      ...editingPet,
                      charge_per_hour: e.target.value,
                    })
                  }
                  className="p-2 border rounded mb-2"
                />
                <select
                  value={editingPet.availability ? "true" : "false"}
                  onChange={(e) =>
                    setEditingPet({
                      ...editingPet,
                      availability: e.target.value === "true",
                    })
                  }
                  className="p-2 border rounded mb-2"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <textarea
                  value={editingPet.description}
                  onChange={(e) =>
                    setEditingPet({
                      ...editingPet,
                      description: e.target.value,
                    })
                  }
                  className="p-2 border rounded mb-2"
                />

                {/* Image File Input */}
                <div className="mb-2">
                  <label className="block mb-1">Change Image</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      setImageFile(e.target.files[0]);
                    }}
                    className="p-2 border rounded w-full"
                  />
                  {imageFile && (
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleSave(editingPet)}
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                  >
                    <FontAwesomeIcon icon={faCheck} className="text-black" />
                  </button>
                  <button
                    onClick={() => setEditingPet(null)}
                    className="bg-gray-200 hover:bg-red-400 p-2 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-black" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={pet._id}
                className="bg-white p-6 rounded-lg shadow-lg w-[300px] flex flex-col"
              >
                {/* Non-editable Pet View */}
                <div className="w-32 h-32 rounded-full border-2 border-gray-200 overflow-hidden mx-auto mb-4">
                  <img
                    src={`http://localhost:3000/uploadsPets/${pet.image}`}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {pet.name}
                </h3>
                <p className="text-gray-600 text-center">Age: {pet.age}</p>
                <p className="text-gray-600 text-center">Breed: {pet.breed}</p>
                <p className="text-gray-600 text-center">
                  Charge Per Hour: ${pet.charge_per_hour}
                </p>
                <p className="text-gray-600 text-center">
                  Available: {pet.availability ? "Yes" : "No"}
                </p>
                <p className="text-gray-600 text-center">{pet.description}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-black" />
                  </button>
                  <button
                    onClick={() => deletePet(pet._id)}
                    className="bg-gray-200 hover:bg-red-400 p-2 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-black" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}
