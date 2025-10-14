import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import assignmentReducer from "./slices/assignmentSlice";
import equipmentReducer from "./slices/equipmentSlice";
import baseReducer from "./slices/baseSlice";
import purchaseReducer from "./slices/purchaseSlice";
import transferReducer from "./slices/transferSlice";
import dashboardReducer from "./slices/dashboardSlice";
import balanceReducer from "./slices/balanceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
    base: baseReducer,
    purchase: purchaseReducer,
    transfer: transferReducer,
    assignment: assignmentReducer,
    dashboard: dashboardReducer,
    balance: balanceReducer,
  },
});
