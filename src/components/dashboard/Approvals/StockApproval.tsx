import { useNavigate } from 'react-router-dom';
import { useGetPendingStocksQuery, useStockApprovalMutation } from '../../../redux/features/stock/stockApi';
import {
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  MapPin,
  Search,
  User,
  XCircle,
} from 'lucide-react';
import Loader from '../../Shared/Loader';
import { Button } from '../../ui/button';
import { imageUrl } from '../../../redux/base/baseAPI';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useUpdateSearchParams } from '../../../utils/updateSearchParams';
import { getSearchParams } from '../../../utils/getSearchParams';
import { useEffect } from 'react';
import ManagePagination from '../../Shared/ManagePagination';

export default function StockApproval() {
  const { data: pendingStock, refetch, isLoading, error } = useGetPendingStocksQuery({});
  const [stockApproval] = useStockApprovalMutation();
  const navigate = useNavigate();


      const updateSearchParams = useUpdateSearchParams();
      const { searchTerm, page} = getSearchParams();    
      useEffect(() => {        
        refetch()
      }, [searchTerm, page]);
      

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
      <div className="bg-[#111111] border border-primary/20 rounded-lg p-12 text-center">
        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No pending stock listings</p>
        <p className="text-gray-500 text-sm mt-2">
          All listings have been reviewed
        </p>
      </div>
    );
  }

  const handleApprove = async (id: string, status: string) => { 
    const isApprove = status === "active";

    const result = await Swal.fire({
      title: isApprove ? "Approve Listing?" : "Reject Listing?",
      text: isApprove
        ? "This will publish the stock listing."
        : "This will reject the stock listing.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isApprove ? "Yes, Approve" : "Yes, Reject",
    });

    if (result.isConfirmed) {
      try {
        const res = await stockApproval({
          id,
          status,
        })?.unwrap();

        if (res?.success) {
          toast.success(res?.message);
        }

      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong");
      }
    }
  };

  /* -------------------- List -------------------- */
  return (
    <div className="">
      <div className=" flex items-center justify-end gap-5 rounded-lg mb-6">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { updateSearchParams({ searchTerm: e.target.value }) }}
            placeholder="Search by title"
            className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
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
                    className={`w-full h-full object-cover rounded-lg `}
                  />
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
                      <DollarSign className="w-4 h-4 text-primary" />
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
                    <button onClick={() => handleApprove(item?._id, "active")} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 transition-all">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Approve</span>
                    </button>

                    <button onClick={() => handleApprove(item?._id, "cancelled")} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-all">
                      <XCircle className="w-4 h-4" />
                      <span className="font-medium">Reject</span>
                    </button>

                    <Button
                      size="lg"
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

      {/* -- Pagination -------- */}
      <ManagePagination meta={pendingStock?.meta}/>
    </div>

  );
}