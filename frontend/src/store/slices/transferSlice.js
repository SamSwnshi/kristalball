import { createSlice } from '@reduxjs/toolkit';
import { transferAPI } from '../../service/api';

const initialState = {
  transfers: [],
  loading: false,
  error: null,
};

const transferSlice = createSlice({
  name: 'transfer',
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
    fetchTransfersSuccess: (state, action) => {
      state.loading = false;
      state.transfers = action.payload;
      state.error = null;
    },
    fetchTransfersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTransferSuccess: (state, action) => {
      state.loading = false;
      state.transfers.push(action.payload);
      state.error = null;
    },
    createTransferFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const fetchTransfers = (params) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await transferAPI.getTransfers(params);
    dispatch(fetchTransfersSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch transfers';
    dispatch(fetchTransfersFailure(errorMessage));
  }
};

export const createTransfer = (transferData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await transferAPI.createTransfer(transferData);
    dispatch(createTransferSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create transfer';
    dispatch(createTransferFailure(errorMessage));
  }
};

export const { 
  clearError, 
  setLoading, 
  setError, 
  fetchTransfersSuccess, 
  fetchTransfersFailure, 
  createTransferSuccess, 
  createTransferFailure 
} = transferSlice.actions;
export default transferSlice.reducer;
