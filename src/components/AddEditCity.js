import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCity, updateCity } from "../redux/citySlice"; 
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import { FaArrowLeft } from "react-icons/fa";
import { toast ,ToastContainer} from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import axios from "axios";
import ErrorPage from "./ErrorPage";

const AddEditCityPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditing = location.state?.isEditing;
  const existingCity = location.state?.city || {};

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    state: "",
  });

  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token || token == undefined) {
      navigate('/');
    }

    if (isEditing && existingCity) {
      setFormData({
        name: existingCity.name,
        code: existingCity.code,
        state: existingCity.stateId, 
        _id:existingCity._id
      });
    }

    const fetchStates = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:4000/api/state", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStates(response.data.data);
        setLoadingStates(false);
      } catch (error) {
        toast.error("Failed to fetch states. Please try again.");
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [isEditing, existingCity,navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        dispatch(updateCity(formData)); 
        toast.success("City updated successfully!"); 
        setTimeout(()=>{
            navigate("/city")
        },1000)
      } else {
        console.log(formData);
        dispatch(addCity(formData)); 
        toast.success("City added successfully!");
        setTimeout(()=>{
            navigate("/city")
        },1000)
      }

    } catch (error) {
      toast.error("Failed to save city. Please try again."); 
  if (error) return <ErrorPage message={error} />;

    }
  };

  const handleCancel = () => {
    navigate("/city");
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
          {isEditing ? "Edit City" : "Add City"}
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
                City Name
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-4 pt-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder=" "
                required
              />
              <label
                htmlFor="code"
                className="absolute top-3 left-3 text-gray-500 text-sm transition-all transform -translate-y-1/2 pointer-events-none"
              >
                City Code
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="state"
              className="block text-gray-700 font-medium mb-2"
            >
              Select State
            </label>
            {loadingStates ? (
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
              {isEditing ? "Update City" : "Save"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </Layout>
  );
};

export default AddEditCityPage;
