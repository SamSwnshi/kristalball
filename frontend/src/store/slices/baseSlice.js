import { createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../service/api";

const initialState = {
    bases: [],
    roles: [],
    loading: false,
    error: null,
};

const baseSlice = createSlice({
    name: "base",
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
        fetchBasesSuccess: (state, action) => {
            state.loading = false;
            state.bases = action.payload;
            state.error = null;
        },
        fetchBasesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchRolesSuccess: (state, action) => {
            state.loading = false;
            state.roles = action.payload;
            state.error = null;
        },
        fetchRolesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createBaseSuccess: (state, action) => {
            state.loading = false;
            state.bases.push(action.payload);
            state.error = null;
        },
        createBaseFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createRoleSuccess: (state, action) => {
            state.loading = false;
            state.roles.push(action.payload);
            state.error = null;
        },
        createRoleFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const fetchBases = () => async (dispatch) => {
    try {
        dispatch(setLoading);
        dispatch(clearError());

        const response = await baseApi.getBases();
        dispatch(fetchBasesSuccess(response.data));
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Failed to fetch bases";
        dispatch(fetchBasesFailure(errorMessage));
    }
};
export const fetchRoles = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await baseApi.getRoles();
    dispatch(fetchRolesSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch roles';
    dispatch(fetchRolesFailure(errorMessage));
  }
};

export const createBase = (baseData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await baseApi.createBase(baseData);
    dispatch(createBaseSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create base';
    dispatch(createBaseFailure(errorMessage));
  }
};

export const createRole = (roleData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await baseApi.createRole(roleData);
    dispatch(createRoleSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create role';
    dispatch(createRoleFailure(errorMessage));
  }
};

export const { 
  clearError, 
  setLoading, 
  setError, 
  fetchBasesSuccess, 
  fetchBasesFailure, 
  fetchRolesSuccess, 
  fetchRolesFailure, 
  createBaseSuccess, 
  createBaseFailure, 
  createRoleSuccess, 
  createRoleFailure 
} = baseSlice.actions;
export default baseSlice.reducer;
