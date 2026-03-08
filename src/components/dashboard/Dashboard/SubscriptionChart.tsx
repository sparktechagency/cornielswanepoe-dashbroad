import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useGetSubscriptionQuery } from '../../../redux/features/dashboard/dashboardApi';

const currentYear = new Date().getFullYear();

const SubscriptionChart = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const { data: subscriptionData, isLoading } = useGetSubscriptionQuery(selectedYear);

  console.log("Subscription Data:", subscriptionData);
  
    
  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-[#111111] border border-primary/20 rounded-lg py-6 px-6">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-primary/20 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6 px-6">
        <div className="">
          <h2 className="text-xl font-serif text-white mb-1">Subscription Breakdown</h2>
          <p className="text-gray-400 text-sm mb-6">Monthly comparison of paid vs free users</p>
        </div>
        {/* Year Filter */}
        <div className="flex items-center gap-2 bg-[#1A1A1A] border border-primary/30 rounded-lg px-3 py-1.5">
          <Calendar className="w-4 h-4 text-primary" />
          <select
            value={Number(selectedYear)}
            onChange={(e) => setSelectedYear(e.target.value)}
            className=" min-w-24 text-white text-sm focus:outline-none cursor-pointer font-medium"
          >
            <option value={currentYear} className="bg-black ">{currentYear}</option>
            <option value={currentYear - 1} className="bg-black ">{currentYear - 1}</option>
            <option value={currentYear - 2} className="bg-black">{currentYear - 2}</option>
            <option value={currentYear - 3} className="bg-black">{currentYear - 3}</option>
            <option value={currentYear - 4} className="bg-black">{currentYear - 4}</option>
          </select>
        </div>
      </div>



      <ResponsiveContainer width="100%" height={250}  >
        <BarChart data={subscriptionData?.data || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="month"
            stroke="#888"
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <YAxis
            dataKey="paid"
            stroke="#888"
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <YAxis
            dataKey="free"
            stroke="#888"
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #D4AF37',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend
            wrapperStyle={{ color: '#888' }}
            iconType="circle"
          />
          <Bar dataKey="paid" name="Paid Subscribers" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="free" name="Free Users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SubscriptionChart