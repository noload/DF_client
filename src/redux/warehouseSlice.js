import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Get all warehouses
export const getAllWarehouse = createAsyncThunk("warehouses/getAllWarehouse", async () => {
  const token = getAuthToken();
  const response = await axios.get("http://localhost:4000/api/warehouse", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
});

// Get warehouse by ID
export const getWarehouseById = createAsyncThunk("warehouses/getWarehouseById", async (id) => {
  const token = getAuthToken();
  const response = await axios.get(`http://localhost:4000/api/warehouse/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Add warehouse
export const addWarehouse = createAsyncThunk("warehouses/addWarehouse", async (warehouseData) => {
  const token = getAuthToken();
  const response = await axios.post("http://localhost:4000/api/warehouse", warehouseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Update warehouse
export const updateWarehouse = createAsyncThunk("warehouses/updateWarehouse", async (warehouseData) => {
  const token = getAuthToken();
  console.log(warehouseData);
  const response = await axios.put(`http://localhost:4000/api/warehouse/${warehouseData._id}`, warehouseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Delete warehouse
export const deleteWarehouse = createAsyncThunk("warehouses/deleteWarehouse", async (id) => {
  const token = getAuthToken();
  await axios.delete(`http://localhost:4000/api/warehouse/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return id;
});

const warehouseSlice = createSlice({
  name: "warehouses",
  initialState: {
    warehouses: [],
    loading: false,
    error: null,
    selectedWarehouse: null,
  },
  reducers: {
    setSelectedWarehouse: (state, action) => {
      state.selectedWarehouse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all warehouses
      .addCase(getAllWarehouse.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllWarehouse.fulfilled, (state, action) => {
        state.loading = false;
        state.warehouses = action.payload;
      })
      .addCase(getAllWarehouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get warehouse by ID
      .addCase(getWarehouseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWarehouseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedWarehouse = action.payload;
      })
      .addCase(getWarehouseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add warehouse
      .addCase(addWarehouse.pending, (state) => {
        state.loading = true;
      })
      .addCase(addWarehouse.fulfilled, (state, action) => {
        state.loading = false;
        state.warehouses.push(action.payload); // Add the new warehouse to the list
      })
      .addCase(addWarehouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update warehouse
      .addCase(updateWarehouse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWarehouse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.warehouses.findIndex((warehouse) => warehouse._id === action.payload.id);
        if (index !== -1) {
          state.warehouses[index] = action.payload;
        }
      })
      .addCase(updateWarehouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete warehouse
      .addCase(deleteWarehouse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.loading = false;
        state.warehouses = state.warehouses.filter((warehouse) => warehouse._id !== action.payload);
      })
      .addCase(deleteWarehouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const { setSelectedWarehouse } = warehouseSlice.actions;
export default warehouseSlice.reducer;
