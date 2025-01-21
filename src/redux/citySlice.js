import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Get all cities
export const getAllCity = createAsyncThunk("cities/getAllCity", async () => {
  const token = getAuthToken();
  const response = await axios.get("http://localhost:4000/api/city", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
});

// Get city by ID
export const getCityById = createAsyncThunk("cities/getCityById", async (id) => {
  const token = getAuthToken();
  const response = await axios.get(`http://localhost:4000/api/city/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Add city
export const addCity = createAsyncThunk("cities/addCity", async (cityData) => {
  const token = getAuthToken();
  const response = await axios.post("http://localhost:4000/api/city", cityData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Update city
export const updateCity = createAsyncThunk("cities/updateCity", async (cityData) => {
  const token = getAuthToken();
  const response = await axios.put(`http://localhost:4000/api/city/${cityData._id}`, cityData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Delete city
export const deleteCity = createAsyncThunk("cities/deleteCity", async (id) => {
  const token = getAuthToken();
  await axios.delete(`http://localhost:4000/api/city/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return id;
});

const citySlice = createSlice({
  name: "cities",
  initialState: {
    cities: [],
    loading: false,
    error: null,
    selectedCity: null,
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all cities
      .addCase(getAllCity.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(getAllCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get city by ID
      .addCase(getCityById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCityById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCity = action.payload;
      })
      .addCase(getCityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add city
      .addCase(addCity.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities.push(action.payload); // Add the new city to the list
      })
      .addCase(addCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update city
      .addCase(updateCity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cities.findIndex((city) => city._id === action.payload.id);
        if (index !== -1) {
          state.cities[index] = action.payload;
        }
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete city
      .addCase(deleteCity.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = state.cities.filter((city) => city._id !== action.payload);
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const { setSelectedCity } = citySlice.actions;
export default citySlice.reducer;
