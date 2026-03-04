import { useNavigate } from 'react-router-dom';
import { useGetPendingStocksQuery } from '../../../redux/features/stock/stockApi';
import {
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  MapPin,
  User,
  XCircle,
} from 'lucide-react';
import Loader from '../../Shared/Loader';
import { Button } from '../../ui/button';
import { imageUrl } from '../../../redux/base/baseAPI';

export default function StockApproval() {
  const { data: pendingStock, isLoading, error } = useGetPendingStocksQuery({});
  const navigate = useNavigate();

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  /* -------------------- Loading -------------------- */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader size={40} color="#D4AF37" />
      </div>
    );
  }

  /* -------------------- Error -------------------- */
  if (error) {
    return (
      <div className="bg-[#111111] border border-red-500/30 rounded-lg p-8 text-center">
        <p className="text-red-400">Failed to load pending stocks</p>
      </div>
    );
  }

  /* -------------------- Empty State -------------------- */
  if (!pendingStock?.data?.length) {
    return (
      <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-lg p-12 text-center">
        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No pending stock listings</p>
        <p className="text-gray-500 text-sm mt-2">
          All listings have been reviewed
        </p>
      </div>
    );
  }

  /* -------------------- List -------------------- */
  return (
    <div className="space-y-4">
      {pendingStock.data.map((item: any) => {
        const displayImage =
          item?.images?.length > 0
            ? item.images[0]
            : '/images/placeholder-property.jpg';

        return (
          <div
            key={item._id}
            className="bg-[#111111] border border-orange-400/30 rounded-lg overflow-hidden hover:border-orange-400 transition-all"
          >
            <div className="flex flex-col md:flex-row gap-4 p-4">
              {/* Image */}
              <div className="w-full md:w-48 h-48 flex-shrink-0 relative">
                <img
                  src={imageUrl + displayImage}
                  alt={item.title}
                  className={`w-full h-full object-cover rounded-lg ${
                    item.isBlur ? 'blur-sm' : ''
                  }`}
                />
                {item.isBlur && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <span className="text-xs text-white/80 font-medium px-2 py-1 bg-black/50 rounded">
                      Blurred – Awaiting Approval
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2 gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-gray-500 text-sm">
                        Stock #{item._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-orange-400/10 text-orange-400 rounded text-xs font-medium uppercase">
                        Pending
                      </span>
                    </div>
                    <h3 className="text-white font-medium text-lg line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-white font-medium">
                      {item.userName || `User ${item.owner?.slice(-6)}`}
                    </span>
                    {item.userType && (
                      <span className="text-gray-500">
                        ({item.userType})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-white font-medium">
                      {item.price ?? '—'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-white line-clamp-1">
                      {item.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-white">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 transition-all">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Approve</span>
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-all">
                    <XCircle className="w-4 h-4" />
                    <span className="font-medium">Reject</span>
                  </button>

                  <Button
                    size="sm"
                    className="ml-auto"
                    onClick={() =>
                      navigate(`/approvals/stock/${item._id}?pending=true`)
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}