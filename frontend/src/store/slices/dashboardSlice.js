import { createSlice } from '@reduxjs/toolkit';
import { dashboardAPI } from '../../service/api';

const initialState = {
  metrics: null,
  detailedMovement: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    fetchMetricsSuccess: (state, action) => {
      state.loading = false;
      state.metrics = action.payload;
      state.error = null;
    },
    fetchMetricsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchDetailedMovementSuccess: (state, action) => {
      state.loading = false;
      state.detailedMovement = action.payload;
      state.error = null;
    },
    fetchDetailedMovementFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const fetchMetrics = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await dashboardAPI.getMetrics();
    dispatch(fetchMetricsSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch metrics';
    dispatch(fetchMetricsFailure(errorMessage));
  }
};

export const fetchDetailedMovement = (params) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await dashboardAPI.getDetailedMovement(params);
    dispatch(fetchDetailedMovementSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch detailed movement';
    dispatch(fetchDetailedMovementFailure(errorMessage));
  }
};

export const { 
  clearError, 
  setLoading, 
  setError, 
  fetchMetricsSuccess, 
  fetchMetricsFailure, 
  fetchDetailedMovementSuccess, 
  fetchDetailedMovementFailure 
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
