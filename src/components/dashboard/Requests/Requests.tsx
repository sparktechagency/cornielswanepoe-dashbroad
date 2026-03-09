import { Building2, MessageSquare, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "../../ui/button";
import AllRequests from "./AllRequests";
import MyRequests from "./MyRequests";
import NewRequestModal from "./NewRequestModal";

const Requests = () => {
  const [activeTab, setActiveTab] = useState('all-requests');
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between" >
        <h1 className="text-xl font-serif text-white mb-1">
          Investment Requests
        </h1>

        {activeTab === "my-requests" && <Button onClick={() => setOpenModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Request
        </Button>}
      </div>


      <div className="flex items-center gap-2 mb-6 border-b border-primary/10">
        <button
          onClick={() => setActiveTab('all-requests')}
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all relative ${activeTab === 'all-requests'
            ? 'bg-primary text-black'
            : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
            }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>All Requests</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('my-requests')}
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all relative ${activeTab === 'my-requests'
            ? 'bg-primary text-black'
            : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
            }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>My Requests</span>
          </div>
        </button>
      </div>

      {/* Stock Listings Tab */}
      {activeTab === 'all-requests' ? (
        <AllRequests />
      ) : (
        <MyRequests />
      )}

      <NewRequestModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default Requests;