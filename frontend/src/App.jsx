import React from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar'
import Login from './components/Login';
import Signup from './components/Signup';
import EquipmentList from './components/EquipmentList';
import PurchaseList from './components/PurchaseList';
import AssignmentList from './components/AssignmentList';
import TransferList from './components/TransferList';
import Dashboard from './components/Dashboard'
import Balance from './components/Balance'
import {store} from './store/store'
import { Provider } from 'react-redux';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
function App() {


  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Navbar>
                    <Dashboard />
                  </Navbar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/equipments" 
              element={
                <ProtectedRoute>
                  <Navbar>
                    <EquipmentList />
                  </Navbar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/purchases" 
              element={
                <ProtectedRoute requiredRoles={['Admin', 'BaseCommander', 'LogisticsOfficer']}>
                  <Navbar>
                    <PurchaseList />
                  </Navbar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transfers" 
              element={
                <ProtectedRoute requiredRoles={['Admin', 'BaseCommander', 'LogisticsOfficer']}>
                  <Navbar>
                    <TransferList />
                  </Navbar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assignments" 
              element={
                <ProtectedRoute requiredRoles={['Admin', 'BaseCommander', 'LogisticsOfficer']}>
                  <Navbar>
                    <AssignmentList />
                  </Navbar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/balances" 
              element={
                <ProtectedRoute requiredRoles={['Admin', 'BaseCommander', 'LogisticsOfficer']}>
                  <Navbar>
                    <Balance />
                  </Navbar>
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App
