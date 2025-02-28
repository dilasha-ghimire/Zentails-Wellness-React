import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const SuccessDialog = ({ message1, message2, showDialog }) => {
  useEffect(() => {
    if (showDialog) {
      setTimeout(() => {}, 2000);
    }
  }, [showDialog]);

  return (
    <>
      {showDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            className="backdrop-blur-lg bg-white/80 p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center border border-gray-200"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Check Icon with Glow */}
            <div className="text-5xl text-[#562626] drop-shadow-lg">
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              {message1}
            </h2>
            <p className="text-md text-gray-600 mt-2">{message2}</p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SuccessDialog;
