import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
    fetchEquipment,
    fetchEquipmentTypes,
    createEquipment,
    createEquipmentType,
    clearError,
} from "../store/slices/equipmentSlice";
import { Package, Plus, Search, Filter, X } from "lucide-react";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const EquipmentList = () => {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showTypeModal, setShowTypeModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('')

    const dispatch = useDispatch()
    const { equipment, equipmentTypes, loading, error } = useSelector(
        (state) => state.equipment
    )
    const {
        register: registerEquipment,
        handleSubmit: handleSubmitEquipment,
        reset: resetEquipment,
        formState: { errors: equipmentErrors }
    } = useForm()

    const {
        register: registerType,
        handleSubmit: handleSubmitType,
        reset: resetType,
        formState: { errors: typeErrors },
    } = useForm();

    useEffect(() => {
        dispatch(fetchEquipment());
        dispatch(fetchEquipmentTypes());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
              toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);
    const onSubmitEquipment = async (data) => {
        try {
            const result = await dispatch(createEquipment(data));
            if (result?.success) {
                toast.success("Equipment created successfully!");
                setShowCreateModal(false);
                resetEquipment();
                dispatch(fetchEquipment());
            } else {
                toast.error(result?.error || "Failed to create equipment");
            }
        } catch (error) {
              toast.error("An unexpected error occurred");
        }
    };

    const onSubmitType = async (data) => {
        try {
            const result = await dispatch(createEquipmentType(data));
            if (result?.success) {
                toast.success("Equipment type created successfully!");
                setShowTypeModal(false);
                resetType();
                dispatch(fetchEquipmentTypes());
            } else {
                toast.error(result?.error || "Failed to create equipment type");
            }
        } catch (error) {
              toast.error("An unexpected error occurred");
        }
    };
    const filteredEquipment = equipment.filter((item) => {
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFilter = !filterType || item.type === filterType;
        return matchesSearch && matchesFilter;
    });

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
                    <Link to="/">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Equipment Management
                        </h1>
                    
                    <p className="mt-1 text-sm text-gray-500">
                        Manage military equipment and equipment types
                    </p>
                    </Link>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <button
                        onClick={() => setShowTypeModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Type
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Equipment
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Search Equipment
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
                                placeholder="Search by name..."
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="filter"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Filter by Type
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="filter"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-military-500 focus:border-military-500 sm:text-sm"
                            >
                                <option value="">All Types</option>
                                {equipmentTypes.map((type) => (
                                    <option key={type._id} value={type._id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Equipment List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredEquipment.length === 0 ? (
                        <li className="px-6 py-4 text-center text-gray-500">
                            {searchTerm || filterType
                                ? "No equipment found matching your criteria."
                                : "No equipment available."}
                        </li>
                    ) : (
                        filteredEquipment.map((item) => (
                            <li key={item._id} className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Package className="h-8 w-8 text-military-600" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Type:{" "}
                                                {equipmentTypes.find((type) => type._id === item.type)
                                                    ?.name || "Unknown"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-military-100 text-military-800">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Create Equipment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 backdrop-blur bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Create Equipment
                                </h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form
                                onSubmit={handleSubmitEquipment(onSubmitEquipment)}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        {...registerEquipment("name", {
                                            required: "Name is required",
                                        })}
                                        type="text"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                        placeholder="Equipment name"
                                    />
                                    {equipmentErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {equipmentErrors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Type
                                    </label>
                                    <select
                                        {...registerEquipment("type", {
                                            required: "Type is required",
                                        })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                    >
                                        <option value="">Select a type</option>
                                        {equipmentTypes.map((type) => (
                                            <option key={type._id} value={type._id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                    {equipmentErrors.type && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {equipmentErrors.type.message}
                                        </p>
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
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-military-600 hover:bg-military-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-military-500"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Equipment Type Modal */}
            {showTypeModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Create Equipment Type
                                </h3>
                                <button
                                    onClick={() => setShowTypeModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form
                                onSubmit={handleSubmitType(onSubmitType)}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        {...registerType("name", { required: "Name is required" })}
                                        type="text"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-500 focus:border-military-500 sm:text-sm"
                                        placeholder="Equipment type name"
                                    />
                                    {typeErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {typeErrors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowTypeModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-military-600 hover:bg-military-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-military-500"
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
    )
}

export default EquipmentList
