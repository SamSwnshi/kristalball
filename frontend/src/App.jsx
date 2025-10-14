import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Signup from './components/Signup';
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
    <Router>
      
        <div className='tracking-wide'>
      <Routes>

        <Route path='/' element={<Navbar/>}/>
        <Route path='/login' element={<Login/>}/>
       
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
        </div>
    </Router>
  )
}

export default App
