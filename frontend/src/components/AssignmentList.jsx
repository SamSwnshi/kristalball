import React,{ useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchAssignments, createAssignment, createExpenditure, clearError } from '../store/slices/assignmentSlice';
import { fetchEquipment } from '../store/slices/equipmentSlice';
import { fetchBases } from '../store/slices/baseSlice';
import { ClipboardList, Plus, Search, Filter, X, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const AssignmentList = () => {
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showExpenditureModal, setShowExpenditureModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBase, setFilterBase] = useState('');
    const [activeTab, setActiveTab] = useState('assignments');

    const dispatch = useDispatch();
    const { assignments, expenditures, loading, error } = useSelector((state) => state.assignment);
    const { equipment } = useSelector((state) => state.equipment);
    const { bases } = useSelector((state) => state.base);

    const {
        register: registerAssignment,
        handleSubmit: handleSubmitAssignment,
        reset: resetAssignment,
        formState: { errors: assignmentErrors },
    } = useForm();

    const {
        register: registerExpenditure,
        handleSubmit: handleSubmitExpenditure,
        reset: resetExpenditure,
        formState: { errors: expenditureErrors },
    } = useForm();

    useEffect(() => {
        dispatch(fetchAssignments());
        dispatch(fetchEquipment());
        dispatch(fetchBases());
    }, [dispatch]);

    useEffect(() => {
        console.log('📋 Assignments updated:', assignments);
        console.log('💸 Expenditures updated:', expenditures);
    }, [assignments, expenditures]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const onSubmitAssignment = async (data) => {
        try {
            const isObjectId = (v) => typeof v === 'string' && /^[a-f\d]{24}$/i.test(v);
            const baseId = isObjectId(data.base) ? data.base : (bases.find(b => (b.id || b._id) === data.base || b.name === data.base)?.id || bases.find(b => b.name === data.base)?._id || data.base);
            const equipmentId = isObjectId(data.equipment) ? data.equipment : (equipment.find(e => (e.id || e._id) === data.equipment || e.name === data.equipment)?.id || equipment.find(e => e.name === data.equipment)?._id || data.equipment);
            const payload = {
                base_id: baseId,
                equipment_id: equipmentId,
                assigned_to: data.assigned_to || 'Unknown',
                quantity: Number(data.quantity),
                assigned_at: new Date().toISOString(),
            };
            console.log('Creating assignment payload', payload);
            const result = await dispatch(createAssignment(payload));
            if (result?.success) {
                toast.success('Assignment created successfully!');
                setShowAssignmentModal(false);
                resetAssignment();
                dispatch(fetchAssignments());
                console.log('✅ Created assignment:', result.data);
            } else {
                toast.error(result?.error || 'Failed to create assignment');
            }
        } catch {
            toast.error('An unexpected error occurred');
        }
    };

    const onSubmitExpenditure = async (data) => {
        try {
            const isObjectId = (v) => typeof v === 'string' && /^[a-f\d]{24}$/i.test(v);
            const baseId = isObjectId(data.base) ? data.base : (bases.find(b => (b.id || b._id) === data.base || b.name === data.base)?.id || bases.find(b => b.name === data.base)?._id || data.base);
            const equipmentId = isObjectId(data.equipment) ? data.equipment : (equipment.find(e => (e.id || e._id) === data.equipment || e.name === data.equipment)?.id || equipment.find(e => e.name === data.equipment)?._id || data.equipment);
            const payload = {
                base_id: baseId,
                equipment_id: equipmentId,
                quantity: Number(data.quantity),
                expended_at: new Date().toISOString(),
            };
            console.log('Creating expenditure payload', payload);
            const result = await dispatch(createExpenditure(payload));
            if (result?.success) {
                toast.success('Expenditure recorded successfully!');
                setShowExpenditureModal(false);
                resetExpenditure();
                dispatch(fetchAssignments());
                console.log('✅ Created expenditure:', result.data);
            } else {
                toast.error(result?.error || 'Failed to create expenditure');
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

    const filteredAssignments = assignments.filter(assignment => {
        const equipmentName = (assignment.equipment_name || assignment.equipment?.name || '').toLowerCase();
        const matchesSearch = equipmentName.includes(searchTerm.toLowerCase());
        const matchesBase = !filterBase || assignment.base_id === filterBase || assignment.base === filterBase;
        return matchesSearch && matchesBase;
    });

    const filteredExpenditures = expenditures.filter(expenditure => {
        const equipmentName = (expenditure.equipment_name || expenditure.equipment?.name || '').toLowerCase();
        const matchesSearch = equipmentName.includes(searchTerm.toLowerCase());
        const matchesBase = !filterBase || expenditure.base_id === filterBase || expenditure.base === filterBase;
        return matchesSearch && matchesBase;
    });

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-x-6">
                <div>
                    <Link to='/'>
                    
                    <h1 className="text-2xl font-bold text-gray-900">Assignment & Expenditure Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Track equipment assignments and expenditures
                    </p>
                    </Link>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <button
                        onClick={() => setShowExpenditureModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Record Expenditure
                    </button>
                    <button
                        onClick={() => setShowAssignmentModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Assignment
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className={`${activeTab === 'assignments'
                                ? 'border-military-500 text-military-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    >
                        Assignments ({assignments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('expenditures')}
                        className={`${activeTab === 'expenditures'
                                ? 'border-military-500 text-military-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    >
                        Expenditures ({expenditures.length})
                    </button>
                </nav>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                            Search
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
                                    <option key={base._id} value={base._id}>
                                        {base.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignments List */}
            {activeTab === 'assignments' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {filteredAssignments.length === 0 ? (
                            <li className="px-6 py-4 text-center text-gray-500">
                                {searchTerm || filterBase ? 'No assignments found matching your criteria.' : 'No assignments available.'}
                            </li>
                        ) : (
                            filteredAssignments.map((assignment) => (
                                <li key={assignment.id || assignment._id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <ClipboardList className="h-8 w-8 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {assignment.equipment_name || assignment.equipment?.name || 'Unknown Equipment'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Base: {assignment.base_name || bases.find(base => (base._id === assignment.base || base._id === assignment.base_id))?.name || 'Unknown'}
                                                </div>
                                                <div className="text-sm text-gray-500">Assigned to: {assignment.assigned_to || assignment.assignedTo || 'Unknown'}</div>
                                                <div className="text-sm text-gray-500">Quantity: {assignment.quantity}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {formatDate(assignment.assigned_at || assignment.createdAt)}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const baseValue = assignment.base_id || (assignment.base && assignment.base._id) || assignment.base;
                                                    const equipmentValue = assignment.equipment_id || (assignment.equipment && assignment.equipment._id) || assignment.equipment;
                                                    resetExpenditure({
                                                        base: baseValue || '',
                                                        equipment: equipmentValue || '',
                                                        quantity: 1,
                                                    });
                                                    setShowExpenditureModal(true);
                                                }}
                                                className="ml-3 inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
                                            >
                                                Expend
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            {/* Expenditures List */}
            {activeTab === 'expenditures' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {filteredExpenditures.length === 0 ? (
                            <li className="px-6 py-4 text-center text-gray-500">
                                {searchTerm || filterBase ? 'No expenditures found matching your criteria.' : 'No expenditures available.'}
                            </li>
                        ) : (
                            filteredExpenditures.map((expenditure) => (
                                <li key={expenditure.id || expenditure._id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <DollarSign className="h-8 w-8 text-red-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {expenditure.equipment_name || expenditure.equipment?.name || 'Unknown Equipment'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Base: {expenditure.base_name || bases.find(base => (base._id === expenditure.base || base._id === expenditure.base_id))?.name || 'Unknown'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Quantity: {expenditure.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency((expenditure.quantity || 0) * (expenditure.amount || 0))}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {formatDate(expenditure.expended_at || expenditure.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            {/* Create Assignment Modal */}
            {showAssignmentModal && (
                <div className="fixed inset-0 backdrop-blur bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Create Assignment</h3>
                                <button
                                    onClick={() => setShowAssignmentModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitAssignment(onSubmitAssignment)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Equipment</label>
                                    <select
                                        {...registerAssignment('equipment', { required: 'Equipment is required' })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select equipment</option>
                                        {equipment.map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {assignmentErrors.equipment && (
                                        <p className="mt-1 text-sm text-red-600">{assignmentErrors.equipment.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Base</label>
                                    <select
                                        {...registerAssignment('base', { required: 'Base is required' })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select base</option>
                                        {bases.map((base) => (
                                            <option key={base._id} value={base._id}>
                                                {base.name}
                                            </option>
                                        ))}
                                    </select>
                                    {assignmentErrors.base && (
                                        <p className="mt-1 text-sm text-red-600">{assignmentErrors.base.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                                    <input
                                        {...registerAssignment('assigned_to', { required: 'Assignee is required' })}
                                        type="text"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                        placeholder="Enter person/unit/department"
                                    />
                                    {assignmentErrors.assigned_to && (
                                        <p className="mt-1 text-sm text-red-600">{assignmentErrors.assigned_to.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        {...registerAssignment('quantity', {
                                            required: 'Quantity is required',
                                            min: { value: 1, message: 'Quantity must be at least 1' }
                                        })}
                                        type="number"
                                        min="1"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                        placeholder="Enter quantity"
                                    />
                                    {assignmentErrors.quantity && (
                                        <p className="mt-1 text-sm text-red-600">{assignmentErrors.quantity.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAssignmentModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Expenditure Modal */}
            {showExpenditureModal && (
                <div className="fixed inset-0 backdrop-blur bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Record Expenditure</h3>
                                <button
                                    onClick={() => setShowExpenditureModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitExpenditure(onSubmitExpenditure)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Equipment</label>
                                    <select
                                        {...registerExpenditure('equipment', { required: 'Equipment is required' })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select equipment</option>
                                        {equipment.map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {expenditureErrors.equipment && (
                                        <p className="mt-1 text-sm text-red-600">{expenditureErrors.equipment.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Base</label>
                                    <select
                                        {...registerExpenditure('base', { required: 'Base is required' })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select base</option>
                                        {bases.map((base) => (
                                            <option key={base._id} value={base._id}>
                                                {base.name}
                                            </option>
                                        ))}
                                    </select>
                                    {expenditureErrors.base && (
                                        <p className="mt-1 text-sm text-red-600">{expenditureErrors.base.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        {...registerExpenditure('quantity', {
                                            required: 'Quantity is required',
                                            min: { value: 1, message: 'Quantity must be at least 1' }
                                        })}
                                        type="number"
                                        min="1"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                        placeholder="Enter quantity"
                                    />
                                    {expenditureErrors.quantity && (
                                        <p className="mt-1 text-sm text-red-600">{expenditureErrors.quantity.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowExpenditureModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Record
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

export default AssignmentList;
