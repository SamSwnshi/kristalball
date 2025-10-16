import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchBalanceSummary, calculateBalances, setOpeningBalance, fetchDebugData } from '../store/slices/balanceSlice';
import { fetchBases } from '../store/slices/baseSlice';
import { fetchEquipment } from '../store/slices/equipmentSlice';
import { Calculator, DollarSign, TrendingUp, TrendingDown, BarChart3, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
// import { format } from 'date-fns';

const Balance = () => {
    const [showCalculateModal, setShowCalculateModal] = useState(false);
    const [showOpeningModal, setShowOpeningModal] = useState(false);
    const [showDebugModal, setShowDebugModal] = useState(false);

    const dispatch = useDispatch();
    const { balanceSummary, calculatedBalances, debugData, loading } = useSelector((state) => state.balance);
    const { bases } = useSelector((state) => state.base);
    const { equipment } = useSelector((state) => state.equipment || { equipment: [] });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        dispatch(fetchBalanceSummary());
        dispatch(fetchBases());
        dispatch(fetchEquipment());
    }, [dispatch]);

    // Error toasts handled in slice-level thunks

    const onSubmitCalculate = async (data) => {
        try {
            const result = await dispatch(calculateBalances(data));
            if (result?.success) {
                toast.success('Balances calculated successfully!');
                setShowCalculateModal(false);
                reset();
            } else {
                toast.error(result?.error || 'Failed to calculate balances');
            }
        } catch {
            toast.error('An unexpected error occurred');
        }
    };

    const onSubmitOpening = async (data) => {
        try {
            const result = await dispatch(setOpeningBalance(data));
            if (result?.success) {
                toast.success('Opening balance set successfully!');
                setShowOpeningModal(false);
                reset();
                dispatch(fetchBalanceSummary());
            } else {
                toast.error(result?.error || 'Failed to set opening balance');
            }
        } catch {
            toast.error('An unexpected error occurred');
        }
    };

    const handleDebugData = async () => {
        try {
            const result = await dispatch(fetchDebugData());
            if (result?.success) {
                setShowDebugModal(true);
            } else {
                toast.error(result?.error || 'Failed to fetch debug data');
            }
        } catch {
            toast.error('An unexpected error occurred');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-military-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Balance Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage financial balances and calculations
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <button
                        onClick={handleDebugData}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-military-500"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Debug Data
                    </button>
                    <button
                        onClick={() => setShowOpeningModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-military-500"
                    >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Set Opening Balance
                    </button>
                    <button
                        onClick={() => setShowCalculateModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-military-500"
                    >
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Balances
                    </button>
                </div>
            </div>

            {/* Balance Summary */}
            {balanceSummary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Opening Balance
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {formatCurrency(balanceSummary.summary?.totalOpeningBalance)}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingDown className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Closing Balance
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {formatCurrency(balanceSummary.summary?.totalClosingBalance)}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <BarChart3 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Net Movement
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {formatCurrency(balanceSummary.summary?.totalNetMovement)}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Calculated Balances */}
            {calculatedBalances && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Calculated Balances</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Assets</h4>
                            <div className="space-y-2">
                                {calculatedBalances.assets?.map((asset, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span className="text-sm text-gray-600">{asset.name}</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatCurrency(asset.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Liabilities</h4>
                            <div className="space-y-2">
                                {calculatedBalances.liabilities?.map((liability, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span className="text-sm text-gray-600">{liability.name}</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatCurrency(liability.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Calculate Balances Modal */}
            {showCalculateModal && (
                <div className="fixed inset-0 backdrop-blur bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Calculate Balances</h3>
                                <button
                                    onClick={() => setShowCalculateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmitCalculate)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Base</label>
                                    <select
                                        {...register('base_id', { required: 'Base is required' })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select base</option>
                                        {bases.map((base) => (
                                            <option key={base.id || base._id} value={base.id || base._id}>
                                                {base.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.base_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.base_id.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Equipment</label>
                                    <select
                                        {...register('equipment_id', { required: 'Equipment is required' })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select equipment</option>
                                        {equipment.map((eq) => (
                                            <option key={eq.id || eq._id} value={eq.id || eq._id}>
                                                {eq.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.equipment_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.equipment_id.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input
                                        {...register('start_date', { required: 'Start date is required' })}
                                        type="date"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    />
                                    {errors.start_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                                    <input
                                        {...register('end_date', { required: 'End date is required' })}
                                        type="date"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    />
                                    {errors.end_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCalculateModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Calculate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Set Opening Balance Modal */}
            {showOpeningModal && (
                <div className="fixed inset-0 backdrop-blur bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Set Opening Balance</h3>
                                <button
                                    onClick={() => setShowOpeningModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmitOpening)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Base</label>
                                    <select
                                        {...register('base_id', { required: 'Base is required' })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select base</option>
                                        {bases.map((base) => (
                                            <option key={base.id || base._id} value={base.id || base._id}>
                                                {base.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.base_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.base_id.message}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                                    <input
                                        {...register('opening_balance', {
                                            required: 'Amount is required',
                                            min: { value: 0, message: 'Amount must be positive' }
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                        placeholder="Enter opening balance amount"
                                    />
                                    {errors.opening_balance && (
                                        <p className="mt-1 text-sm text-red-600">{errors.opening_balance.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowOpeningModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Set Balance
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Debug Data Modal */}
            {showDebugModal && debugData && (
                <div className="fixed inset-0 backdrop-blur bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Debug Data</h3>
                                <button
                                    onClick={() => setShowDebugModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <pre className="text-sm text-gray-800 overflow-auto max-h-96">
                                    {JSON.stringify(debugData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Balance
