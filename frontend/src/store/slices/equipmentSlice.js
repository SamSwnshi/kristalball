import { createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../service/api";

const initialState = {
    equipment: [],
    equipmentTypes: [],
    loading: false,
    error: null,
};

const equipmentSlice = createSlice({
    name: 'equipment',
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
        fetchEquipmentSuccess: (state, action) => {
            state.loading = false;
            state.equipment = action.payload;
            state.error = null;
        },
        fetchEquipmentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchEquipmentTypesSuccess: (state, action) => {
            state.loading = false;
            state.equipmentTypes = action.payload;
            state.error = null;
        },
        fetchEquipmentTypesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createEquipmentSuccess: (state, action) => {
            state.loading = false;
            state.equipment.push(action.payload);
            state.error = null;
        },
        createEquipmentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createEquipmentTypeSuccess: (state, action) => {
            state.loading = false;
            state.equipmentTypes.push(action.payload);
            state.error = null;
        },
        createEquipmentTypeFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});


export const fetchEquipment = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await baseApi.getEquipment();
        dispatch(fetchEquipmentSuccess(response.data));
    return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch equipment';
        dispatch(fetchEquipmentFailure(errorMessage));
    return { success: false, error: errorMessage };
    }
};

export const fetchEquipmentTypes = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await baseApi.getEquipmentTypes();
        dispatch(fetchEquipmentTypesSuccess(response.data));
    return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch equipment types';
        dispatch(fetchEquipmentTypesFailure(errorMessage));
    return { success: false, error: errorMessage };
    }
};

export const createEquipment = (equipmentData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await baseApi.createEquipment(equipmentData);
        dispatch(createEquipmentSuccess(response.data));
    return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to create equipment';
        dispatch(createEquipmentFailure(errorMessage));
    return { success: false, error: errorMessage };
    }
};

export const createEquipmentType = (typeData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await baseApi.createEquipmentType(typeData);
        dispatch(createEquipmentTypeSuccess(response.data));
    return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to create equipment type';
        dispatch(createEquipmentTypeFailure(errorMessage));
    return { success: false, error: errorMessage };
    }
};

export const {
    clearError,
    setLoading,
    setError,
    fetchEquipmentSuccess,
    fetchEquipmentFailure,
    fetchEquipmentTypesSuccess,
    fetchEquipmentTypesFailure,
    createEquipmentSuccess,
    createEquipmentFailure,
    createEquipmentTypeSuccess,
    createEquipmentTypeFailure
} = equipmentSlice.actions;
export default equipmentSlice.reducer;
