import { NavLink } from "react-router-dom";
import {
  MdAddBox,
  MdList,
  MdShoppingCart,
  MdLocalOffer,
  MdFeedback,
  MdRateReview,
  MdVerifiedUser,
} from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="w-[15%] min-h-screen border-r-2 bg-gray-50 shadow-md">
      <div className="flex flex-col gap-4 pt-6 pl-4 text-[16px]">
        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/add"
        >
          <MdAddBox className="w-8 h-8" />
          <span className="hidden md:inline">Add Products</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/users"
        >
          <MdVerifiedUser className="w-8 h-8" />
          <span className="hidden md:inline">Users</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/list"
        >
          <MdList className="w-8 h-8" />{" "}
          <span className="hidden md:inline">Products List</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/orders"
        >
          <MdShoppingCart className="w-8 h-8" />
          <span className="hidden md:inline">Orders</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/promos"
        >
          <MdLocalOffer className="w-8 h-8" />
          <span className="hidden md:inline">Promo Codes</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/feedback"
        >
          <MdFeedback className="w-8 h-8" />
          <span className="hidden md:inline">Users Feedback</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/orders-reviews"
        >
          <MdRateReview className="w-8 h-8" />
          <span className="hidden md:inline">Orders Reviews</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
