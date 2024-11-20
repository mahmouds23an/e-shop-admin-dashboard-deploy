import { NavLink } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="items-center flex gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/add"
        >
          <img
            src={assets.add_icon}
            className="w-10 md:w-5 h-10 md:h-5"
            alt=""
          />
          <p className="hidden md:block">Add Products</p>
        </NavLink>

        <NavLink
          className="items-center flex gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/event"
        >
          <img
            src={assets.event_icon}
            className="w-10 md:w-5 h-10 md:h-5"
            alt=""
          />
          <p className="hidden md:block">Add Events</p>
        </NavLink>

        <NavLink
          className="items-center flex gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/list"
        >
          <img
            src={assets.list_icon}
            className="w-10 md:w-5 h-10 md:h-5"
            alt=""
          />
          <p className="hidden md:block">Products List</p>
        </NavLink>

        <NavLink
          className="items-center flex gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/orders"
        >
          <img
            src={assets.order_icon}
            className="w-10 md:w-5 h-10 md:h-5"
            alt=""
          />
          <p className="hidden md:block">Orders</p>
        </NavLink>

        <NavLink
          className="items-center flex gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/promos"
        >
          <img
            src={assets.promo_icon}
            className="w-10 md:w-5 h-10 md:h-5"
            alt=""
          />
          <p className="hidden md:block">Promo Codes</p>
        </NavLink>

        <NavLink
          className="items-center flex gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/feedback"
        >
          <img
            src={assets.feedback_icon}
            className="w-10 md:w-5 h-10 md:h-5"
            alt=""
          />
          <p className="hidden md:block">Users FeedBack</p>
        </NavLink>

        <NavLink
          className="items-center flex gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/orders-reviews"
        >
          <img
            src={assets.ordersReviews_icon}
            className="w-10 md:w-5 h-10 md:h-5"
            alt=""
          />
          <p className="hidden md:block">Orders Reviews</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
