import { createSlice } from '@reduxjs/toolkit';
import { purchaseApi } from '../../service/api';

const initialState = {
  purchases: [],
  loading: false,
  error: null,
};

const purchaseSlice = createSlice({
  name: 'purchase',
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
    fetchPurchasesSuccess: (state, action) => {
      state.loading = false;
      state.purchases = action.payload;
      state.error = null;
    },
    fetchPurchasesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPurchaseSuccess: (state, action) => {
      state.loading = false;
      state.purchases.push(action.payload);
      state.error = null;
    },
    createPurchaseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const fetchPurchases = (params = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    const query = { ...params };
    // default to current user's purchases
    if (query.mine === undefined) query.mine = true;
    const response = await purchaseApi.getPurchases(query);
    dispatch(fetchPurchasesSuccess(response.data));
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch purchases';
    dispatch(fetchPurchasesFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const createPurchase = (purchaseData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await purchaseApi.createPurchase(purchaseData);
    dispatch(createPurchaseSuccess(response.data));
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create purchase';
    dispatch(createPurchaseFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const { 
  clearError, 
  setLoading, 
  setError, 
  fetchPurchasesSuccess, 
  fetchPurchasesFailure, 
  createPurchaseSuccess, 
  createPurchaseFailure 
} = purchaseSlice.actions;
export default purchaseSlice.reducer;
