import axios from "axios";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../common/Footer";
import SuccessDialog from "../../common/SuccessDialog";
import animationData from "./../../assets/authentication/dog-animation.json";
import Registration from "./Registration";

export default function Login() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          emailOrPhone,
          password,
        }
      );

      const { token, role, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userName", user.full_name);

      setEmailOrPhone("");
      setPassword("");
      setError("");
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
        if (role === "customer") {
          navigate("/homepage");
        } else if (role === "admin") {
          navigate("/homepage"); // Temporary redirect for admin, update later
        }
      }, 2000);
      // Navigate based on user role
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessDialog
        message1="Login Successful!"
        message2="Welcome..."
        showDialog={showDialog}
      />
      <div className="w-screen flex flex-col">
        <header className="w-full lg:h-[16vh] bg-[#fff] flex items-center justify-center">
          <img
            src="src/assets/authentication/Logo_2.png"
            alt="logo"
            className="w-[100px] h-[100px] mr-3"
          />
          <h1 className="text-2xl md:text-4xl lg:text-3xl font-bold tracking-wide">
            Zentails Wellness
          </h1>
        </header>

        <main className="w-full lg:h-[80vh] flex justify-center items-center bg-[#fff]">
          {isLoginView ? (
            <motion.div
              className="w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] lg:h-[90%] rounded-2xl shadow-2xl flex flex-col items-center justify-items-start bg-[#5D4037] p-6"
              key={isLoginView ? "login" : "registration"}
              initial={{ rotateY: 90, opacity: 0, transformPerspective: 1000 }}
              animate={{ rotateY: 0, opacity: 1, transformPerspective: 1000 }}
              exit={{ rotateY: -90, opacity: 0, transformPerspective: 1000 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="text-center flex flex-col items-center">
                <h1 className="text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  WELCOME
                </h1>
                <h1 className="text-xl font-bold text-white">
                  Create an account or Sign in
                </h1>

                <Lottie
                  animationData={animationData}
                  style={{ width: 130, height: 130 }}
                />
              </div>

              {/* Email or Phone Input */}
              <div className="w-[90%] flex flex-col">
                <label className="text-xl mb-2 text-white">
                  Email or Phone number
                </label>
                <input
                  type="text"
                  className="border border-white text-black bg-[#ded9c2] rounded-xl p-4 h-12 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="w-[90%] flex flex-col">
                <label className="text-xl text-white">Password</label>
                <input
                  type="password"
                  className="border border-white text-black bg-[#ded9c2] rounded-xl p-4 h-12 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-400 text-sm">{error}</p>}

              {/* Login Button */}
              <div className="w-[90%] flex flex-col items-center mt-4">
                <button
                  className="h-10 bg-[#FCF5D7] text-black font-bold rounded-lg shadow-md hover:bg-[#aca792] transition duration-300 text-md w-full flex items-center justify-center"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                <p className="text-sm text-white mt-2">
                  Not a member?{" "}
                  <span
                    className="text-blue-500 underline cursor-pointer"
                    onClick={toggleView}
                  >
                    Join Us
                  </span>
                </p>

                <p className="text-md text-white">
                  By logging in you agree to our{" "}
                  <span className="text-blue-500 underline cursor-pointer">
                    privacy
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-500 underline cursor-pointer">
                    policy
                  </span>
                </p>
              </div>
            </motion.div>
          ) : (
            <Registration toggleView={toggleView} />
          )}
        </main>
        <Footer />
      </div>
      {showDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 backdrop-blur-sm pointer-events-none"></div>
      )}
    </>
  );
}
