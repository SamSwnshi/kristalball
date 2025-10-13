import { createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../service/api";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    setupBasesSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    setupBasesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());

    const response = await authAPI.login(credentials);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    dispatch(loginSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    dispatch(loginFailure(errorMessage));
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await authAPI.register(userData);
    dispatch(registerSuccess());
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch(registerFailure(errorMessage));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    await authAPI.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    dispatch(logoutSuccess());
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const errorMessage = error.response?.data?.message || 'Logout failed';
    dispatch(logoutFailure(errorMessage));
  }
};

export const setupBases = (baseData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const response = await authAPI.setupBases(baseData);
    dispatch(setupBasesSuccess());
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Setup failed';
    dispatch(setupBasesFailure(errorMessage));
  }
};

export const { 
  clearError, 
  setUser, 
  setLoading, 
  setError, 
  loginSuccess, 
  loginFailure, 
  registerSuccess, 
  registerFailure, 
  logoutSuccess, 
  logoutFailure, 
  setupBasesSuccess, 
  setupBasesFailure 
} = authSlice.actions;
export default authSlice.reducer;

