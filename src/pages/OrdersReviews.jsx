/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const OrdersReviews = ({ token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const loadReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/reviews`, {
        headers: { token },
      });
      if (response.data.success) {
        setReviews(response.data.ordersReviews);
        setCount(response.data.count);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllReviews = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/delete-all-reviews`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        loadReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div>
      <div className="container mx-auto md:-ml-10 -mt-6">
        <h3 className="text-2xl font-bold mb-4">
          Orders Reviews{" "}
          <span className="font-normal text-gray-500">({count})</span>
        </h3>
        {reviews.length > 1 && (
          <button
            onClick={handleDeleteAllReviews}
            className="bg-red-500 text-white px-4 py-2 w-[200px] rounded-md hover:bg-red-600"
          >
            Delete All Reviews
          </button>
        )}
      </div>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border p-4 rounded-lg shadow-lg bg-white"
            >
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Order ID: {review._id}
                </h4>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p>
                    <strong>Customer Name:</strong> {review.review.userName}
                  </p>
                  <p>
                    <strong>Customer Phone:</strong> {review.review.phone}
                  </p>
                  <p>
                    <strong>Rating:</strong> {review.review.rating} / 5
                  </p>
                  <p>
                    <strong>Review:</strong> {review.review.comment}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <strong>Date:</strong>{" "}
                    {new Date(review.review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-2xl font-bold mb-4 text-center text-gray-400 mt-6">No reviews available</p>
      )}
    </div>
  );
};

export default OrdersReviews;
