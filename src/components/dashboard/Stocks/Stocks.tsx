import {
  AlertTriangle,
  Building2,
  Eye,
  Heart,
  MapPin,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../ui/button';
import { useGetPendingStocksQuery } from '../../../redux/features/stock/stockApi';

// Adjust interface to match your actual API response shape
interface Stock {
  _id: string;
  title: string;
  price: string;
  location: string;
  size: string;
  images: string[];
  owner: string;
  isBlur: boolean;
  description: string;
  features: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  interestedCount: number;
  interestedPriority: 'low' | 'medium' | 'high';
}

export default function Stocks() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  // If you still want category filtering → you'll need to add category to backend or derive it
  const [categoryFilter] = useState<'all'>('all'); // removed for now – add back when category exists

  const { data: stocksData, isLoading, error } = useGetPendingStocksQuery();

  console.log("stocksData:", stocksData);
  
  // Use real data from API (assuming stocksData is array or { data: [...] })
  const stocks: Stock[] = Array.isArray(stocksData)
    ? stocksData
    : stocksData?.data || stocksData || [];

  const filteredStocks = stocks.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.location.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-400">
        Loading pending stock listings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        Failed to load stocks. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white mb-1">Pending Stocks</h1>
          <p className="text-sm text-gray-400">
            Review and manage property listings awaiting approval
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, or description..."
              className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#D4AF37]/20 bg-[#1A1A1A]">
                <th className="text-left p-4 text-sm font-medium text-gray-400">Property</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Location</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Size</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Price</th>
                <th className="text-center p-4 text-sm font-medium text-gray-400">Interest</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-[#D4AF37]/10 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                  onClick={() => navigate(`/stocks/${item._id}`)}
                >
                  <td className="p-4">
                    <p className="text-white font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 text-sm">{item.location}</span>
                    </div>
                  </td>

                  <td className="p-4 text-sm text-gray-300">{item.size || '—'}</td>

                  <td className="p-4">
                    <span className="text-[#D4AF37] font-medium text-sm">
                      {item.price ? `${item.price}` : '—'}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {item.interestedCount > 0 ? (
                        <>
                          <Heart
                            className={`w-4 h-4 ${
                              item.interestedPriority === 'high' ? 'text-[#D4AF37]' : 'text-blue-400'
                            }`}
                            fill={item.interestedPriority === 'high' ? '#D4AF37' : 'none'}
                          />
                          <span
                            className={`text-sm font-medium ${
                              item.interestedPriority === 'high' ? 'text-[#D4AF37]' : 'text-blue-400'
                            }`}
                          >
                            {item.interestedCount}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/stocks/${item._id}`);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 rounded-xl border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: implement delete mutation
                          console.log('Delete stock:', item._id);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 rounded-xl border-red-500 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStocks.length === 0 && (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No pending properties found</p>
            {searchQuery && (
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
            )}
          </div>
        )}
      </div>

      {/* Add / Delete modals can stay the same – just update to use real _id when implementing */}
    </div>
  );
}