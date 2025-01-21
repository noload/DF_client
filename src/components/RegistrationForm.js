import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigator = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = formData;

    // Basic Validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("http://localhost:4000/api/user", {
        name,
        email,
        password,
      });

      toast.success("Registration successful!");

      setFormData({ name: "", email: "", password: "" });
      setTimeout(()=>{
        navigator("/");
      },2000)
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error(err.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <ErrorPage message={error} />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-sm"
      >
         <div className="flex justify-center items-center flex-col mb-8">
          <img
            src="https://www.figma.com/file/c10JKVfIx31dqgTvPohneq/image/d761c44f321741d69c0a3f8dee89b594a0a71974"
            width={"200px"}
            height={"200px"}
          />
          <h2 className="font-poppins text-xl font-normal leading-9 text-left text-[#868686]">
            Welcome to Digitalflake admin
          </h2>
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-6 relative">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Password
          </label>
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute top-8 inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-md mt-4 hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/" className="text-blue-500 hover:text-blue-700">
              Login
            </a>
          </p>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default RegistrationForm;
