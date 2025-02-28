import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import SuccessDialog from "../../common/SuccessDialog";

export default function Registration({ toggleView }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false); // State for success dialog

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on typing
  };

  // Validate Form Fields
  const validateForm = () => {
    let newErrors = {};
    if (!formData.full_name.trim())
      newErrors.full_name = "Full Name is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Invalid email format";
    if (!formData.contact_number.match(/^\d{10}$/))
      newErrors.contact_number = "Invalid contact number (10 digits required)";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData
      );
      setMessage("Registration successful! You can now log in.");
      setFormData({
        full_name: "",
        email: "",
        contact_number: "",
        address: "",
        password: "",
      });

      setShowDialog(true); // Show success dialog
      setTimeout(() => {
        setShowDialog(false); // Hide dialog after 2 seconds
        toggleView(); // Navigate to Sign In
      }, 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.error || "Registration failed. Try again."
      );
    }
  };

  return (
    <>
      {/* Success Dialog */}
      <SuccessDialog
        message1="Registration Successful!"
        message2="You can now log in."
        showDialog={showDialog}
      />

      <motion.div
        className="w-[80%] sm:w-[60%] md:w-[s50%] lg:w-[40%] lg:h-[100%] rounded-2xl shadow-2xl flex flex-col items-center justify-evenly bg-[#5D4037] p-6 max-h-[90vh] overflow-y-auto"
        key="registration"
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -90, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <h1 className="text-3xl font-extrabold text-white">Join Our Family</h1>

        {message && (
          <div className="text-white border-2 border-red-200 bg-[#97646a]  w-[80%] rounded-md text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-[90%] flex flex-col">
          {["full_name", "email", "contact_number", "address", "password"].map(
            (field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-xl text-white capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="border border-white text-black bg-[#ded9c2] rounded-xl p-3 h-12 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            )
          )}

          <button
            type="submit"
            className="h-12 bg-[#FCF5D7] text-black font-bold rounded-lg shadow-md hover:bg-[#aca792] transition duration-300 text-md w-full mt-6"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-white">
          Already a member?{" "}
          <span
            className="text-blue-500 underline cursor-pointer text-md"
            onClick={toggleView}
          >
            Sign In
          </span>
        </p>
      </motion.div>
      {showDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 backdrop-blur-sm pointer-events-none"></div>
      )}
    </>
  );
}
