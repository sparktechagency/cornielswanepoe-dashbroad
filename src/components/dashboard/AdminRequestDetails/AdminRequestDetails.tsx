import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetRequestChatByIdQuery } from '../../../redux/features/chat/chatApi';
import { useGetSingleRequestsQuery } from '../../../redux/features/request/requestApi';
import ChatList from './ChatList';

export function AdminRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: request, isLoading, error } = useGetSingleRequestsQuery(id!, {
    skip: !id,
  });

  const { data: chatsData,  } = useGetRequestChatByIdQuery(id!, { skip: !id });

  const isApprovalView = location.pathname.includes('/approvals/');

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
        <div className="bg-[#111111] border border-primary/20 rounded-xl p-6 animate-pulse">
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
          className="text-primary hover:underline"
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
        <div className="bg-[#111111] border border-primary/20 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-serif text-white">{request?.title}</h1>

            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${isPending
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

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">{request?.budgetRange}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#111111] border border-primary/20 rounded-xl p-6">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Request Description</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {request?.description || 'No description provided.'}
          </p>
        </div>

        {/* Placeholder for Chats (to be implemented later) */}
        {!isPending && <ChatList chatsData={chatsData} />}
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
    <div className="bg-[#0A0A0A] border border-primary/10 rounded-lg p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">{label}</p>
      <p className={`font-medium ${highlight ? 'text-primary' : 'text-white'}`}>
        {value || '—'}
      </p>
    </div>
  );
}