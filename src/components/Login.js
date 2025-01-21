import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaEnvelope, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name } = formData;

    if (!email || !password || (isRegistering && !name)) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const url = isRegistering
        ? "http://localhost:4000/api/user"
        : "http://localhost:4000/api/user/login";
      const data = isRegistering
        ? { name, email, password }
        : { email, password };
      const response = await axios.post(url, data);

      const { token } = response.data;
      localStorage.setItem("authToken", token);

      toast.success(`${isRegistering ? "Registration" : "Login"} successful!`);
      window.location.href = "/home";
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:4000/api/user/forgot-password", {
        email: resetEmail,
      });
      toast.success("Password reset email sent!");
      setModalVisible(false);
    } catch (err) {
      toast.error("Error sending reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      document.getElementById("resetEmail").focus();
    }
  }, [modalVisible]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-sm"
      >
        <div className="flex justify-center items-center flex-col mb-6">
          <img
            src="https://www.figma.com/file/c10JKVfIx31dqgTvPohneq/image/d761c44f321741d69c0a3f8dee89b594a0a71974"
            alt="Logo"
            className="w-21 h-21"
          />
          <h2 className="text-xl font-semibold text-gray-500 mb-6">
          Welcome to Digitalflake admin
          </h2>
          <h2 className="text-2xl font-semibold text-gray-700">
            {isRegistering ? "Register" : "Login"}
          </h2>
        </div>

        {isRegistering && (
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Name"
              required
            />
          </div>
        )}

        <div className="mb-4 relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-6 relative">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="flex justify-between mb-4">
          {!isRegistering && (
            <button
              type="button"
              onClick={() => setModalVisible(true)}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-500 hover:underline"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "New here? Register"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading
            ? isRegistering
              ? "Registering..."
              : "Logging in..."
            : isRegistering
            ? "Register"
            : "Login"}
        </button>
      </form>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-sm shadow-lg relative">
            <button
              onClick={() => setModalVisible(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-center mb-4">
              Forgot Password?
            </h3>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
            <button
              onClick={handleResetPasswordSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Login;
