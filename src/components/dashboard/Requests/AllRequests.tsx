import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    DollarSign,
    Eye,
    MapPin,
    MessageSquare,
    Search,
    Send,
    Trash2,
    User,
    XCircle,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { imageUrl } from '../../../redux/base/baseAPI';
import { useGetRequestsQuery } from '../../../redux/features/request/requestApi';
import { Button } from '../../ui/button';

type Category = 'Vacant Land' | 'Farms' | 'Hotels' | 'Investment Portfolios' | 'all';
type RequestStatus = 'Open' | 'Active' | 'Closed' | 'all';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface Message {
    id: number;
    userId: number;
    userName: string; // Real name (admin sees this)
    userType: 'Investor' | 'Agent' | 'Developer' | 'Property Owner';
    anonymousId: string; // What other users see
    message: string;
    timestamp: string;
}

interface Conversation {
    id: number;
    userId: number;
    userName: string;
    userType: 'Investor' | 'Developer';
    anonymousId: string;
    category: Category;
    title: string;
    description: string;
    budget: string;
    preferredLocation: string;
    postedDate: string;
    status: 'Open' | 'Active' | 'Closed';
    approvalStatus: ApprovalStatus;
    lastMessageDate: string;
    messages: Message[];
    unreadCount: number;
    investorId: number;
    investor: string;
    investorEmail: string;
    investorPhone: string;
    ownerId: number;
    owner: string;
    ownerEmail: string;
    ownerPhone: string;
}

const getStatusBadge = (status: string) => {
    const styles = {
        'Open': 'bg-blue-400/10 text-blue-400',
        'Active': 'bg-green-400/10 text-green-400',
        'Closed': 'bg-gray-400/10 text-gray-400'
    };
    return styles[status as keyof typeof styles] || styles.Open;
};

const getUserTypeColor = (type: string) => {
    const colors = {
        'Investor': 'text-green-400',
        'Developer': 'text-purple-400',
        'Agent': 'text-yellow-400',
        'Property Owner': 'text-blue-400'
    };
    return colors[type as keyof typeof colors] || 'text-gray-400';
};

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return `${diffMins}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays}d ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
};

interface AdminConversationDetailProps {
    conversation: Conversation;
    onBack: () => void;
}

// @ts-ignore
function AdminConversationDetail({ conversation, onBack }: AdminConversationDetailProps) {
    const [adminMessage, setAdminMessage] = useState('');
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const navigate = useNavigate();

    const handleSendMessage = () => {
        if (!adminMessage.trim()) return;

        console.log('Admin sending message:', adminMessage);
        alert(`Message sent: "${adminMessage}"\n\nThis would be visible to all users in the thread.`);
        setAdminMessage('');
    };

    const handleCloseConversation = () => {
        console.log('Closing conversation:', conversation.id);
        alert('Conversation closed. Users can no longer reply.');
        setShowCloseConfirm(false);
        onBack();
    };

    const handleUserClick = (userId: number) => {
        // Navigate to AdminUsers page with userId as state
        navigate('/users', { state: { selectedUserId: userId } });
    };

    //   const handleFacilitateConnection = () => {
    //     const participants = Array.from(new Set(conversation.messages.map(m => m.userName)));
    //     alert(`Facilitating connection between:\n\n${participants.join('\n')}\n\nYou would now contact these parties offline to arrange a formal introduction.`);
    //   };

    return (
        <div className="p-8">
            {/* Conversation Header */}
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Requests Board
                </button>

                <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-gray-500 text-sm">Request #{conversation.id}</span>
                                <span className="px-2 py-1 bg-purple-400/10 text-purple-400 rounded text-xs">
                                    {conversation.category}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(conversation.status)}`}>
                                    {conversation.status}
                                </span>
                            </div>
                            <h2 className="text-2xl font-serif text-white mb-2">{conversation.title}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    <span className="text-white font-medium">{conversation.budget}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    <span className="text-white font-medium">{conversation.preferredLocation}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-white">
                                        {new Date(conversation.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Original Poster Info (Admin View) */}
                    <div className="bg-[#1A1A1A] border border-primary/10 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Posted by (Admin View):</p>
                                <p className="text-white font-medium">{conversation.userName}</p>
                                <p className={`text-sm ${getUserTypeColor(conversation.userType)}`}>
                                    {conversation.userType}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">Users see:</p>
                                <p className="text-primary font-medium">{conversation.anonymousId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="bg-[#111111] border border-primary/20 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-primary/20">
                    <h3 className="text-lg font-serif text-white">Conversation Thread</h3>
                </div>

                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                    {conversation.messages.map((message: any, index: number) => {
                        const isOriginalPoster = message.userId === conversation.userId;

                        return (
                            <div key={index} className={`flex ${isOriginalPoster ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] ${isOriginalPoster ? 'items-end' : 'items-start'} flex flex-col`}>
                                    {/* User Info (Admin View) - Clickable Name */}
                                    <div className="flex items-center gap-2 mb-1 px-2">
                                        <User className="w-3 h-3 text-gray-500" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUserClick(message.userId);
                                            }}
                                            className="text-xs text-gray-400 hover:text-primary hover:underline transition-colors cursor-pointer font-medium"
                                        >
                                            {message.userName}
                                        </button>
                                        <span className={`text-xs ${getUserTypeColor(message.userType)}`}>
                                            ({message.userType})
                                        </span>
                                        <span className="text-xs text-gray-600">→ shows as {message.anonymousId}</span>
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`rounded-2xl px-4 py-3 ${isOriginalPoster
                                        ? 'bg-primary text-black'
                                        : 'bg-[#1A1A1A] text-white border border-primary/20'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{message.message}</p>
                                    </div>

                                    {/* Timestamp */}
                                    <span className="text-xs text-gray-500 mt-1 px-2">
                                        {new Date(message.timestamp).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Admin Message Input */}
                {conversation.status !== 'Closed' && (
                    <div className="p-6 border-t border-primary/20 bg-[#1A1A1A]">
                        <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3 mb-4">
                            <p className="text-blue-400 text-xs font-medium mb-1">💡 Admin Message Mode</p>
                            <p className="text-gray-400 text-xs">
                                Your message will show as <strong className="text-primary">"Investors Hub Admin"</strong> to all users
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <textarea
                                value={adminMessage}
                                onChange={(e) => setAdminMessage(e.target.value)}
                                placeholder="Type your message to participants... (e.g., 'Thank you for the discussion. I will facilitate a connection between interested parties.')"
                                className="flex-1 bg-[#111111] border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                                rows={3}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!adminMessage.trim()}
                                className="px-6 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Send
                            </button>
                        </div>
                    </div>
                )}

                {conversation.status === 'Closed' && (
                    <div className="p-6 border-t border-primary/20 bg-red-400/5">
                        <div className="flex items-center justify-center gap-2 text-red-400">
                            <XCircle className="w-5 h-5" />
                            <p className="font-medium">This conversation has been closed. No new messages allowed.</p>
                        </div>
                    </div>
                )}

                {/* Admin Actions */}
                <div className="p-6 border-t border-primary/20">
                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const newStatus = conversation.status === 'Open' ? 'Active' : 'Open';
                                alert(`Status changed to: ${newStatus}`);
                            }}
                            className="flex items-center justify-center gap-2"
                        >
                            <AlertCircle className="w-4 h-4" />
                            Change Status
                        </Button>

                        {conversation.status !== 'Closed' ? (
                            <Button
                                variant="outline"
                                onClick={() => setShowCloseConfirm(true)}
                                className="flex items-center justify-center gap-2 text-red-400 border-red-400/20 hover:bg-red-400/10 hover:border-red-400"
                            >
                                <XCircle className="w-4 h-4" />
                                Close Conversation
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    alert('Conversation reopened');
                                }}
                                className="flex items-center justify-center gap-2 text-green-400 border-green-400/20 hover:bg-green-400/10 hover:border-green-400"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Reopen Conversation
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Close Confirmation Modal */}
            {showCloseConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111111] border border-primary/20 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-serif text-white mb-4">Close Conversation?</h3>
                        <p className="text-gray-400 mb-6">
                            This will close the conversation and prevent users from sending new messages.
                            You can reopen it later if needed.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowCloseConfirm(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCloseConversation}
                                className="flex-1 bg-red-500 hover:bg-red-600"
                            >
                                Close Conversation
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AllRequests() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState<RequestStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<Conversation | null>(null);

    const { data: requestsData, isLoading, error } = useGetRequestsQuery({});


    console.log("requestsData", requestsData);
    
    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high': return 'text-red-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };
    return (
        <div className="">       
            <div className="bg-[#111111] border border-primary/20 flex items-center gap-5 rounded-lg  mb-6">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none bg-[#1A1A1A] border border-primary/20 rounded-lg px-4 py-3.5 pr-10 text-white text-sm font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer hover:border-primary/40"
                        >
                            <option value="">All Categories</option>
                            <option value="real_estate">🏢 Real Estate</option>
                            <option value="startup">🚀 Startup</option>
                            <option value="technology">💻 Technology</option>
                            <option value="business">📊 Business</option>
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conversations Inbox (Chat List Style) */}
            <div className="space-y-3">
                {requestsData?.data?.map((conv: any) => (
                    <div
                        key={conv._id}
                        onClick={() => navigate(`/requests/${conv._id}`)}
                        className={`bg-[#111111] border rounded-lg p-4 hover:border-primary transition-all cursor-pointer ${conv.isActive ? 'border-primary/40' : 'border-primary/20'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                                {conv.createdBy?.image ? (
                                    <img
                                        src={imageUrl + conv.createdBy.image}
                                        alt={conv.createdBy.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white font-medium text-sm truncate">{conv.title}</h3>
                                        <span className="px-2 py-1 bg-purple-400/10 text-purple-400 rounded text-xs shrink-0">
                                            {conv.topic}
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-xs shrink-0 ml-2">
                                        {formatTimestamp(conv.createdAt)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-gray-500">Posted by:</span>
                                    <span className="text-xs text-white font-medium">{conv.createdBy?.name}</span>
                                    <span className={`text-xs ${getUserTypeColor(conv.createdBy?.role)}`}>
                                        ({conv.createdBy?.role})
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{conv.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <DollarSign className="w-3 h-3" />
                                            {conv.budgetRange}
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs ${getUrgencyColor(conv.urgency)}`}>
                                            <Zap className="w-3 h-3" />
                                            {conv.urgency}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(conv.status)}`}>
                                            {conv.status}
                                        </span>
                                        <Button
                                            size="sm"
                                            className="text-xs"
                                            onClick={(e) => {
                                                e?.stopPropagation();
                                                navigate(`/requests/${conv._id}`);
                                            }}
                                        >
                                            <Eye className="w-3 h-3" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs text-red-500"
                                            onClick={(e) => {
                                                e?.stopPropagation();
                                                setRequestToDelete(conv);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* Delete Confirmation Modal */}
            {showDeleteModal && requestToDelete && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111111] border border-red-500/30 rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-serif text-white">Delete Request</h2>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-300 mb-2">
                                Are you sure you want to permanently delete this request and all associated conversations?
                            </p>
                            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-primary/20">
                                <p className="text-white font-medium">{requestToDelete.title}</p>
                                <p className="text-gray-400 text-sm">Posted by: {requestToDelete.userName}</p>
                            </div>
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm">
                                    ⚠️ This action cannot be undone. All conversation history will be permanently lost.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setRequestToDelete(null);
                                }}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <button
                                onClick={() => {
                                    console.log('Deleting request:', requestToDelete.id);
                                    alert('Request deleted successfully');
                                    setShowDeleteModal(false);
                                    setRequestToDelete(null);
                                }}
                                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 font-medium"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}