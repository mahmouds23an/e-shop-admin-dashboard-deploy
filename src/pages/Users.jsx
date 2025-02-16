/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";

const Users = ({ token }) => {
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/all-users`, {
        headers: { token },
      });
      if (response.data.success) {
        setList(response.data.users);
        setCount(response.data.users.length);
      }
      if (response.data.count === 0) {
        setList([]);
        setCount(0);
        toast.info("No Users found");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="container mx-auto md:-ml-10 -mt-6 flex flex-col md:flex-row gap-4 justify-between mb-4">
        <p className="text-2xl font-bold">
          All Users List
          <span className="ml-2 px-3 py-1 rounded-full bg-gray-600 text-white">
            {count}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="hidden md:grid grid-cols-[1.5fr_2.5fr_1fr] items-center py-3 px-4 bg-gray-200 text-sm font-semibold text-gray-700 rounded-lg shadow-md">
          <span>Profile picture</span>
          <span>Name</span>
          <span>Email</span>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src={assets.no_results_icon}
              alt="No products found"
              className="w-96 h-auto mx-auto"
            />
            <p className="text-gray-600 mt-4">No Users found.</p>
          </div>
        ) : (
          list.map((item, index) => (
            <div
              className="grid grid-cols-3 items-center py-3 
              px-4 border border-gray-300 text-sm gap-3 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition duration-200"
              key={index}
            >
              <div
                className="hidden md:block relative w-16 h-16 rounded-lg overflow-hidden shadow-md 
              border border-gray-300 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <img
                  src={item?.profilePicture}
                  className="object-cover w-full h-full"
                  alt={item?.firstName}
                />
              </div>
              <p className="max-w-full">
                {item?.firstName} {item?.lastName}
              </p>
              <p className="block">{item?.email}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Users;
