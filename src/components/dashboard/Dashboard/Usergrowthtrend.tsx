import { Calendar } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetUsersGrowthQuery } from "../../../redux/features/dashboard/dashboardApi";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {    
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 shadow-xl">       
        <div className="flex flex-col items-center gap-2 text-sm">
          <span className="text-gray-300">Month: {label}</span>          
          <div className="">
          <span className="text-gray-300">Users:</span>
          <span className="font-semibold text-white">{payload[0].value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


const currentYear = new Date().getFullYear();
export default function UserGrowthTrend() {
  const [selectedYear, setSelectedYear] = useState(currentYear); // default to current year
  
  const { data: userGrowth, isLoading } = useGetUsersGrowthQuery(selectedYear, { skip: !selectedYear });
  
  
  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-[#111111] border border-[#D4AF37]/20 rounded-lg py-6 px-6">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Loading user growth data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-[#111111] border border-[#D4AF37]/20 rounded-lg py-6">
      <div className="flex items-center justify-between mb-6 px-6">
        <div>
          <h2 className="text-xl font-serif text-white mb-1">User Growth Trend</h2>
          <p className="text-gray-400 text-sm">
            Monthly registered users {userGrowth?.data?.year || selectedYear}
          </p>
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-lg px-3 py-1.5">
          <Calendar className="w-4 h-4 text-[#D4AF37]" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
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

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={userGrowth?.data || []}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />

          <XAxis
            dataKey="month"
            stroke="#888"
            tick={{ fill: "#888", fontSize: 12 }}
            tickLine={false}
          />

          <YAxis
            stroke="#888"
            tick={{ fill: "#888", fontSize: 12 }}
            tickLine={false}
            width={45}
            allowDataOverflow
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#D4AF37"
            strokeWidth={3}
            dot={{ r: 3, stroke: "#D4AF37", strokeWidth: 2, fill: "#111111" }}
            activeDot={{ r: 6, stroke: "#D4AF37", strokeWidth: 2, fill: "#D4AF37" }}
            name="Registered Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}