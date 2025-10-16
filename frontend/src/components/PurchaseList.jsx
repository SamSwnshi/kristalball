import React,{ useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchPurchases, createPurchase, clearError } from '../store/slices/purchaseSlice';
import { fetchEquipment } from '../store/slices/equipmentSlice';
import { fetchBases } from '../store/slices/baseSlice';
import { ShoppingCart, Plus, Search, Filter, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const PurchaseList = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBase, setFilterBase] = useState('');
    const [filterEquipment, setFilterEquipment] = useState('');

    const dispatch = useDispatch();
    const { purchases, loading, error } = useSelector((state) => state.purchase);
    const { equipment } = useSelector((state) => state.equipment);
    const { bases } = useSelector((state) => state.base);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        dispatch(fetchPurchases());
        dispatch(fetchEquipment());
        dispatch(fetchBases());
    }, [dispatch]);

    useEffect(() => {
        if (purchases && purchases.length >= 0) {
            console.log('🧾 Purchases list updated:', purchases);
        }
    }, [purchases]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const onSubmit = async (data) => {
        try {
            // Normalize to IDs in case selects provided names
            const isObjectId = (v) => typeof v === 'string' && /^[a-f\d]{24}$/i.test(v);
            const baseId = isObjectId(data.base)
                ? data.base
                : (bases.find(b => (b.id || b._id) === data.base || b.name === data.base)?.id || bases.find(b => b.name === data.base)?._id || data.base);
            const equipmentId = isObjectId(data.equipment)
                ? data.equipment
                : (equipment.find(e => (e.id || e._id) === data.equipment || e.name === data.equipment)?.id || equipment.find(e => e.name === data.equipment)?._id || data.equipment);

            // Map form fields to backend API contract
            const payload = {
                base_id: baseId,
                equipment_id: equipmentId,
                quantity: Number(data.quantity),
                price: Number(data.price),
                purchased_at: new Date().toISOString(),
            };
            console.log('Creating purchase payload', payload);
            const result = await dispatch(createPurchase(payload));
            if (result?.success) {
                toast.success('Purchase created successfully!');
                setShowCreateModal(false);
                reset();
                // Refresh list to show latest server state (with populated fields)
                dispatch(fetchPurchases());
                console.log('✅ Created purchase:', result.data);
            } else {
                toast.error(result?.error || 'Failed to create purchase');
            }
        } catch {
            toast.error('An unexpected error occurred');
        }
    };

    const filteredPurchases = purchases.filter(purchase => {
        const equipmentName = (purchase.equipment_name || purchase.equipment?.name || '').toLowerCase();
        const matchesSearch = equipmentName.includes(searchTerm.toLowerCase());
        const matchesBase = !filterBase || purchase.base_id === filterBase || purchase.base === filterBase;
        const matchesEquipment = !filterEquipment || purchase.equipment_id === filterEquipment || purchase.equipment === filterEquipment;
        return matchesSearch && matchesBase && matchesEquipment;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    const formatDate = (value) => {
        if (!value) return '-';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '-';
        return format(d, 'MMM dd, yyyy');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-military-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 space-x-6 px-4 py-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link to='/' >
                    
                    <h1 className="text-2xl font-bold text-gray-900">Purchase Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Track and manage equipment purchases
                    </p>
                    </Link>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Purchase
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                            Search Purchases
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                placeholder="Search by equipment..."
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="baseFilter" className="block text-sm font-medium text-gray-700">
                            Filter by Base
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="baseFilter"
                                value={filterBase}
                                onChange={(e) => setFilterBase(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-military-500 focus:border-military-500 sm:text-sm"
                            >
                                <option value="">All Bases</option>
                                {bases.map((base) => (
                                    <option key={base.id || base._id} value={base.id || base._id}>
                                        {base.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="equipmentFilter" className="block text-sm font-medium text-gray-700">
                            Filter by Equipment
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="equipmentFilter"
                                value={filterEquipment}
                                onChange={(e) => setFilterEquipment(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-military-500 focus:border-military-500 sm:text-sm"
                            >
                                <option value="">All Equipment</option>
                                {equipment.map((item) => (
                                    <option key={item.id || item._id} value={item.id || item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchases List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredPurchases.length === 0 ? (
                        <li className="px-6 py-4 text-center text-gray-500">
                            {searchTerm || filterBase || filterEquipment ? 'No purchases found matching your criteria.' : 'No purchases available.'}
                        </li>
                    ) : (
                        filteredPurchases.map((purchase) => (
                            <li key={purchase.id || purchase._id} className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <ShoppingCart className="h-8 w-8 text-green-600" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {purchase.equipment_name || purchase.equipment?.name || 'Unknown Equipment'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Base: {purchase.base_name || bases.find(base => (base._id === purchase.base || base._id === purchase.base_id))?.name || 'Unknown'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Quantity: {purchase.quantity} | Price: {formatCurrency(purchase.price || 0)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency((purchase.quantity || 0) * (purchase.price || 0))}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(purchase.purchased_at || purchase.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Create Purchase Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 backdrop-blur  bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Create Purchase</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Equipment</label>
                                    <select
                                        {...register('equipment', { required: 'Equipment is required' })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select equipment</option>
                                        {equipment.map((item) => (
                                            <option key={item.id || item._id} value={item.id || item._id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.equipment && (
                                        <p className="mt-1 text-sm text-red-600">{errors.equipment.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Base</label>
                                    <select
                                        {...register('base', { required: 'Base is required' })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select base</option>
                                        {bases.map((base) => (
                                            <option key={base.id || base._id} value={base.id || base._id}>
                                                {base.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.base && (
                                        <p className="mt-1 text-sm text-red-600">{errors.base.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        {...register('quantity', {
                                            required: 'Quantity is required',
                                            min: { value: 1, message: 'Quantity must be at least 1' }
                                        })}
                                        type="number"
                                        min="1"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                        placeholder="Enter quantity"
                                    />
                                    {errors.quantity && (
                                        <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price per Unit</label>
                                    <input
                                        {...register('price', {
                                            required: 'Price is required',
                                            min: { value: 0, message: 'Price must be positive' }
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                        placeholder="Enter price per unit"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-military-600 hover:bg-military-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-military-500"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseList;
