/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";
import ImageModal from "../components/ImageModel";
import { sizesOptions } from "../../helpers/helperFunctions";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    costPrice: "",
    description: "",
    category: "",
    subCategory: "",
    bestSeller: false,
    discountStatus: false,
    discountedPrice: "",
    sizes: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [enlargedImage, setEnlargedImage] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/get-products`
      );
      if (response.data.success) {
        setList(response.data.products);
        setCount(response.data.count);
      }
      if (response.data.count === 0) {
        setList([]);
        setCount(0);
        toast.info("No products found");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = (id) => {
    const confirmDelete = () => {
      toast.success("Product deleted successfully.");
      fetchList();
    };

    const deleteToast = toast(
      <div>
        <p>Are you sure you want to delete this product?</p>
        <div className="flex justify-around mt-2">
          <button
            onClick={async () => {
              try {
                const response = await axios.post(
                  `${backendUrl}/api/product/delete-product`,
                  { id },
                  { headers: { token } }
                );
                if (response.data.success) {
                  confirmDelete();
                } else {
                  toast.error(response.data.message);
                }
              } catch (error) {
                toast.error(error.message);
              }
              toast.dismiss(deleteToast);
            }}
            className="bg-red-600 text-white px-2 py-1 rounded mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(deleteToast)}
            className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const editProduct = (id) => {
    const product = list.find((item) => item._id === id);
    if (product) {
      setEditingProduct(id);
      setFormData({
        name: product.name,
        price: product.price,
        costPrice: product.costPrice,
        description: product.description,
        category: product.category,
        subCategory: product.subCategory,
        bestSeller: Boolean(product.bestSeller),
        discountStatus: product.discountStatus || false,
        discountedPrice: product.discountedPrice || "",
        sizes: product.sizes || [],
      });
    }
  };

  const updateProduct = async () => {
    if (
      formData.discountStatus &&
      (parseFloat(formData.discountedPrice) >= parseFloat(formData.price) ||
        parseFloat(formData.discountedPrice) <= parseFloat(formData.costPrice))
    ) {
      toast.error(
        `Discounted price must be less than ${formData.price} and greater than ${formData.costPrice}`
      );
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/update-product`,
        {
          id: editingProduct,
          name: formData.name,
          price: formData.price,
          costPrice: formData.costPrice,
          description: formData.description,
          category: formData.category,
          subCategory: formData.subCategory,
          bestSeller: formData.bestSeller,
          sizes: JSON.stringify(formData.sizes),
          discountStatus: formData.discountStatus,
          discountedPrice: formData.discountStatus
            ? formData.discountedPrice
            : "",
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        fetchList();
        setEditingProduct(null);
        setFormData({
          name: "",
          price: "",
          costPrice: "",
          description: "",
          category: "",
          subCategory: "",
          bestSeller: false,
          discountStatus: false,
          discountedPrice: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter((item) => {
    const searchWords = searchTerm.toLowerCase().split(" ");
    const nameIncludesAll = searchWords.every((word) =>
      item.name.toLowerCase().includes(word)
    );
    const categoryIncludesAll = searchWords.every((word) =>
      item.category.toLowerCase().includes(word)
    );
    const subCategoryIncludesAll = searchWords.every((word) =>
      item.subCategory.toLowerCase().includes(word)
    );
    const priceIncludesAll = searchWords.every((word) =>
      item.price.toString().includes(word)
    );
    return (
      nameIncludesAll ||
      categoryIncludesAll ||
      subCategoryIncludesAll ||
      priceIncludesAll
    );
  });

  const highlightText = (text, searchTerm) => {
    if (!text || typeof text !== "string") return text || "";

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
    <>
      <div className="container mx-auto md:-ml-10 -mt-6 flex flex-col md:flex-row gap-4 justify-between mb-4">
        <p className="text-2xl font-bold">
          All Products List
          <span className="ml-2 px-3 py-1 rounded-full bg-gray-600 text-white">
            {count}
          </span>
        </p>
        <div className="relative w-full md:w-72">
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="hidden md:grid grid-cols-[1.5fr_2.5fr_1fr_1fr_2fr] items-center py-3 px-4 bg-gray-200 text-sm font-semibold text-gray-700 rounded-lg shadow-md">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price ({currency})</span>
          <span className="text-center">Actions</span>
        </div>

        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src={assets.no_results_icon}
              alt="No products found"
              className="w-96 h-auto mx-auto"
            />
            <p className="text-gray-600 mt-4">No products found.</p>
          </div>
        ) : (
          filteredList.map((item, index) => (
            <div
              className="grid grid-cols-3 md:grid-cols-[1.5fr_2.5fr_1fr_1fr_2fr] items-center py-3 
              px-4 border border-gray-300 text-sm gap-3 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition duration-200"
              key={index}
            >
              <div
                className="hidden md:block relative w-16 h-16 rounded-lg overflow-hidden shadow-md 
              border border-gray-300 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <img
                  src={item.image[0]}
                  className="object-cover w-full h-full"
                  alt={item.name}
                  onClick={() => setEnlargedImage(item.image[0])}
                />
              </div>
              <p className="text-ellipsis max-w-full overflow-hidden whitespace-nowrap">
                {highlightText(item?.name || "", searchTerm)}
              </p>
              <p className="hidden md:block">
                {highlightText(item?.category || "", searchTerm)}
              </p>
              <p>
                {highlightText(
                  item?.discountedPrice
                    ? String(item?.discountedPrice)
                    : String(item?.price || ""),
                  searchTerm
                )}
              </p>
              <div className="flex gap-2 justify-center items-center">
                <button
                  onClick={() => removeProduct(item._id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 text-xs md:text-sm rounded-lg transition duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => editProduct(item._id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 text-xs md:text-sm rounded-lg transition duration-200"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {enlargedImage && (
        <ImageModal
          imageSrc={enlargedImage}
          onClose={() => setEnlargedImage(null)}
        />
      )}

      {editingProduct && (
        <>
          {/* Background Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setEditingProduct(null)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 mx-4 relative overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Edit Product
              </h2>

              {/* Product Information Fields */}
              {["name", "description", "costPrice", "price"].map((field) => (
                <div className="mb-4" key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field !== "description" ? (
                    <input
                      type={
                        field === "price" || field === "costPrice"
                          ? "number"
                          : "text"
                      }
                      id={field}
                      placeholder={`Enter product ${field}`}
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <textarea
                      id={field}
                      placeholder={`Enter product ${field}`}
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg py-2 px-3 w-full resize-none h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}
                </div>
              ))}

              {/* Discount Status and Discounted Price */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.discountStatus || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountStatus: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-indigo-500 focus:ring-indigo-500 rounded"
                />
                <label className="ml-2 text-gray-700 text-sm">
                  Apply Discount
                </label>
              </div>

              {formData.discountStatus && (
                <div className="mb-4">
                  <label
                    htmlFor="discountedPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    id="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountedPrice: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Available Sizes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Sizes:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(sizesOptions[formData.category] || []).map((size) => (
                    <label
                      key={size}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sizes: e.target.checked
                              ? [...prev.sizes, size]
                              : prev.sizes.filter((s) => s !== size),
                          }))
                        }
                        className="w-4 h-4 text-indigo-500 focus:ring-indigo-500 rounded"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Best Seller Checkbox */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.bestSeller || false}
                  onChange={(e) =>
                    setFormData({ ...formData, bestSeller: e.target.checked })
                  }
                  className="w-5 h-5 text-indigo-500 focus:ring-indigo-500 rounded"
                />
                <label className="ml-2 text-gray-700 text-sm">
                  Mark as Best Seller
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateProduct()}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default List;
