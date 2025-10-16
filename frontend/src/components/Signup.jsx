import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser, clearError } from '../store/slices/authSlice';
import { fetchBases, fetchRoles } from '../store/slices/baseSlice';
import { Package, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const { bases, roles } = useSelector((state) => state.base);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');
    const selectedRole = watch('role');

    useEffect(() => {
        dispatch(fetchBases());
        dispatch(fetchRoles());
    }, [dispatch]);

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(registerUser(data));
            if (result?.success) {
                toast.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                toast.error(result?.error || 'Registration failed');
            }
        } catch {
            toast.error('An unexpected error occurred');
        }
    };

    const clearErrorMessage = () => {
        dispatch(clearError());
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-2 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-md w-full space-y-4 border-gray-400 border-2 p-5 rounded-2xl shadow-2xl">
                <div>
                    <div className="flex justify-center">
                        <div className="h-12 w-12 bg-military-600 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 " />
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Military Equipment Management System
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Username must be at least 3 characters'
                                    }
                                })}
                                type="text"
                                autoComplete="username"
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                placeholder="Enter username"
                                onChange={clearErrorMessage}
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    placeholder="Enter password"
                                    onChange={clearErrorMessage}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                                type="password"
                                autoComplete="new-password"
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                placeholder="Confirm password"
                                onChange={clearErrorMessage}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                {...register('role', { required: 'Role is required' })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                onChange={clearErrorMessage}
                            >
                                <option value="">Select a role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="baseId" className="block text-sm font-medium text-gray-700">
                                Base (Required for non-admin roles)
                            </label>
                            <select
                                {...register('baseId', {
                                    required: selectedRole !== 'Admin' ? 'Base is required for non-admin roles' : false
                                })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                onChange={clearErrorMessage}
                            >
                                <option value="">Select a base</option>
                                {bases.map((base) => (
                                    <option key={base.id} value={base.id}>
                                        {base.name}
                                    </option>
                                ))}
                            </select>
                            {errors.baseId && (
                                <p className="mt-1 text-sm text-red-600">{errors.baseId.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Backend error block removed; toast will show errors */}

                    <div className='border-2 rounded-md border-gray-300'>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-500 bg-military-600 hover:bg-military-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-military-500 "
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900">
                                        <div className="rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    </div>
                                    Creating account...
                                </div>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-military-600 hover:text-military-500"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;