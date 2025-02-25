import { motion } from "framer-motion";

export default function Registration({ toggleView }) {
  return (
    <motion.div
      className="w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] h-[100%] sm:h-[100%] md:h-[100%] lg:h-[100%] rounded-2xl shadow-2xl shadow-black-50 flex flex-col items-center justify-evenly bg-[#5D4037]"
      key="registration"
      initial={{ rotateY: 90, opacity: 0, transformPerspective: 1000 }}
      animate={{ rotateY: 0, opacity: 1, transformPerspective: 1000 }}
      exit={{ rotateY: -90, opacity: 0, transformPerspective: 1000 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="bg-whitetext-center  flex flex-col justify-center items-center">
        <h1 className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg">
          Join Our Family
        </h1>
      </div>

      <div className="w-[90%] flex flex-col items-center justify-stretch ">
        {/* Full Name */}
        <div className="flex flex-col text-md w-full ">
          <label className="text-xl text-white">Full Name</label>
          <input
            type="text"
            className="border border-white text-white bg-[#807e7e] rounded-xl p-4 h-12 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col text-md w-full ">
          <label className="text-xl  text-white">Email</label>
          <input
            type="email"
            className="border border-white text-white bg-[#807e7e] rounded-xl p-4 h-12 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
        </div>

        {/* Contact Number */}
        <div className="flex flex-col text-md w-full ">
          <label className="text-xl  text-white">Contact Number</label>
          <input
            type="tel"
            className="border border-white text-white bg-[#807e7e] rounded-xl p-4 h-12 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col text-md w-full ">
          <label className="text-xl  text-white">Address</label>
          <input
            type="text"
            className="border border-white text-white bg-[#807e7e] rounded-xl p-4 h-12 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col text-lg w-full ">
          <label className="text-xl text-white">Password</label>
          <input
            type="password"
            className="border border-white text-white bg-[#807e7e] rounded-xl p-4 h-12 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col w-[90%] justify-around">
        <button className="h-10 bg-[#FCF5D7] text-black font-bold rounded-lg shadow-md hover:bg-[#aca792] transition duration-300 text-md w-full">
          Register
        </button>
        <p className="text-sm text-white text-center mt-3">
          Already a member?{" "}
          <span
            className="text-blue-500 underline hover:cursor-pointer text-[1rem]"
            onClick={toggleView}
          >
            Sign In
          </span>
        </p>
      </div>
    </motion.div>
  );
}
