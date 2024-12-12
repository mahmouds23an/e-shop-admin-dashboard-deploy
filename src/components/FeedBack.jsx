/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const FeedBack = ({ token }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/feedback/get", {
          headers: { token },
        });
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchFeedbacks();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/feedback/delete",
        { id },
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto md:-ml-10 -mt-6">
      <h1 className="text-2xl font-bold mb-4">Users Feedbacks</h1>
      {feedbacks.length === 0 ? (
        <div className="text-2xl font-bold mb-4 text-center text-gray-400 mt-6">
          No feedbacks available
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Feedback</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{feedback.name || "Anonymous"}</td>
                  <td className="py-3 px-4">{feedback.phone || "N/A"}</td>
                  <td className="py-3 px-4">{feedback.feedBack}</td>
                  <td className="py-3 px-4">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedBack;
