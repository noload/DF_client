import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllWarehouse, deleteWarehouse } from "../redux/warehouseSlice";
import { FaEdit, FaTrash, FaSortUp, FaSortDown } from "react-icons/fa";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";

const WarehousePage = () => {
  const dispatch = useDispatch();
  const { warehouses, loading, error } = useSelector((state) => state.warehouses);

  const [sortedWarehouses, setSortedWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const navigate = useNavigate();

  const handleAddWarehouse = () => {
    navigate("/add-edit-warehouse", { state: { isEditing: false } });
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token || token === undefined) {
      navigate('/');
    }

    dispatch(getAllWarehouse());
  }, [dispatch]);

  useEffect(() => {
    setSortedWarehouses(warehouses);
  }, [warehouses]);

  // Filter warehouses based on search query
  useEffect(() => {
    const filtered = warehouses.filter(
      (warehouse) =>
        warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.city?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.state?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWarehouses(filtered);
  }, [searchQuery, warehouses]);

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });

    const sorted = [...warehouses].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedWarehouses(sorted);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteWarehouse(id));
      toast.success("Warehouse deleted successfully");
    } catch (error) {
      toast.error("Failed to delete warehouse");
    }
  };

  const handleEdit = (warehouse) => {
    navigate("/add-edit-warehouse", {
      state: {
        isEditing: true,
        warehouse: warehouse,
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
              src="https://www.figma.com/file/c10JKVfIx31dqgTvPohneq/image/c0007c2b33c71569db418f9bf0423e0120209ee9"
              width="60px"
              height="60px"
              alt="Warehouse Logo"
            />
            <h2 className="text-3xl font-semibold text-gray-800">Warehouse</h2>
          </div>

          {/* Search Box */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by warehouse name, city, or state"
              className="border border-gray-300 rounded-md p-2 w-[550px] focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={searchQuery} // Bind the input value to the searchQuery state
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
            />
          </div>

          <button
            onClick={handleAddWarehouse}
            className="bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-800 transition duration-200"
          >
            Add Warehouse
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg border border-gray-200">
          <table className="w-full table-auto text-sm text-gray-700">
            <thead className="bg-yellow-200 text-gray-800">
              <tr>
                {[
                  { label: "ID", key: "_id" },
                  { label: "Warehouse Name", key: "name" },
                  { label: "City", key: "city" },
                  { label: "State", key: "state" },
                  { label: "Status", key: "status" },
                ].map(({ label, key }) => (
                  <th key={key} className="px-6 py-3 font-medium text-center">
                    <div className="flex items-center justify-center">
                      {label}
                      <div className="ml-2 flex flex-col">
                        <FaSortUp
                          className={`${
                            sortConfig.key === key && sortConfig.direction === "asc"
                              ? "text-yellow-700"
                              : "text-yellow-400"
                          } cursor-pointer`}
                          onClick={() => handleSort(key, "asc")}
                        />
                        <FaSortDown
                          className={`${
                            sortConfig.key === key && sortConfig.direction === "desc"
                              ? "text-yellow-700"
                              : "text-yellow-400"
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
            <tbody className="divide-y divide-gray-300">
              {filteredWarehouses.map((warehouse, index) => (
                <tr
                  key={warehouse._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-100 transition duration-200 p-2`}
                >
                  <td className="px-6 py-4 text-center">{warehouse._id}</td>
                  <td className="px-6 py-4 text-center">{warehouse.name}</td>
                  <td className="px-6 py-4 text-center">{warehouse.city?.name || "Not Available"}</td>
                  <td className="px-6 py-4 text-center">{warehouse.state?.name || "Not Available"}</td>
                  <td
                    className={`px-6 py-4 font-semibold text-center ${
                      warehouse.status === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {warehouse.status}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(warehouse)}
                      className="text-blue-500 hover:text-blue-700 transition duration-300"
                      title="Edit"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(warehouse._id || warehouse.id)}
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

export default WarehousePage;
