/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Promos = ({ token }) => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    endDate: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all promo codes
  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/promo/get`);
      setPromoCodes(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch promo codes."
      );
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add or update promo code
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = editingId
        ? await axios.post(
            `${backendUrl}/api/promo/update`,
            { ...formData, id: editingId },
            { headers: { token } }
          )
        : await axios.post(`${backendUrl}/api/promo/add`, formData, {
            headers: { token },
          });

      fetchPromoCodes();
      setFormData({
        code: "",
        discountPercentage: "",
        endDate: "",
        isActive: true,
      });
      setEditingId(null);
      toast.success(response.data.message || "Promo code saved successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save promo code."
      );
    }
  };

  // Edit promo code
  const handleEdit = (promoCode) => {
    setFormData({
      code: promoCode.code,
      discountPercentage: promoCode.discountPercentage,
      endDate: new Date(promoCode.endDate).toISOString().substring(0, 10),
      isActive: promoCode.isActive,
    });
    setEditingId(promoCode._id);
  };

  // Delete promo code
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this promo code?")) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/promo/delete`,
          { id },
          { headers: { token } }
        );
        fetchPromoCodes();
        toast.success(
          response.data.message || "Promo code deleted successfully."
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete promo code."
        );
      }
    }
  };

  return (
    <div className="container mx-auto md:-ml-10 -mt-6">
      <h1 className="text-2xl font-bold mb-4">Promo Codes</h1>

      {/* Promo Code Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-4 mb-6"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Code:
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Discount Percentage:
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            min="1"
            max="100"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Date:
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2">
              Active:
            </label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editingId ? "Update Promo Code" : "Add Promo Code"}
          </button>
        </div>
      </form>

      {/* Promo Codes List */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Existing Promo Codes</h2>
        <table className="min-w-full bg-white shadow-md rounded border border-gray-400">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Discount %</th>
              <th className="py-3 px-6 text-left">End Date</th>
              <th className="py-3 px-6 text-left">Active</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {Array.isArray(promoCodes) && promoCodes.length > 0 ? (
              promoCodes.map((promoCode) => (
                <tr
                  key={promoCode._id}
                  className="border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{promoCode.code}</td>
                  <td className="py-3 px-6 text-left">
                    {promoCode.discountPercentage}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(promoCode.endDate).toDateString()}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {promoCode.isActive &&
                    new Date(promoCode.endDate) > new Date()
                      ? "Yes"
                      : "No"}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <button
                      onClick={() => handleEdit(promoCode)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 mr-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(promoCode._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No promo codes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Promos;
