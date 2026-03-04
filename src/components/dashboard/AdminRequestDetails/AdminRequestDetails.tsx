import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Calendar,
  CheckCircle,
  DollarSign,
  Flag,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetSingleRequestsQuery, useRequestApprovalMutation } from '../../../redux/features/request/requestApi';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

export function AdminRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data:request, isLoading, error } = useGetSingleRequestsQuery(id!, {
    skip: !id,
  });
  const [requestApproval] = useRequestApprovalMutation();

  const isApprovalView = location.pathname.includes('/approvals/');

  const [requestStatus, setRequestStatus] = useState(request?.status || 'pending');

  const handleApproveRequest = async (status: { status: string }) => {
  const isApproving = status.status === 'active';

  const result = await Swal.fire({
    title: isApproving ? 'Approve Listing?' : 'Reject Listing?',
    text: isApproving
      ? 'This will publish the stock listing and make it visible to users.'
      : 'This will reject the listing. Please confirm your decision.',
    icon: isApproving ? 'success' : 'warning',
    showCancelButton: true,
    confirmButtonText: isApproving ? 'Yes, Approve' : 'Yes, Reject',
    cancelButtonText: 'Cancel',
    background: '#111111',
    color: '#ffffff',
    confirmButtonColor: isApproving ? '#22c55e' : '#ef4444',
    cancelButtonColor: '#374151',
  });

  if (!result.isConfirmed) return;

  try {
    const response = await requestApproval({ id, status }).unwrap();
    console.log("approve response:", response);
    
    if (response?.success) {
      toast.success(response?.message);
    }
  } catch (error: any) {
    toast.error(error?.data?.message);
  }
};

  const handleReject = () => {
    const reason = prompt('Rejection reason (optional):');
    // TODO: call reject mutation with reason
    alert('Request rejected!');
    navigate('/approvals');
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-xl p-6 animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 mb-4">Failed to load request details</div>
        <button
          onClick={() => navigate(isApprovalView ? '/approvals' : '/requests')}
          className="text-[#D4AF37] hover:underline"
        >
          ← Back to list
        </button>
      </div>
    );
  }

  const isPending = request?.status === 'pending';

  return (
    <div className="p-6 md:p-8">
      {/* Header / Back */}
      <button
        onClick={() => navigate(isApprovalView ? '/approvals' : '/requests')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        {isApprovalView ? 'Back to Approvals' : 'Back to Requests Board'}
      </button>

      <div className="space-y-6">
        {/* Main Request Card */}
        <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-serif text-white">{request?.title}</h1>

            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${
                isPending
                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-400/30'
                  : 'bg-green-500/10 text-green-400 border-green-400/30'
              }`}
            >
              {isPending ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {request?.status?.toUpperCase()}
            </span>
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <InfoCard label="Investor Name" value={request?.createdBy?.name || '—'} />
            <InfoCard label="Email" value={request?.createdBy?.email || '—'} />
            <InfoCard label="Topic / Category" value={request?.topic} />
            <InfoCard label="Budget Range" value={request?.budgetRange} highlight />
          </div>

          {/* Dates & Location */}
          <div className="flex flex-wrap gap-5 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Posted: {formatDate(request?.createdAt)}
            </div>
            {/* If you later add location field */}
            {/* <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              {request?.location || 'Not specified'}
            </div> */}
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-medium">{request?.budgetRange}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-xl p-6">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Request Description</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {request?.description || 'No description provided.'}
          </p>
        </div>

        {/* Admin Actions */}
        <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-xl p-6">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">
            {isPending ? 'Approval Actions' : 'Manage Request'}
          </h3>

          {isPending ? (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleApproveRequest({ status: 'active' })}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Approve & Publish
              </button>

              <button
                onClick={handleReject}
                className="flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-400/30 rounded-lg font-medium transition-colors"
              >
                <Ban className="w-5 h-5" />
                Reject Request
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm hover:bg-blue-600/30">
                Mark as Open
              </button>
              <button className="px-4 py-2 bg-green-600/20 text-green-300 rounded-lg text-sm hover:bg-green-600/30">
                Mark as Active
              </button>
              <button className="px-4 py-2 bg-gray-600/20 text-gray-300 rounded-lg text-sm hover:bg-gray-600/30">
                Close Request
              </button>
              <button className="ml-auto px-4 py-2 bg-orange-600/20 text-orange-300 rounded-lg text-sm hover:bg-orange-600/30">
                <Flag className="w-4 h-4 inline mr-1" />
                Flag Content
              </button>
            </div>
          )}
        </div>

        {/* Placeholder for Chats (to be implemented later) */}
        {!isPending && (
          <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-xl p-6 text-center text-gray-500 py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Individual Conversations</p>
            <p className="text-sm">
              Chat functionality will be available once users start messaging on this request?.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#0A0A0A] border border-[#D4AF37]/10 rounded-lg p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">{label}</p>
      <p className={`font-medium ${highlight ? 'text-[#D4AF37]' : 'text-white'}`}>
        {value || '—'}
      </p>
    </div>
  );
}