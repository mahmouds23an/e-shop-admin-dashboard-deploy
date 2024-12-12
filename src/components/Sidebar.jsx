import { NavLink } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[20%] min-h-screen border-r-2 bg-gray-50 shadow-md">
      <div className="flex flex-col gap-4 pt-6 pl-4 text-[16px]">
        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/add"
        >
          <img
            src={assets.add_icon}
            className="w-8 h-8"
            alt="Add Products"
          />
          <span className="hidden md:inline">Add Products</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/event"
        >
          <img
            src={assets.event_icon}
            className="w-8 h-8"
            alt="Add Events"
          />
          <span className="hidden md:inline">Add Events</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/list"
        >
          <img
            src={assets.list_icon}
            className="w-8 h-8"
            alt="Products List"
          />
          <span className="hidden md:inline">Products List</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/orders"
        >
          <img
            src={assets.order_icon}
            className="w-8 h-8"
            alt="Orders"
          />
          <span className="hidden md:inline">Orders</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/promos"
        >
          <img
            src={assets.promo_icon}
            className="w-8 h-8"
            alt="Promo Codes"
          />
          <span className="hidden md:inline">Promo Codes</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/feedback"
        >
          <img
            src={assets.feedback_icon}
            className="w-8 h-8"
            alt="Users Feedback"
          />
          <span className="hidden md:inline">Users Feedback</span>
        </NavLink>

        <NavLink
          className="flex items-center gap-2 p-2 transition-colors duration-200 rounded-md"
          to="/orders-reviews"
        >
          <img
            src={assets.ordersReviews_icon}
            className="w-8 h-8"
            alt="Orders Reviews"
          />
          <span className="hidden md:inline">Orders Reviews</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
