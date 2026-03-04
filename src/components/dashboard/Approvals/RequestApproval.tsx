import React from 'react'
import { useGetPendingRequestsQuery } from '../../../redux/features/request/requestApi';
import Loader from '../../Shared/Loader';
import { Building2, Calendar, CheckCircle, DollarSign, Eye, User, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../../ui/button';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

const RequestApproval = () => {
  const navigate = useNavigate();
  const { data: pendingStock, isLoading, error } = useGetPendingRequestsQuery({});

  const pendingRequests = pendingStock?.data ?? [];

  const handleApproveRequest = async (id: string) => {
    const result = await Swal.fire({
      title: 'Approve Request?',
      text: 'This will approve the request and make it visible to users.',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel',
      background: '#111111',
      color: '#ffffff',
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#374151',
    });

    if (!result.isConfirmed) return;

    try {
      // await approveRequest({ id }).unwrap();
      toast.success('Request approved successfully');
    } catch (error: any) {
      toast.error(error?.data?.message ?? 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (id: string) => {
    const result = await Swal.fire({
      title: 'Reject Request?',
      text: 'This will reject the request permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      background: '#111111',
      color: '#ffffff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
    });

    if (!result.isConfirmed) return;

    try {
      // await rejectRequest({ id }).unwrap();
      toast.success('Request rejected');
    } catch (error: any) {
      toast.error(error?.data?.message ?? 'Failed to reject request');
    }
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader size={40} color="#D4AF37" />
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="bg-[#111111] border border-red-500/30 rounded-lg p-8 text-center">
        <p className="text-red-400">Failed to load pending requests</p>
      </div>
    );
  }

  /* ── Empty ── */
  if (!pendingRequests.length) {
    return (
      <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-lg p-12 text-center">
        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No pending request listings</p>
        <p className="text-gray-500 text-sm mt-2">All listings have been reviewed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map((item: any) => (
        <div
          key={item._id}
          className="bg-[#111111] border border-orange-400/30 rounded-lg p-6 hover:border-orange-400 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Top badges */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500 text-sm">
                  Request #{item._id.slice(-6).toUpperCase()}
                </span>
                <span className="px-2 py-0.5 bg-purple-400/10 text-purple-400 rounded text-xs">
                  {item.topic}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    item.urgency === 'high'
                      ? 'bg-red-400/10 text-red-400'
                      : item.urgency === 'medium'
                      ? 'bg-yellow-400/10 text-yellow-400'
                      : 'bg-green-400/10 text-green-400'
                  }`}
                >
                  {item.urgency?.toUpperCase()} URGENCY
                </span>
                <span className="px-2 py-1 bg-orange-400/10 text-orange-400 rounded text-xs font-medium">
                  PENDING
                </span>
              </div>

              {/* Title */}
              <h3 className="text-white font-medium text-lg mb-3">{item.title}</h3>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">Created by:</span>
                  <span className="text-white font-medium truncate">{item.createdBy}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-white font-medium">{item.budgetRange}</span>
                </div>
                <div className="flex items-center gap-2 text-sm col-span-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-white">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApproveRequest(item._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 transition-all group"
                >
                  <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Approve</span>
                </button>
                <button
                  onClick={() => handleRejectRequest(item._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-all group"
                >
                  <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Reject</span>
                </button>
                <Link to={`/approvals/requests/${item._id}?pending=true`}>
                <Button
                  size="sm"
                  className="ml-auto"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestApproval;