import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem('token'))

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token')
            const storedUser = localStorage.getItem('user')

            if (storedToken && storedUser) {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            }
            setLoading(false)
        }

        initAuth()
    }, [])

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials)
            const { token: newToken, user: userData } = response.data

            localStorage.setItem('token', newToken)
            localStorage.setItem('user', JSON.stringify(userData))

            setToken(newToken)
            setUser(userData)

            toast.success('Login successful!')
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed'
            toast.error(message)
            return { success: false, error: message }
        }
    }

    const signup = async (userData) => {
        try {
            const response = await authAPI.signup(userData)
            const { token: newToken, user: newUser } = response.data

            localStorage.setItem('token', newToken)
            localStorage.setItem('user', JSON.stringify(newUser))

            setToken(newToken)
            setUser(newUser)

            toast.success('Account created successfully!')
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.error || 'Signup failed'
            toast.error(message)
            return { success: false, error: message }
        }
    }

    const logout = async () => {
        try {
            await authAPI.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setToken(null)
            setUser(null)
            toast.success('Logged out successfully!')
        }
    }

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token && !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

