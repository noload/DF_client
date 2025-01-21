
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const getAllState = createAsyncThunk('states/getAllState', async () => {
  const response = await axios.get('http://localhost:4000/api/states'); 
  return response.data;
});

export const getStateById = createAsyncThunk('states/getStateById', async (id) => {
  const response = await axios.get(`http://localhost:4000/api/states/${id}`); 
  return response.data;
});

export const updateState = createAsyncThunk('states/updateState', async (stateData) => {
  const response = await axios.put(`http://localhost:4000/api/states/${stateData.id}`, stateData); 
  return response.data;
});

export const deleteState = createAsyncThunk('states/deleteState', async (id) => {
  const response = await axios.delete(`http://localhost:4000/api/states/${id}`); 
  return id; 
});

const stateSlice = createSlice({
  name: 'states',
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
      .addCase(updateState.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateState.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.states.findIndex(state => state.id === action.payload.id);
        if (index !== -1) {
          state.states[index] = action.payload;
        }
      })
      .addCase(updateState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteState.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.loading = false;
        state.states = state.states.filter(state => state.id !== action.payload);
      })
      .addCase(deleteState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedState } = stateSlice.actions;
export default stateSlice.reducer;