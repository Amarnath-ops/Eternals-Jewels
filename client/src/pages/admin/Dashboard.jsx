import React from 'react';
import { Box, DollarSign, LayoutDashboard, Users, TrendingUp, Package } from "lucide-react";
import { useGetDashboardStats } from "@/hooks/tanstack_Queries/admin/report/useGetDashboardStats";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { data: statsResponse, isLoading } = useGetDashboardStats();
  const stats = statsResponse?.data;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Format Sales Overview Data
  const salesData = stats?.salesOverview?.map(item => ({
    name: monthNames[item._id.month - 1],
    revenue: item.revenue,
    orders: item.orders
  })) || [];

  // Format Orders Trend Data (Bar Chart)
  // Let's use the last 4 items for the bar chart as shown in the mockup
  const ordersTrendData = salesData.slice(-4);
 console.log(stats)
  const formatNumber = (num) => Number(num || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const summaryStats = [
    { title: 'Total Customers', value: formatNumber(stats?.summary?.totalCustomers), sub: '', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Orders', value: formatNumber(stats?.summary?.totalOrders), sub: '', icon: Box, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Sales', value: `₹${formatNumber(stats?.summary?.totalSales)}`, sub: '', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Discount', value: `₹${formatNumber(stats?.summary?.totalDiscount)}`, sub: '', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Pending', value: formatNumber(stats?.summary?.pendingOrders), sub: '', icon: LayoutDashboard, color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-xl shadow-sm border border-gray-100"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 h-80 bg-white rounded-xl shadow-sm border border-gray-100"></div>
          <div className="h-80 bg-white rounded-xl shadow-sm border border-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {summaryStats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-3 transition-all hover:shadow-md">
             <div className={`w-12 h-12 shrink-0 rounded-full ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
             </div>
             <div className="text-right flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1 font-medium truncate" title={stat.title}>{stat.title}</p>
                <h3 className="text-xl font-bold text-gray-900 truncate" title={stat.value}>{stat.value}</h3>
                {stat.sub && <p className="text-xs text-green-500 font-medium mt-1">▲ {stat.sub}</p>}
             </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
        Sales Details
      </h2>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Sales Overview Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Sales Overview</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Revenue</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(value) => `₹${value > 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Trend Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-6">Orders Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]} barSize={40}>
                  {ordersTrendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === ordersTrendData.length - 1 ? '#22c55e' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-400" />
                Latest Orders
            </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-green-600 font-semibold">
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Buyer Email</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.topProducts?.length > 0 ? (
                stats.topProducts.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {order.user?.fullname || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                        {order.user?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-bold">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }).replace(/\//g, ' - ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                        ₹{formatNumber(order.finalAmount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No orders found.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;