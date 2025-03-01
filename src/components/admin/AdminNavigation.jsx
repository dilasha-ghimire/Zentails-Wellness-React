import Lottie from "lottie-react";
import { useState } from "react";
import animationData from "../../assets/authentication/dog-animation.json";

export default function AdminNavigation({ onSelect }) {
  const [active, setActive] = useState("pets"); // Default selected item

  const handleSelect = (section) => {
    setActive(section);
    onSelect(section);
  };

  const getButtonClass = (section) =>
    `py-2 px-4 rounded mb-6 cursor-pointer font-semibold transition-colors ${
      active === section
        ? "bg-amber-500 text-white shadow-md"
        : "hover:bg-amber-300"
    }`;

  return (
    <aside className="w-[18%] bg-amber-200 mr-3 h-screen flex flex-col justify-center py-8 px-4 shadow-2xl border-amber-400">
      <Lottie
        animationData={animationData}
        style={{ width: 130, height: 130 }}
        className="self-center mb-6"
      />

      <button
        onClick={() => handleSelect("pets")}
        className={getButtonClass("pets")}
      >
        Pets
      </button>
      <button
        onClick={() => handleSelect("healthrecord")}
        className={getButtonClass("healthrecord")}
      >
        Health Records
      </button>
      <button
        onClick={() => handleSelect("medicalhistory")}
        className={getButtonClass("medicalhistory")}
      >
        Medical History
      </button>
      <button
        onClick={() => handleSelect("specialneed")}
        className={getButtonClass("specialneed")}
      >
        Special Needs
      </button>
      <button
        onClick={() => handleSelect("therapysession")}
        className={getButtonClass("therapysession")}
      >
        Therapy Session
      </button>
      <button
        onClick={() => handleSelect("vaccination")}
        className={getButtonClass("vaccination")}
      >
        Vaccination
      </button>
      <button
        onClick={() => handleSelect("customer")}
        className={getButtonClass("customer")}
      >
        Customers
      </button>
    </aside>
  );
}
