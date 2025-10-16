import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchTransfers, createTransfer, clearError } from '../store/slices/transferSlice';
import { fetchEquipment } from '../store/slices/equipmentSlice';
import { fetchBases } from '../store/slices/baseSlice';
import { ArrowRightLeft, Plus, Search, Filter, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const TransferList = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFromBase, setFilterFromBase] = useState('');
  const [filterToBase, setFilterToBase] = useState('');
  
  const dispatch = useDispatch();
  const { transfers, loading, error } = useSelector((state) => state.transfer);
  const { equipment } = useSelector((state) => state.equipment);
  const { bases } = useSelector((state) => state.base);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchTransfers());
    dispatch(fetchEquipment());
    dispatch(fetchBases());
  }, [dispatch]);

  useEffect(() => {
    if (transfers && transfers.length >= 0) {
      console.log('🔁 Transfers list updated:', transfers);
    }
  }, [transfers]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    try {
      // Normalize IDs from selects or names
      const isObjectId = (v) => typeof v === 'string' && /^[a-f\d]{24}$/i.test(v);
      const fromBaseId = isObjectId(data.fromBase)
        ? data.fromBase
        : (bases.find(b => (b.id || b._id) === data.fromBase || b.name === data.fromBase)?.id || bases.find(b => b.name === data.fromBase)?._id || data.fromBase);
      const toBaseId = isObjectId(data.toBase)
        ? data.toBase
        : (bases.find(b => (b.id || b._id) === data.toBase || b.name === data.toBase)?.id || bases.find(b => b.name === data.toBase)?._id || data.toBase);
      const equipmentId = isObjectId(data.equipment)
        ? data.equipment
        : (equipment.find(e => (e.id || e._id) === data.equipment || e.name === data.equipment)?.id || equipment.find(e => e.name === data.equipment)?._id || data.equipment);

      const payload = {
        from_base_id: fromBaseId,
        to_base_id: toBaseId,
        equipment_id: equipmentId,
        quantity: Number(data.quantity),
        transferred_at: new Date().toISOString(),
      };
      console.log('Creating transfer payload', payload);

      const result = await dispatch(createTransfer(payload));
      if (result?.success) {
        toast.success('Transfer created successfully!');
        setShowCreateModal(false);
        reset();
        dispatch(fetchTransfers());
        console.log('✅ Created transfer:', result.data);
      } else {
        toast.error(result?.error || 'Failed to create transfer');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const equipmentName = (transfer.equipment_name || transfer.equipment?.name || '').toLowerCase();
    const matchesSearch = equipmentName.includes(searchTerm.toLowerCase());
    const matchesFromBase = !filterFromBase || transfer.from_base_id === filterFromBase || transfer.fromBase === filterFromBase;
    const matchesToBase = !filterToBase || transfer.to_base_id === filterToBase || transfer.toBase === filterToBase;
    return matchesSearch && matchesFromBase && matchesToBase;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
            <Link to='/'>
          <h1 className="text-2xl font-bold text-gray-900">Transfer Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage equipment transfers between bases
          </p>
          </Link>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Transfer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Transfers
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
            <label htmlFor="fromBaseFilter" className="block text-sm font-medium text-gray-700">
              Filter by From Base
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="fromBaseFilter"
                value={filterFromBase}
                onChange={(e) => setFilterFromBase(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-military-500 focus:border-military-500 sm:text-sm"
              >
                <option value="">All From Bases</option>
                {bases.map((base) => (
                  <option key={base._id} value={base._id}>
                    {base.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="toBaseFilter" className="block text-sm font-medium text-gray-700">
              Filter by To Base
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="toBaseFilter"
                value={filterToBase}
                onChange={(e) => setFilterToBase(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-military-500 focus:border-military-500 sm:text-sm"
              >
                <option value="">All To Bases</option>
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

      {/* Transfers List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTransfers.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              {searchTerm || filterFromBase || filterToBase ? 'No transfers found matching your criteria.' : 'No transfers available.'}
            </li>
          ) : (
            filteredTransfers.map((transfer) => (
              <li key={transfer.id || transfer._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ArrowRightLeft className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transfer.equipment_name || transfer.equipment?.name || 'Unknown Equipment'}
                      </div>
                      <div className="text-sm text-gray-500">
                        From: {transfer.from_base_name || bases.find(base => (base._id === transfer.fromBase || base._id === transfer.from_base_id))?.name || 'Unknown'} → 
                        To: {transfer.to_base_name || bases.find(base => (base._id === transfer.toBase || base._id === transfer.to_base_id))?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Quantity: {transfer.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(transfer.transferred_at || transfer.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Create Transfer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Transfer</h3>
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
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {errors.equipment && (
                    <p className="mt-1 text-sm text-red-600">{errors.equipment.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">From Base</label>
                  <select
                    {...register('fromBase', { required: 'From base is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                  >
                    <option value="">Select from base</option>
                    {bases.map((base) => (
                      <option key={base._id} value={base._id}>
                        {base.name}
                      </option>
                    ))}
                  </select>
                  {errors.fromBase && (
                    <p className="mt-1 text-sm text-red-600">{errors.fromBase.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">To Base</label>
                  <select
                    {...register('toBase', { required: 'To base is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                  >
                    <option value="">Select to base</option>
                    {bases.map((base) => (
                      <option key={base._id} value={base._id}>
                        {base.name}
                      </option>
                    ))}
                  </select>
                  {errors.toBase && (
                    <p className="mt-1 text-sm text-red-600">{errors.toBase.message}</p>
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
    </div>
  );
};

export default TransferList;
