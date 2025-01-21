import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addState, updateState } from "../redux/stateSlice"; 
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const AddEditStatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditing = location.state?.isEditing;
  const existingState = location.state?.state || {};

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "Active", 
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token || token == undefined) {
      navigate('/');
    }

    if (isEditing && existingState) {
      setFormData(existingState);
    }
  }, [isEditing, existingState,navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        dispatch(updateState(formData)); 
        toast.success("State updated successfully!");
      } else {
        dispatch(addState(formData)); 
        toast.success("State added successfully!"); // Success toast for adding
      }

      setTimeout(()=>{
        navigate("/state");
      },2000)
    } catch (error) {
      toast.error("Failed to save state. Please try again."); // Error toast
    }
  };

  const handleCancel = () => {
    navigate("/state");
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
          {isEditing ? "Edit State" : "Add State"}
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
                State Name
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
                State Code
              </label>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6">
              <label
                htmlFor="status"
                className="block text-gray-700 font-medium mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}

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
              {isEditing ? "Update State" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditStatePage;
