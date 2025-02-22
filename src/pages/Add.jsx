/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
  sizesOptions,
  subCategoriesOptions,
} from "../../helpers/helperFunctions";

const Add = ({ token }) => {
  const [availableSizes, setAvailableSizes] = useState(sizesOptions.Men);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState(subCategoriesOptions[0]);
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discountStatus, setDiscountStatus] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState("");

  useEffect(() => {
    setAvailableSizes(sizesOptions[category]);
    setSizes([]);
  }, [category]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const checkDuplicateImages = () => {
      const images = [image1, image2, image3, image4].filter(Boolean);
      const uniqueImages = new Set(images);
      for (let img of images) {
        const imageKey = `${img.name}-${img.size}`;
        if (uniqueImages.has(imageKey)) {
          return true;
        }
        uniqueImages.add(imageKey);
      }
      return false;
    };

    if (!image1 && !image2 && !image3 && !image4) {
      toast.error("Please upload at least one image");
      return;
    }
    if (checkDuplicateImages()) {
      toast.error("You have selected the same image more than once.");
      return;
    }
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!price && !costPrice) {
      toast.error("Product price is required");
      return;
    }
    if (Number(price) <= 0 && Number(costPrice) <= 0) {
      toast.error("Product price must be greater than zero");
      return;
    }
    if (Number(price) <= Number(costPrice)) {
      toast.error(`Product price must be greater than ${costPrice}`);
      return;
    }
    if (discountStatus && !discountedPrice) {
      toast.error("Please enter a discounted price");
      return;
    }
    if (discountStatus && Number(discountedPrice) >= Number(price)) {
      toast.error(`Discounted price must be less than ${price}`);
      return;
    }
    if (discountStatus && Number(discountedPrice) <= Number(costPrice)) {
      toast.error(`Discounted price must be greater than ${costPrice}`);
      return;
    }
    if (sizes.length === 0) {
      toast.error("You must select at least one size");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("costPrice", costPrice);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("discountStatus", discountStatus);
      formData.append("discountedPrice", discountedPrice);
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      const response = await axios.post(
        backendUrl + "/api/product/add-product",
        formData,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setName("");
        setDescription("");
        setPrice("");
        setCostPrice("");
        setCategory(sizesOptions.Men);
        setSubCategory(subCategoriesOptions[0]);
        setBestSeller(false);
        setSizes([]);
        setAvailableSizes(sizesOptions.Men);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(
          response.data.message ===
            "Product name already taken, please change it"
            ? "Product name already taken, please change it"
            : "An unexpected error occurred. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data.message
          : "An error occurred while adding the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto md:-ml-10 -mt-6">
      <h1 className="text-2xl font-bold mb-4">New product</h1>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 w-full max-w-[600px]"
      >
        {/* Image Upload */}
        <div>
          <p className="mb-2 text-sm font-semibold">Upload Image</p>
          <div className="flex gap-4">
            {[image1, image2, image3, image4].map((image, index) => (
              <div key={index} className="flex flex-col items-center">
                <label htmlFor={`image${index + 1}`}>
                  <img
                    className="w-20 h-20 object-cover"
                    src={
                      !image ? assets.upload_area : URL.createObjectURL(image)
                    }
                    alt={`Image ${index + 1}`}
                  />
                  <input
                    onChange={(e) => {
                      const setImage = [
                        setImage1,
                        setImage2,
                        setImage3,
                        setImage4,
                      ][index];
                      setImage(e.target.files[0]);
                    }}
                    type="file"
                    id={`image${index + 1}`}
                    hidden
                  />
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => {
                      const setImage = [
                        setImage1,
                        setImage2,
                        setImage3,
                        setImage4,
                      ][index];
                      setImage(false);
                    }}
                    className="mt-2 text-xs text-red-600"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <p className="mb-2 text-sm font-semibold">Product Name</p>
          <input
            className="w-full px-3 py-1 border border-gray-300 rounded-md"
            type="text"
            placeholder="Enter the product name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Product Description</p>
          <textarea
            className="w-full px-3 py-1 border border-gray-300 rounded-md resize-none h-24"
            placeholder="Enter the product description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>

        {/* Category & Subcategory */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <p className="mb-2 text-sm font-semibold">Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Babies">Babies</option>
              <option value="Socks">Socks</option>
              <option value="Towels">Towels</option>
              <option value="Textiles">Textiles</option>
            </select>
          </div>

          <div className="w-1/2">
            <p className="mb-2 text-sm font-semibold">Sub-Category</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md"
            >
              <option value="Cottonil">Cottonil</option>
              <option value="Dice">Dice</option>
              <option value="Embarator">Embarator</option>
              <option value="Jet">Jet</option>
              <option value="Royal">Royal</option>
              <option value="Vona">Vona</option>
              <option value="Elnour">Elnour</option>
              <option value="Solo">Solo</option>
              <option value="Lasso">Lasso</option>
              <option value="Rotana">Rotana</option>
              <option value="Kalia">Kalia</option>
              <option value="Colors">Colors</option>
              <option value="Konouz">Konouz</option>
              <option value="Pantone">Pantone</option>
              <option value="Elshafeay">Elshafeay</option>
            </select>
          </div>
        </div>

        {/* Price & Cost Price */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <p className="mb-2 text-sm font-semibold">Cost Price</p>
            <input
              className="w-full px-3 py-1 border border-gray-300 rounded-md"
              type="number"
              placeholder="Enter cost price"
              onChange={(e) => setCostPrice(e.target.value)}
              value={costPrice}
            />
          </div>

          <div className="w-1/2">
            <p className="mb-2 text-sm font-semibold">Product Price</p>
            <input
              className="w-full px-3 py-1 border border-gray-300 rounded-md"
              type="number"
              placeholder="Enter product price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>
        </div>

        {/* Best Seller */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={() => setBestSeller(!bestSeller)}
              className="h-4 w-4"
            />
            <span className="text-sm">Best Seller</span>
          </label>
        </div>

        {/* Sizes */}
        <div>
          <p className="mb-2 text-sm font-semibold">Select Sizes</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {availableSizes.map((size) => (
              <label key={size} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={size}
                  checked={sizes.includes(size)}
                  onChange={() => {
                    setSizes((prevSizes) =>
                      prevSizes.includes(size)
                        ? prevSizes.filter((s) => s !== size)
                        : [...prevSizes, size]
                    );
                  }}
                  className="h-4 w-4"
                />
                <span className="text-sm">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={discountStatus}
              onChange={() => setDiscountStatus(!discountStatus)}
              className="h-4 w-4"
            />
            <span className="text-sm">Apply Discount</span>
          </label>
          {discountStatus && (
            <div className="mt-2">
              <p className="mb-2 text-sm font-semibold">Discounted Price</p>
              <input
                className="w-full px-3 py-1 border border-gray-300 rounded-md"
                type="number"
                placeholder="Enter discounted price"
                onChange={(e) => setDiscountedPrice(e.target.value)}
                value={discountedPrice}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
