import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addWarehouse, updateWarehouse } from "../redux/warehouseSlice"; // Redux actions for warehouse
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"; // Importing react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications
import axios from "axios";
import ErrorPage from "./ErrorPage";

const AddEditWarehousePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if editing an existing warehouse
  const isEditing = location.state?.isEditing;
  const existingWarehouse = location.state?.warehouse || {};

  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    status: "", // Status added here, but will not show for adding warehouse
  });

  // State for fetching the states and cities list
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true); // Single loading state for both API calls

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Fetch states in a single call
        const statesResponse = await axios.get("http://localhost:4000/api/state", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStates(statesResponse.data.data);
      } catch (error) {
        toast.error("Failed to fetch states. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
      }
    };

    fetchData();
  }, []);

  // Fetch cities based on the selected state
  useEffect(() => {
    const fetchCities = async () => {
      if (formData.state) {
        try {
          const token = localStorage.getItem("authToken");
          console.log(formData.state);
          const citiesResponse = await axios.get(
            `http://localhost:4000/api/city?state=${formData.state}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCities(citiesResponse.data.data);
        } catch (error) {
          toast.error("Failed to fetch cities. Please try again.");
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [formData.state]);

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token || token == undefined) {
      navigate('/');
    }

    if (isEditing && existingWarehouse) {
      setFormData({
        name: existingWarehouse.name,
        city: existingWarehouse.city._id, 
        state: existingWarehouse.state._id, 
        status: existingWarehouse.status,
        _id: existingWarehouse._id,
      });
    }
  }, [isEditing, existingWarehouse,navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        dispatch(updateWarehouse(formData)); // Dispatch the update action
        toast.success("Warehouse updated successfully!"); // Success toast for editing
        setTimeout(() => {
          navigate("/warehouse");
        }, 1000);
      } else {
        dispatch(addWarehouse(formData)); // Dispatch the add action
        toast.success("Warehouse added successfully!"); // Success toast for adding
        setTimeout(() => {
          navigate("/warehouse");
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to save warehouse. Please try again."); // Error toast
  if (error) return <ErrorPage message={error} />;

    }
  };

  const handleCancel = () => {
    navigate("/warehouse");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEditing ? "Edit Warehouse" : "Add Warehouse"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-4 pt-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="absolute top-3 left-3 text-gray-500 text-sm transition-all transform -translate-y-1/2 pointer-events-none"
              >
                Warehouse Name
              </label>
            </div>

            {/* Only show status dropdown if in edit mode */}
            {isEditing && (
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-4 pt-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <label
                  htmlFor="status"
                  className="absolute top-3 left-3 text-gray-500 text-sm transition-all transform -translate-y-1/2 pointer-events-none"
                >
                  Status
                </label>
              </div>
            )}
          </div>

          {/* State Dropdown */}
          <div className="mt-6">
            <label
              htmlFor="state"
              className="block text-gray-700 font-medium mb-2"
            >
              Select State
            </label>
            {loading ? (
              <div className="text-center">Loading States...</div>
            ) : (
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* City Dropdown */}
          <div className="mt-6">
            <label
              htmlFor="city"
              className="block text-gray-700 font-medium mb-2"
            >
              Select City
            </label>
            {loading ? (
              <div className="text-center">Loading Cities...</div>
            ) : (
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800"
            >
              {isEditing ? "Update Warehouse" : "Save"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </Layout>
  );
};

export default AddEditWarehousePage;
