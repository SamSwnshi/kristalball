import { createSlice } from '@reduxjs/toolkit';
import { balanceAPI } from '../../service/api';

const initialState = {
  balanceSummary: null,
  calculatedBalances: null,
  debugData: null,
  loading: false,
  error: null,
};

const balanceSlice = createSlice({
  name: 'balance',
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
    fetchBalanceSummarySuccess: (state, action) => {
      state.loading = false;
      state.balanceSummary = action.payload;
      state.error = null;
    },
    fetchBalanceSummaryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    calculateBalancesSuccess: (state, action) => {
      state.loading = false;
      state.calculatedBalances = action.payload;
      state.error = null;
    },
    calculateBalancesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setOpeningBalanceSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    setOpeningBalanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchDebugDataSuccess: (state, action) => {
      state.loading = false;
      state.debugData = action.payload;
      state.error = null;
    },
    fetchDebugDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const fetchBalanceSummary = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await balanceAPI.getBalanceSummary();
    dispatch(fetchBalanceSummarySuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch balance summary';
    dispatch(fetchBalanceSummaryFailure(errorMessage));
  }
};

export const calculateBalances = (balanceData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await balanceAPI.calculateBalances(balanceData);
    dispatch(calculateBalancesSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to calculate balances';
    dispatch(calculateBalancesFailure(errorMessage));
  }
};

export const setOpeningBalance = (balanceData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await balanceAPI.setOpeningBalance(balanceData);
    dispatch(setOpeningBalanceSuccess());
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to set opening balance';
    dispatch(setOpeningBalanceFailure(errorMessage));
  }
};

export const fetchDebugData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await balanceAPI.debugData();
    dispatch(fetchDebugDataSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch debug data';
    dispatch(fetchDebugDataFailure(errorMessage));
  }
};

export const { 
  clearError, 
  setLoading, 
  setError, 
  fetchBalanceSummarySuccess, 
  fetchBalanceSummaryFailure, 
  calculateBalancesSuccess, 
  calculateBalancesFailure, 
  setOpeningBalanceSuccess, 
  setOpeningBalanceFailure, 
  fetchDebugDataSuccess, 
  fetchDebugDataFailure 
} = balanceSlice.actions;
export default balanceSlice.reducer;
