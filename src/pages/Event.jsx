/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Event = ({ token }) => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    linkText: "Shop Now",
    endDate: "",
    imageUrl: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/event/get`);
      setEvents(response.data.events || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch events."
      );
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add or update event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = editingId
        ? await axios.post(
            `${backendUrl}/api/event/update`,
            { ...formData, id: editingId },
            { headers: { token } }
          )
        : await axios.post(`${backendUrl}/api/event/create`, formData, {
            headers: { token },
          });

      fetchEvents();
      setFormData({
        title: "",
        description: "",
        linkText: "Shop Now",
        endDate: "",
        imageUrl: "",
        isActive: true,
      });
      setEditingId(null);
      toast.success(response.data.message || "Event saved successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save event."
      );
    }
  };

  // Edit event
  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      linkText: event.linkText,
      endDate: new Date(event.endDate).toISOString().substring(0, 10),
      imageUrl: event.imageUrl,
      isActive: event.isActive,
    });
    setEditingId(event._id);
  };

  // Delete event
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/event/delete`,
          { id },
          { headers: { token } }
        );
        fetchEvents();
        toast.success(
          response.data.message || "Event deleted successfully."
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete event."
        );
      }
    }
  };

  return (
    <div className="container mx-auto md:-ml-10 -mt-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>

      {/* Event Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-4 mb-6"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="shadow resize-none h-20 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Link Text:
          </label>
          <input
            type="text"
            name="linkText"
            value={formData.linkText}
            onChange={handleChange}
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
            value={formData.endDate ? formData.endDate : "null"}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image URL:
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
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
            {editingId ? "Update Event" : "Add Event"}
          </button>
        </div>
      </form>

      {/* Events List */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Existing Events</h2>
        <table className="min-w-full bg-white shadow-md rounded border border-gray-400">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Link Text</th>
              <th className="py-3 px-6 text-left">End Date</th>
              <th className="py-3 px-6 text-left">Active</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {Array.isArray(events) && events.length > 0 ? (
              events.map((event) => (
                <tr
                  key={event._id}
                  className="border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{event.title}</td>
                  <td className="py-3 px-6 text-left">{event.description}</td>
                  <td className="py-3 px-6 text-left">{event.linkText}</td>
                  <td className="py-3 px-6 text-left">
                    {new Date(event.endDate).toDateString()}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {event.isActive && new Date(event.endDate) > new Date()
                      ? "Yes"
                      : "No"}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <button
                      onClick={() => handleEdit(event)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 mr-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 px-6 text-center">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Event;
