/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import logo from "../assets/admin_assets/s23anNavBlack.png";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center justify-between py-2 px-[4%]">
      <Link to={"/"}>
        <img src={logo} className="w-[max(13%,100px)]" alt="" />
      </Link>
      <button
        onClick={() => setToken("")}
        className="bg-white text-black border hover:bg-black duration-300 
        hover:text-white px-5 py-2 rounded-full sm:px-7 sm:py-2 text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
