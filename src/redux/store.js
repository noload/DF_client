import { configureStore } from '@reduxjs/toolkit';
import stateReducer from './stateSlice';
import cityReducer from "./citySlice"
import warehouseReducer from "./warehouseSlice"
export const store = configureStore({
  reducer: {
    states: stateReducer,
    cities:cityReducer,
    warehouses: warehouseReducer,
  },
});