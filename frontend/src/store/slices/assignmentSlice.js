import { createSlice } from '@reduxjs/toolkit';
import { assignmentAPI } from '../../service/api';

const initialState = {
  assignments: [],
  expenditures: [],
  loading: false,
  error: null,
};

const assignmentSlice = createSlice({
  name: 'assignment',
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
    fetchAssignmentsSuccess: (state, action) => {
      state.loading = false;
      state.assignments = action.payload.assignments || [];
      state.expenditures = action.payload.expenditures || [];
      state.error = null;
    },
    fetchAssignmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createAssignmentSuccess: (state, action) => {
      state.loading = false;
      state.assignments.push(action.payload);
      state.error = null;
    },
    createAssignmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createExpenditureSuccess: (state, action) => {
      state.loading = false;
      state.expenditures.push(action.payload);
      state.error = null;
    },
    createExpenditureFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const fetchAssignments = (params) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await assignmentAPI.getAssignments(params);
    dispatch(fetchAssignmentsSuccess(response.data));
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch assignments';
    dispatch(fetchAssignmentsFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const createAssignment = (assignmentData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await assignmentAPI.createAssignment(assignmentData);
    dispatch(createAssignmentSuccess(response.data));
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create assignment';
    dispatch(createAssignmentFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const createExpenditure = (expenditureData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await assignmentAPI.createExpenditure(expenditureData);
    dispatch(createExpenditureSuccess(response.data));
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create expenditure';
    dispatch(createExpenditureFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const { 
  clearError, 
  setLoading, 
  setError, 
  fetchAssignmentsSuccess, 
  fetchAssignmentsFailure, 
  createAssignmentSuccess, 
  createAssignmentFailure, 
  createExpenditureSuccess, 
  createExpenditureFailure 
} = assignmentSlice.actions;
export default assignmentSlice.reducer;
