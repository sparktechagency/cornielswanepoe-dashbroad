import { useState } from 'react';

import { Building2, Calendar, CheckCircle, DollarSign, Eye, MapPin, MessageSquare, User, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../ui/button';
import StockApproval from './StockApproval';
import { useGetPendingStocksQuery } from '../../../redux/features/stock/stockApi';

type ApprovalTab = 'stock' | 'requests';

interface StockListing {
  id: number;
  userId: number;
  userName: string;
  userType: string;
  title: string;
  category: string;
  location: string;
  price: string;
  image: string;
  postedDate: string;
}

interface RequestItem {
  id: number;
  userId: number;
  userName: string;
  userType: string;
  title: string;
  category: string;
  budget: string;
  location: string;
  postedDate: string;
}


const Approvals = () => {
   const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ApprovalTab>('stock');

      const { data: pendingStock, isLoading, error } = useGetPendingStocksQuery();
  
      console.log("pendingStock", pendingStock);
      


  // Mock pending requests
  const pendingRequests: RequestItem[] = [
    {
      id: 246,
      userId: 10023,
      userName: 'Retail Investment Group',
      userType: 'Investor',
      title: 'Seeking retail space portfolio in Durban',
      category: 'Investment Portfolios',
      budget: 'R70M - R120M',
      location: 'Durban Metro',
      postedDate: '2024-02-25'
    },
    {
      id: 247,
      userId: 11045,
      userName: 'Industrial Holdings Co',
      userType: 'Developer',
      title: 'Industrial warehouse land needed in Gauteng',
      category: 'Vacant Land',
      budget: 'R50M - R80M',
      location: 'Gauteng Industrial Hubs',
      postedDate: '2024-02-26'
    }
  ];

  const handleApproveRequest = (id: number) => {
    alert(`✅ Request #${id} approved!\n\nThe request is now visible on the Requests Board.`);
  };

  const handleRejectRequest = (id: number) => {
    if (confirm(`⚠️ Reject request #${id}?\n\nThis action cannot be undone. The request will be permanently deleted.`)) {
      alert(`❌ Request #${id} rejected and removed.`);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-1">Content Approval</h1>
        <p className="text-sm text-gray-400">Review and approve pending stock listings and investment requests</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-white font-medium mb-1">
              { pendingRequests.length} Items Awaiting Approval
            </p>
            <p className="text-sm text-gray-400">
              {pendingRequests.length} investment requests need your review
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#D4AF37]/10">
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all relative ${
            activeTab === 'stock'
              ? 'bg-[#D4AF37] text-black'
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Stock Listings</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'stock' 
                ? 'bg-black/20 text-black font-bold' 
                : 'bg-orange-400/20 text-orange-400'
            }`}>
              {pendingStock?.length ?? 0}
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all relative ${
            activeTab === 'requests'
              ? 'bg-[#D4AF37] text-black'
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>Request Board</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'requests' 
                ? 'bg-black/20 text-black font-bold' 
                : 'bg-orange-400/20 text-orange-400'
            }`}>
              {pendingRequests.length}
            </span>
          </div>
        </button>
      </div>

      {/* Stock Listings Tab */}
      {activeTab === 'stock' && (
        <StockApproval />
        
      )}

      {/* Request Board Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-lg p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No pending requests</p>
              <p className="text-gray-500 text-sm mt-2">All requests have been reviewed</p>
            </div>
          ) : (
            pendingRequests.map((item) => (
              <div
                key={item.id}
                className="bg-[#111111] border border-orange-400/30 rounded-lg p-6 hover:border-orange-400 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-500 text-sm">Request #{item.id}</span>
                      <span className="px-2 py-0.5 bg-purple-400/10 text-purple-400 rounded text-xs">
                        {item.category}
                      </span>
                      <span className="px-2 py-1 bg-orange-400/10 text-orange-400 rounded text-xs font-medium">
                        PENDING
                      </span>
                    </div>
                    <h3 className="text-white font-medium text-lg mb-3">{item.title}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-white font-medium">{item.userName}</span>
                        <span className="text-gray-500">({item.userType})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-white font-medium">{item.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-white">
                          {new Date(item.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApproveRequest(item.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 transition-all group"
                      >
                        <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(item.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-all group"
                      >
                        <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Reject</span>
                      </button>
                      <Button                         
                        size="sm" 
                        className="ml-auto"
                        onClick={() => navigate(`/approvals/requests/${item.id}?pending=true`)}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Approvals