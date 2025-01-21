import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const getAllState = createAsyncThunk("states/getAllState", async () => {
  const token = getAuthToken();
  const response = await axios.get("http://localhost:4000/api/state", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
});

// Get state by ID
export const getStateById = createAsyncThunk("states/getStateById", async (id) => {
  const token = getAuthToken();
  const response = await axios.get(`http://localhost:4000/api/state/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const addState = createAsyncThunk("states/addState", async (stateData) => {
  const token = getAuthToken();
  const response = await axios.post("http://localhost:4000/api/state", stateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const updateState = createAsyncThunk("states/updateState", async (stateData) => {
  const token = getAuthToken();
  const response = await axios.put(
    `http://localhost:4000/api/state/${stateData._id}`,
    stateData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
});

export const deleteState = createAsyncThunk("states/deleteState", async (id) => {
  const token = getAuthToken();
  await axios.delete(`http://localhost:4000/api/state/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return id; 
});

const stateSlice = createSlice({
  name: "states",
  initialState: {
    states: [],
    loading: false,
    error: null,
    selectedState: null,
  },
  reducers: {
    setSelectedState: (state, action) => {
      state.selectedState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all states
      .addCase(getAllState.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllState.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(getAllState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get state by ID
      .addCase(getStateById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStateById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedState = action.payload;
      })
      .addCase(getStateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add state
      .addCase(addState.pending, (state) => {
        state.loading = true;
      })
      .addCase(addState.fulfilled, (state, action) => {
        state.loading = false;
        state.states.push(action.payload); // Add the new state to the list
      })
      .addCase(addState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update state
      .addCase(updateState.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateState.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.states.findIndex((state) => state._id === action.payload.id);
        if (index !== -1) {
          state.states[index] = action.payload;
        }
      })
      .addCase(updateState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete state
      .addCase(deleteState.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.loading = false;
        state.states = state.states.filter((state) => state._id !== action.payload);
      })
      .addCase(deleteState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const { setSelectedState } = stateSlice.actions;
export default stateSlice.reducer;
