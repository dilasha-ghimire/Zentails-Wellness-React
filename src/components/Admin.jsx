import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import AdminNavigation from "./Admin/AdminNavigation";

export default function Admin() {
  const [selectedComponent, setSelectedComponent] = useState("pets"); // Default component

  // Function to render the selected component
  //   const renderComponent = () => {
  //     switch (selectedComponent) {
  //       case "healthrecord":
  //         return <AdminHealthRecord />;
  //       case "medicalhistory":
  //         return <AdminMedicalHistory />;
  //       case "specialneed":
  //         return <AdminSpecialNeed />;
  //       case "therapysession":
  //         return <AdminTherapySession />;
  //       case "vaccination":
  //         return <AdminVaccination />;
  //       case "customer":
  //         return <AdminCustomer />;
  //       default:
  //         return <AdminPets />; // Default to Pets section
  //     }
  //   };

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
          <div className="text-xl font-bold">Welcome Admin</div>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-2">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </div>
            <span className="mr-4">Admin User</span>
            <button className="bg-gray-600 hover:bg-red-700 shadow-2xl text-white px-4 py-2 rounded cursor-pointer transition-colors duration-200">
              <FontAwesomeIcon icon={faRightFromBracket} className="mr-1" />
              Logout
            </button>
          </div>
        </div>

        {/* Render the selected component inside this div */}
        <div className="h-[76%] bg-gray-100 p-4 overflow-y-auto">
          {/* {renderComponent()} */}
        </div>
      </div>
    </div>
  );
}
