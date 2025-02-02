import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCity, deleteCity } from "../redux/citySlice"; // Ensure correct import
import { FaEdit, FaTrash, FaSortUp, FaSortDown } from "react-icons/fa";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Importing react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";

const CityPage = () => {
  const dispatch = useDispatch();
  const { cities = [], loading, error } = useSelector((state) => state.cities);

  const [sortedCities, setSortedCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]); // New state for filtered cities
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const navigate = useNavigate();

  const handleAddCity = () => {
    navigate("/add-edit-city", { state: { isEditing: false } });
  };

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token || token == undefined) {
      navigate("/");
    }

    dispatch(getAllCity());
    setFilteredCities(cities);
    setSortedCities(cities);
  }, [dispatch, navigate]);

  useEffect(() => {
    setSortedCities(cities);
  }, [cities]);

  useEffect(() => {
    // Filter cities based on search query
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = sortedCities.filter(
      (city) =>
        city?.name?.toLowerCase().includes(lowercasedQuery) ||
        city?.code?.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredCities(filtered || []);
  }, [searchQuery, sortedCities]);

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });

    const sorted = [...cities].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedCities(sorted);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCity(id));
      toast.success("City deleted successfully");
    } catch (error) {
      toast.error("Failed to delete city");
    }
  };

  const handleEdit = (city) => {
    navigate("/add-edit-city", {
      state: {
        isEditing: true,
        city: city,
      },
    });
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message={error} />;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://www.figma.com/file/c10JKVfIx31dqgTvPohneq/image/b83ca030b79f23376eb70bb5879634cbf6e7c89d"
              width="60px"
              height="60px"
              alt="Logo"
            />
            <h2 className="text-3xl font-semibold text-gray-800">City</h2>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by city name or code"
              className="border border-gray-300 rounded-lg p-2 w-[550px] focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={handleAddCity}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 transition duration-300"
          >
            Add City
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="w-full table-auto text-sm text-gray-700">
            <thead className="bg-yellow-200 text-gray-800">
              <tr>
                {[
                  { label: "ID", key: "id" },
                  { label: "City Name", key: "name" },
                  { label: "Code", key: "code" },
                  { label: "State", key: "state" },
                  { label: "Status", key: "status" },
                ].map(({ label, key }) => (
                  <th key={key} className="px-6 py-3 font-medium text-center">
                    <div className="flex items-center justify-center">
                      {label}
                      <div className="ml-2 flex flex-col">
                        <FaSortUp
                          className={`${
                            sortConfig.key === key &&
                            sortConfig.direction === "asc"
                              ? "text-yellow-900"
                              : "text-yellow-600"
                          } cursor-pointer`}
                          onClick={() => handleSort(key, "asc")}
                        />
                        <FaSortDown
                          className={`${
                            sortConfig.key === key &&
                            sortConfig.direction === "desc"
                              ? "text-yellow-900"
                              : "text-yellow-600"
                          } cursor-pointer`}
                          onClick={() => handleSort(key, "desc")}
                        />
                      </div>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCities?.length > 0 &&
                filteredCities.map((city, index) => (
                  <tr
                    key={city._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-100 transition duration-200`}
                  >
                    <td className="px-6 py-4 text-center">
                      {city?._id || "NA"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {city?.name || "NA"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {city?.code || "NA"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {city.state && city.state.name
                        ? city.state.name
                        : "Not Available"}
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold text-center ${
                        city.status === "Active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {city.status}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center space-x-4">
                      <button
                        onClick={() => handleEdit(city)}
                        className="text-blue-500 hover:text-blue-700 transition duration-300"
                        title="Edit"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(city._id)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                        title="Delete"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer />
    </Layout>
  );
};

export default CityPage;
