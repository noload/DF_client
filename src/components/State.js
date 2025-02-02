import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllState,
  deleteState,
  setSelectedState,
} from "../redux/stateSlice";
import { FaEdit, FaTrash, FaSortUp, FaSortDown } from "react-icons/fa";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";

const StatePage = () => {
  const dispatch = useDispatch();
  const { states, loading, error } = useSelector((state) => state.states);

  const [sortedStates, setSortedStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleAddState = () => {
    navigate("/add-state", { state: { isEditing: false } });
  };

  useEffect(() => {
    dispatch(getAllState());
    setFilteredStates(states);
  }, [dispatch, navigate]);

  useEffect(() => {
    setSortedStates(states);
  }, [states]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = sortedStates.filter(
      (state) =>
        state?.name?.toLowerCase().includes(lowercasedQuery) ||
        state?.code?.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredStates(filtered);
  }, [searchQuery, sortedStates]);

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });

    const sorted = [...states].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedStates(sorted);
  };

  const handleDelete = (id) => {
    dispatch(deleteState(id));
  };

  const handleEdit = (state) => {
    navigate("/add-state", {
      state: {
        isEditing: true,
        state: state,
      },
    });
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message={error} />;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://www.figma.com/file/c10JKVfIx31dqgTvPohneq/image/4c1492ea70d2d60430d0da391b821845a63b4562"
              width="60px"
              height="60px"
              alt="Logo"
            />
            <h2 className="text-3xl font-semibold text-gray-800">State</h2>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by state name or code"
              className="border border-gray-300 rounded-lg p-2 w-[550px] focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={handleAddState}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 transition duration-300"
          >
            Add State
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="w-full table-auto text-sm text-gray-700">
            <thead className="bg-yellow-200 text-gray-800">
              <tr>
                {[
                  { label: "ID", key: "_id" },
                  { label: "State Name", key: "name" },
                  { label: "State Code", key: "code" },
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
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStates.length > 0 &&
                filteredStates.map((state, index) => (
                  <tr
                    key={state._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-100 transition duration-200`}
                  >
                    <td className="px-6 py-4 text-center">{state._id}</td>
                    <td className="px-6 py-4 text-center">{state.name}</td>
                    <td className="px-6 py-4 text-center">{state.code}</td>
                    <td
                      className={`px-6 py-4 font-semibold text-center ${
                        state.status === "Active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {state.status}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center space-x-4">
                      <button
                        onClick={() => handleEdit(state)}
                        className="text-blue-500 hover:text-blue-700 transition duration-300"
                        title="Edit"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(state._id)}
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
    </Layout>
  );
};

export default StatePage;
