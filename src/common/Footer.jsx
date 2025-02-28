import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faSquareInstagram } from "@fortawesome/free-brands-svg-icons";
import { faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faSquareThreads } from "@fortawesome/free-brands-svg-icons";
import { faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <div className="bg-[#f7f6f6] h-[13vh] flex shadow-2xl ">
      <div className="w-[30%] h-[100%] "> 
        <img src="src\assets\footer\follow us.png" />
      </div>
      <div className="w-[35%] h-[100%] flex flex-col justify-center items-center gap-2 ">
        <div className=" flex items-center justify-center gap-4    ">
          <FontAwesomeIcon
            icon={faFacebook}
            size="2xl"
            style={{ color: "#000000" }}
            className="cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faSquareInstagram}
            style={{ color: "#000000" }}
            size="2xl"
            className="cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faSquareXTwitter}
            style={{ color: "#000000" }}
            size="2xl"
            className="cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faSquareThreads}
            size="2xl"
            style={{ color: "#000000" }}
            className="cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faTiktok}
            size="2xl"
            style={{ color: "#000000" }}
            className="cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faTelegram}
            size="2xl"
            style={{ color: "#000000" }}
            className="cursor-pointer"
          />
        </div>
        <div>
          <p>Copyright © 2025. Zentails Wellness Pvt.Ltd.</p>
        </div>
      </div>

      <div className="w-[35%] h-[100%] flex flex-wrap justify-evenly items-center">
        <button className=" text-blue-400 h-fit bg-[#f7f7f7] cursor-pointer font-semibold px-4 py-2 tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          Privacy
        </button>
        <button className="h-fit bg-[#f7f7f7] text-blue-400 cursor-pointer font-semibold px-4 py-2 tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          Policy
        </button>
        <button className="h-fit bg-[#f7f7f7] text-black cursor-pointer font-semibold px-4 py-2 tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          About Us
        </button>
        <button className="h-fit bg-[#f7f7f7] text-black cursor-pointer font-semibold px-4 py-2 tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          FAQ
        </button>
      </div>
    </div>
  );
}
