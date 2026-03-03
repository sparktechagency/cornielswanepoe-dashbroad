import { Building2, Calendar, DollarSign, Download, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { monthlyData } from "../../../assets/data";
import { useGetAnalyticsQuery } from "../../../redux/features/dashboard/dashboardApi";


export default function Statics() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    const {data: dashboardData, isLoading, error} = useGetAnalyticsQuery(selectedYear);

    console.log("dashboardData:", dashboardData);
    
    // Current year data


  return (
    <div className="">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-white mb-1">Analytics Dashboard</h1>
            <p className="text-sm text-gray-400">Platform insights and key metrics</p>
          </div>

          {/* Year Selector & Export */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#111111] border border-[#D4AF37]/20 rounded-lg px-4 py-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${parseFloat(dashboardData?.totalUsers?.growthPercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(dashboardData?.totalUsers?.growthPercent) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(parseFloat(dashboardData?.totalUsers?.growthPercent || '0'))}%
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{dashboardData?.totalUsers?.count?.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Total Users</p>
        </div>

        
        <div className="bg-[#111111] border border-blue-400/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-400/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${parseFloat(dashboardData?.freeUsers?.growthPercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(dashboardData?.freeUsers?.growthPercent) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(parseFloat(dashboardData?.freeUsers?.growthPercent || '0'))}%
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{dashboardData?.freeUsers?.count?.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Free Users</p>
        </div>

        
        <div className="bg-[#111111] border border-green-400/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-400/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${parseFloat(dashboardData?.paidUsers?.growthPercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(dashboardData?.paidUsers?.growthPercent) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(parseFloat(dashboardData?.paidUsers?.growthPercent || '0'))}%
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{dashboardData?.paidUsers?.count?.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Paid Users</p>
        </div>

        
        <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#D4AF37]" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{dashboardData?.stockListings?.count?.toLocaleString()} </h3>
          <p className="text-gray-400 text-sm">Stock Listings</p>
        </div>
      </div> 
    </div>

  )
}