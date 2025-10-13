import axios from "axios";

const API_VIT_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_VIT_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credential) => api.post("/auth/login", credential),
    register: (userData) => api.post("/auth/register", userData),
    logout: () => api.post("/auth/logout"),
    setupBases: (baseData) => api.post("/auth/setup-bases", baseData),
};

export const baseApi = {
    getBases: () => api.get("/public/bases"),
    getRoles: () => api.get("/public/roles"),
    getEquipment: () => api.get("/equipment"),
    getEquipmentTypes: () => api.get("/equipment-types"),
    createBase: (baseData) => api.post("/bases", baseData),
    createRole: (roleData) => api.post("/roles", roleData),
    createEquipment: (equipmentData) => api.post("/equipment", equipmentData),
    createEquipmentType: (typeData) => api.post("/equipment-types", typeData),
};

export const purchaseApi = {
    getPurchases: (params) => api.get("/purchases", { params }),
    createPurchase: (purchaseData) => api.post("/purchases/create", purchaseData),
};

export const transferAPI = {
  getTransfers: (params) => api.get('/transfers/get', { params }),
  createTransfer: (transferData) => api.post('/transfers', transferData),
};

export const assignmentAPI = {
  getAssignments: (params) => api.get('/assignments', { params }),
  createAssignment: (assignmentData) => api.post('/assignments/assign', assignmentData),
  createExpenditure: (expenditureData) => api.post('/assignments/expend', expenditureData),
};

export const dashboardAPI = {
  getMetrics: () => api.get('/dashboard'),
  getDetailedMovement: (params) => api.get('/dashboard/detailed-movement', { params }),
};

export const balanceAPI = {
  getBalanceSummary: () => api.get('/balances/summary'),
  calculateBalances: (balanceData) => api.post('/balances/calculate', balanceData),
  setOpeningBalance: (balanceData) => api.post('/balances/opening-balance', balanceData),
  debugData: () => api.get('/balances/debug'),
};

export default api;