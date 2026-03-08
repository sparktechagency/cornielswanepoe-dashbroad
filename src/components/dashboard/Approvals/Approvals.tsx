import { useState } from 'react';

import { Building2, CheckCircle, MessageSquare } from 'lucide-react';
import RequestApproval from './RequestApproval';
import StockApproval from './StockApproval';

type ApprovalTab = 'stock' | 'requests';

const Approvals = () => {
  const [activeTab, setActiveTab] = useState<ApprovalTab>('stock');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-1">Content Approval</h1>
        <p className="text-sm text-gray-400">Review and approve pending stock listings and investment requests</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-linear-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-white font-medium mb-1">
              Items Awaiting Approval
            </p>
            <p className="text-sm text-gray-400">
              investment requests need your review
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-primary/10">
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all relative ${activeTab === 'stock'
            ? 'bg-primary text-black'
            : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
            }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Stock Listings</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all relative ${activeTab === 'requests'
            ? 'bg-primary text-black'
            : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
            }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>Request Board</span>
          </div>
        </button>
      </div>

      {/* Stock Listings Tab */}
      {activeTab === 'stock' && (
        <StockApproval />

      )}

      {/* Request Board Tab */}
      {activeTab === 'requests' && (
        <RequestApproval />
      )}
    </div>
  )
}

export default Approvals