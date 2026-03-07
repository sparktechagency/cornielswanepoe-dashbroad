import { Building2, Plus, Layers } from "lucide-react";
import { useState } from "react";

import AllStocks from "./AllStocks";
import MyStocks from "./MyStocks";
import { Button } from "../../ui/button";
import NewStockModal from "./NewStockModal";

const Stocks = () => {
  const [activeTab, setActiveTab] = useState("all-stocks");
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-serif text-white mb-1">
          Stock Listings
        </h1>

        {activeTab === "my-stocks" && (
          <Button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Stock
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#D4AF37]/10">
        <button
          onClick={() => setActiveTab("all-stocks")}
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all relative ${
            activeTab === "all-stocks"
              ? "bg-[#D4AF37] text-black"
              : "bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>All Stocks</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("my-stocks")}
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all relative ${
            activeTab === "my-stocks"
              ? "bg-[#D4AF37] text-black"
              : "bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>My Stocks</span>
          </div>
        </button>
      </div>

      {/* Content */}
      {activeTab === "all-stocks" ? <AllStocks /> : <MyStocks />}

      {/* Modal */}
      <NewStockModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default Stocks;