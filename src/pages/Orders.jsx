/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { currency } from "../App";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: e.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isModalOpen]);

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Filtering orders based on the search term (order ID or amount)
  const filteredOrders = orders.filter((order) => {
    const searchWords = searchTerm.toLowerCase().split(" ");
    const orderIdIncludesAll = searchWords.every((word) =>
      order._id.toLowerCase().includes(word)
    );
    const amountIncludesAll = searchWords.every((word) =>
      order.amount.toString().includes(word)
    );
    return orderIdIncludesAll || amountIncludesAll;
  });

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-gray-50 mx-auto md:-ml-10 -mt-6">
      <div className="flex md:flex-row flex-col md:gap-1 gap-3 justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 text-left">
          Orders{" "}
          <span className="font-normal text-gray-500">({orders.length})</span>
        </h1>
        <div className="relative w-full md:w-72">
          <input
            type="search"
            placeholder="Search by ID or Amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 border-b text-left hidden sm:table-cell">
                Order ID
              </th>
              <th className="px-4 py-3 border-b text-left hidden sm:table-cell">
                Date
              </th>
              <th className="px-4 py-3 border-b text-left">Status</th>
              <th className="px-4 py-3 border-b text-left hidden sm:table-cell">
                Items
              </th>
              <th className="px-4 py-3 border-b text-left hidden sm:table-cell">
                Amount (EGP)
              </th>
              <th className="px-4 py-3 text-left border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="px-4 py-3 border-b hidden sm:table-cell">
                  {highlightText(order._id.slice(-5), searchTerm)}
                </td>
                <td className="px-4 py-3 border-b hidden sm:table-cell">
                  {new Date(order.date).toDateString()}
                </td>
                <td className="px-4 py-3 border-b">
                  <select
                    value={order.status}
                    onChange={(e) => statusHandler(e, order._id)}
                    className="border border-gray-300 rounded px-2 py-[6px] focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    {[
                      "Order Placed",
                      "Packing",
                      "Shipped",
                      "Out for delivery",
                      "Delivered",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 border-b hidden sm:table-cell">
                  {order.items.length}
                </td>
                <td className="px-4 py-3 border-b hidden sm:table-cell">
                  {highlightText(order.amount.toFixed(2), searchTerm)}
                </td>
                <td className="px-4 py-3 border-b">
                  <button
                    onClick={() => openModal(order)}
                    className="bg-blue-500 text-white px-4 py-[6px] rounded-lg hover:bg-blue-600 transition duration=200"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg h-full overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-800">
                Order Details
              </h4>
              <button
                onClick={closeModal}
                className="text-red-500 text-xl hover:text-red-600 transition duration=200"
              >
                ✕
              </button>
            </div>

            {/* Customer Information */}
            <div className="mb-6">
              <h5 className="font-semibold text-gray-700 mb-[8px]">
                Customer Information
              </h5>
              <p>
                <strong>Name:</strong> {selectedOrder.address.firstName}{" "}
                {selectedOrder.address.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.address.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.address.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address.street},{" "}
                {selectedOrder.address.city}
              </p>
            </div>

            {/* Order Summary */}
            <div className="mb-6">
              <h5 className="font-semibold text-gray-700 mb-[8px]">
                Order Summary
              </h5>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(selectedOrder.date).toDateString()}
              </p>
              <p>
                <strong>Delivery Fee:</strong>
                {selectedOrder.delivery_fee.toFixed(2)}
                <span className="currency">{currency}</span>
              </p>
              <p>
                <strong>Amount:</strong> {selectedOrder.amount.toFixed(2)}
                <span className="currency">{currency}</span>
              </p>
              <p>
                <strong>Order Status:</strong> {selectedOrder.status}
              </p>
            </div>

            {/* Order Items */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-[8px]">
                Order Items
              </h5>
              {/* Table for Order Items */}
              <table className="w-full bg-gray-100 rounded-lg shadow-md mb-6">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-[10px] text-left">Item Name</th>
                    <th className="px-4 py-[10px] text-left">Size</th>
                    <th className="px-4 py-[10px] text-left">Quantity</th>
                    <th className="px-4 py-[10px] text-left">
                      Price ({currency})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="border-b px-4 py-[10px] text-ellipsis overflow-hidden whitespace-nowrap max-w-[150px]">
                        {item.name}
                      </td>
                      <td className="border-b px-4 py-[10px]">
                        {item.size ? item.size : "N/A"}
                      </td>
                      <td className="border-b px-4 py-[10px]">
                        {item.quantity}
                      </td>
                      <td className="border-b px-4 py-[10px]">
                        {item?.discountedPrice
                          ? item?.discountedPrice.toFixed(2)
                          : item?.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cancel Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-[6px] rounded-lg hover:bg-red-600 transition duration=200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
