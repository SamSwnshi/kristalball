import React,{ useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetrics, fetchDetailedMovement } from '../store/slices/dashboardSlice';
import { fetchBalanceSummary } from '../store/slices/balanceSlice';
import { fetchEquipment} from '../store/slices/equipmentSlice'
import {fetchTransfers} from '../store/slices/transferSlice'
import { 
  Package, 
  ShoppingCart, 
  ArrowRightLeft, 
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { metrics, detailedMovement, loading } = useSelector((state) => state.dashboard);
  const { balanceSummary } = useSelector((state) => state.balance);
  const { equipment, equipmentTypes } = useSelector((state) => state.equipment || { equipment: [], equipmentTypes: [] });

  useEffect(() => {
    dispatch(fetchMetrics());
    dispatch(fetchDetailedMovement());
    dispatch(fetchBalanceSummary());
    dispatch(fetchEquipment())
    const action = dispatch(fetchTransfers())
    console.log('fetchTransfers dispatched', action)
  }, [dispatch]);

  useEffect(() => {

    console.log('Dashboard data', { metrics, detailedMovement, balanceSummary, loading, equipment, equipmentTypes });
    console.log('Metrics summary', metrics?.summary ?? metrics?.metrics?.summary ?? metrics?.metrics?.balanceSummary);
  }, [metrics, detailedMovement, balanceSummary, loading, equipment, equipmentTypes]);
  const { transfers } = useSelector((state) => state.transfer || { transfers: [] });
  useEffect(() => {
    console.log('Transfers updated', transfers);
  }, [transfers]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Derive totals with fallbacks based on available data
  const totalEquipment = metrics?.metrics?.equipment ?? metrics?.totalEquipment ?? equipment?.length ?? 0;
  const totalPurchases = metrics?.metrics?.purchases ?? metrics?.totalPurchases ?? detailedMovement?.purchases?.length ?? 0;
  const totalOpeningBalance = (
    metrics?.metrics?.balanceSummary?.totalOpeningBalance ??
    balanceSummary?.summary?.totalOpeningBalance ??
    balanceSummary?.totalOpeningBalance ??
    0
  );

  const equipmentByTypeData = (() => {
    const provided = metrics?.equipmentByType;
    if (Array.isArray(provided) && provided.length > 0) return provided;
    if (Array.isArray(equipment) && equipment.length > 0) {
      const countsByTypeName = equipment.reduce((acc, item) => {
        const key = item?.type_name || 'Unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(countsByTypeName).map(([name, count]) => ({ name, count }));
    }
    return [];
  })();

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your military equipment management system
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-military-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Equipment
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatNumber(totalEquipment)}
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
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Purchases
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatNumber(totalPurchases)}
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
                <ArrowRightLeft className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Transfers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatNumber(transfers?.length)}
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
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Opening Balance
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalOpeningBalance)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Movement Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Movement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Purchases', value: detailedMovement?.purchases?.length || 0 },
                { name: 'Transfers In', value: detailedMovement?.transfersIn?.length || 0 },
                { name: 'Transfers Out', value: detailedMovement?.transfersOut?.length || 0 },
                { name: 'Assignments', value: detailedMovement?.assignments?.length || 0 },
                { name: 'Expenditures', value: detailedMovement?.expenditures?.length || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} tick={{ angle: -5, textAnchor: 'end' }} minTickGap={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment by Type */}
        {(equipmentByTypeData.length > 0) && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment by Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={equipmentByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {equipmentByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Balance Summary */}
      {/* {balanceSummary && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Balance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(balanceSummary.totalAssets)}
              </div>
              <div className="text-sm text-gray-500">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(balanceSummary.totalLiabilities)}
              </div>
              <div className="text-sm text-gray-500">Total Liabilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(balanceSummary.netWorth)}
              </div>
              <div className="text-sm text-gray-500">Net Worth</div>
            </div>
          </div>
        </div>
      )} */}

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {(() => {
              // Combine all activities and sort by date
              const allActivities = [
                ...(detailedMovement?.purchases || []).map(p => ({ ...p, type: 'purchase', icon: '🛒' })),
                ...(detailedMovement?.transfersIn || []).map(t => ({ ...t, type: 'transfer-in', icon: '📥' })),
                ...(detailedMovement?.transfersOut || []).map(t => ({ ...t, type: 'transfer-out', icon: '📤' })),
                ...(detailedMovement?.assignments || []).map(a => ({ ...a, type: 'assignment', icon: '👤' })),
                ...(detailedMovement?.expenditures || []).map(e => ({ ...e, type: 'expenditure', icon: '💸' }))
              ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

              return allActivities.map((activity, activityIdx) => (
                <li key={`${activity.type}-${activity.id}`}>
                  <div className="relative pb-8">
                    {activityIdx !== allActivities.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-military-100 flex items-center justify-center ring-8 ring-white">
                          <span className="text-lg">{activity.icon}</span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {activity.type === 'purchase' && `Purchased ${activity.quantity} ${activity.equipment_name} at ${activity.base_name}`}
                            {activity.type === 'transfer-in' && `Received ${activity.quantity} ${activity.equipment_name} from ${activity.from_base}`}
                            {activity.type === 'transfer-out' && `Transferred ${activity.quantity} ${activity.equipment_name} to ${activity.to_base}`}
                            {activity.type === 'assignment' && `Assigned ${activity.quantity} ${activity.equipment_name} to ${activity.assigned_to}`}
                            {activity.type === 'expenditure' && `Expended ${activity.quantity} ${activity.equipment_name} at ${activity.base_name}`}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <span className="text-gray-900 font-medium">{activity.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ));
            })()}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;