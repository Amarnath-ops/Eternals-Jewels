import { Box, DollarSign, LayoutDashboard, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Customers', value: '5,423', sub: '16% this month', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Total Orders', value: '1,893', sub: '', icon: Box, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Total Sales', value: '₹65,805', sub: '', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Total Pending', value: '189', sub: '', icon: LayoutDashboard, color: 'text-gray-600', bg: 'bg-gray-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
             <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
             </div>
             <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                {stat.sub && <p className="text-xs text-green-500 font-medium mt-1">▲ {stat.sub}</p>}
             </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Details</h2>

      {/* Chart Placeholders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Sales Overview Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-6">Sales Overview</h3>
          <div className="h-64 w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <DollarSign className="w-10 h-10 mb-2 opacity-20" />
            <span className="text-sm font-medium">Sales Chart Area</span>
            <span className="text-xs mt-1">Recharts removed for now</span>
          </div>
        </div>

        {/* Orders Trend Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-6">Orders Trend</h3>
          <div className="h-64 w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <Box className="w-10 h-10 mb-2 opacity-20" />
            <span className="text-sm font-medium">Orders Trend</span>
            <span className="text-xs mt-1">Chart Placeholder</span>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-gray-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-green-600 font-semibold">
                <th className="px-6 py-4">productId</th>
                <th className="px-6 py-4">name</th>
                <th className="px-6 py-4">buyer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">#123</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">Heart Drop Necklace</td>
                <td className="px-6 py-4 text-sm text-gray-500">@john@gmail.com</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-bold">01 - 06 - 2025</td>
                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">40</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">#124</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">Leather Wallet</td>
                <td className="px-6 py-4 text-sm text-gray-500">@doe@gmail.com</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-bold">02 - 06 - 2025</td>
                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard