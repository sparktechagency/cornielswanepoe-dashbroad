import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  StickyNote,
  Trash2,
  TrendingUp,
  User
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { imageUrl } from '../../../redux/base/baseAPI';
import { useGetSingleStocksQuery, useStockApprovalMutation } from '../../../redux/features/stock/stockApi';
import { Button } from '../../ui/button';

interface InterestedParty {
  id: number;
  investorName: string;
  investorType: 'Individual' | 'Company' | 'Fund';
  email: string;
  phone: string;
  interestDate: string;
  status: 'New' | 'Contacted' | 'Closed';
  notes: string;
}

export default function AdminStockDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedParty, setSelectedParty] = useState<InterestedParty | null>(null);

  const { data: stockData } = useGetSingleStocksQuery(id!);
  const [stockApproval] = useStockApprovalMutation({})



  const isApprovalView = location.pathname.includes('/approvals/');

  const isPending = new URLSearchParams(location.search).get('pending') === 'true';

  // Mock property data
  const property = {
    id: parseInt(id || '101'),
    title: 'Prime Farmland',
    location: 'Stellenbosch Area, Western Cape',
    fullAddress: 'General area only (privacy protected)',
    category: 'Farms',
    description: 'Premium agricultural land suitable for wine production. Excellent soil quality and established infrastructure. The property features rolling hills with exceptional drainage, making it ideal for viticulture. Existing infrastructure includes irrigation systems and access roads.',
    approximatePrice: 'R50M - R80M',
    size: '50 - 100 hectares',
    status: 'Active',
    dateAdded: '2024-01-15',
    interestCount: 8,
    owner: 'Private Entity (Contact via Admin)',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800'
    ],
    features: [
      'Prime agricultural zoning',
      'Existing irrigation infrastructure',
      'Excellent soil quality',
      'Access to main roads',
      'Established utilities'
    ]
  };

  // Mock interested parties
  const interestedParties: InterestedParty[] = [
    {
      id: 1,
      investorName: 'Michael Chen',
      investorType: 'Individual',
      email: 'michael.c@email.com',
      phone: '+27 82 456 7845',
      interestDate: '2024-01-20',
      status: 'New',
      notes: ''
    },
    {
      id: 2,
      investorName: 'Green Valley Investments',
      investorType: 'Fund',
      email: 'info@greenvalley.co.za',
      phone: '+27 21 555 1234',
      interestDate: '2024-01-19',
      status: 'Contacted',
      notes: 'Requested site visit'
    },
    {
      id: 3,
      investorName: 'AgriGrowth Capital',
      investorType: 'Company',
      email: 'deals@agrigrowth.com',
      phone: '+27 11 789 6523',
      interestDate: '2024-01-18',
      status: 'Contacted',
      notes: 'Requested financial statements'
    },
    {
      id: 4,
      investorName: 'Sarah Williams',
      investorType: 'Individual',
      email: 'sarah.w@email.com',
      phone: '+27 83 234 5667',
      interestDate: '2024-01-17',
      status: 'New',
      notes: ''
    },
    {
      id: 5,
      investorName: 'Cape Wine Estates',
      investorType: 'Company',
      email: 'acquisitions@capewine.co.za',
      phone: '+27 21 987 6512',
      interestDate: '2024-01-16',
      status: 'Closed',
      notes: 'Deal closed - moved forward'
    }
  ];

  const handleContact = (party: InterestedParty) => {
    setSelectedParty(party);
    setShowContactModal(true);
  };

  const handleAddNote = (party: InterestedParty) => {
    setSelectedParty(party);
    setShowNoteModal(true);
  };

  const handleMarkAsContacted = (partyId: number) => {
    console.log('Marking party as contacted:', partyId);
    alert('Status updated to "Contacted"');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'New': 'bg-blue-400/10 text-blue-400',
      'Contacted': 'bg-orange-400/10 text-orange-400',
      'Closed': 'bg-green-400/10 text-green-400'
    };
    return styles[status as keyof typeof styles] || styles.New;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Company':
        return <Building2 className="w-4 h-4" />;
      case 'Fund':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const handleApproveStock = async (status: { status: string }) => {
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
    const response = await stockApproval({ id, status }).unwrap();
    
    if (response?.success) {
      toast.success(response?.message);
    }
  } catch (error: any) {
    toast.error(error?.data?.message);
  }
};


return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(isApprovalView ? '/approvals' : '/stocks')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {isApprovalView ? 'Back to Approvals' : 'Back to Stock'}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif text-white mb-2">{stockData?.title}</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              {stockData?.location}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isPending ? (
              // Approval buttons for pending items
              <>
                <Button
                  onClick={()=>handleApproveStock({status: 'active'})}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve & Publish
                </Button>
                <Button
                  onClick={()=>handleApproveStock({status: 'cancelled'})}
                  variant="outline"
                  className="flex items-center gap-2 text-red-400 border-red-400/20 hover:border-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Reject
                </Button>
              </>
            ) : (
              // Edit/Delete buttons for published items
              <>                
                <Button variant="outline" className="flex items-center gap-2 text-red-400 border-red-400/20 hover:border-red-400">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pending Status Banner */}
      {isPending && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-medium mb-1">Pending Approval</p>
              <p className="text-sm text-gray-400">
                This listing is not yet live. No interest tracking or conversations available until approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Layout OR Full Width (depending on pending status) */}
      <div className={`grid grid-cols-1 gap-6 ${!isPending ? 'lg:grid-cols-3' : ''}`}>
        {/* LEFT COLUMN - Property Details (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Images */}
          <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-serif text-white mb-4">Property Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {stockData?.images.map((imgUrl: string, index: number) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={imageUrl + imgUrl}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            <p className="text-green-400 text-xs mt-4 flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Admin View: Unblurred images (users see blurred versions)
            </p>
          </div>

          {/* Key Information */}
          <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-serif text-white mb-4">Key Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <DollarSign className="w-4 h-4" />
                  Price Range
                </div>
                <p className="text-primary font-bold text-lg">{stockData?.price}</p>
              </div>

              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Building2 className="w-4 h-4" />
                  Property Size
                </div>
                <p className="text-white font-bold text-lg">{stockData?.size}</p>
              </div>

              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  Date Added
                </div>
                <p className="text-white font-medium">
                  {new Date(stockData?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <User className="w-4 h-4" />
                  Owner
                </div>
                <p className="text-white font-medium text-sm">{stockData?.owner?.name} ({stockData?.owner?.role})</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-serif text-white mb-4">Description</h2>
            <p className="text-gray-300 leading-relaxed">{stockData?.description}</p>
          </div>

          {/* Features */}
          <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-serif text-white mb-4">Property Features</h2>
            <ul className="space-y-2">
              {stockData?.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN - Interested Parties Panel (1/3 width) - ONLY SHOW IF NOT PENDING */}
        {!isPending && (
          <div className="lg:col-span-1">
            <div className="bg-[#111111] border border-primary/20 rounded-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif text-white mb-1">Interested Parties</h2>
                  <p className="text-gray-400 text-sm">{interestedParties.length} investors expressed interest</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Interest Summary */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                  <p className="text-blue-400 text-xl font-bold">
                    {interestedParties.filter(p => p.status === 'New').length}
                  </p>
                  <p className="text-gray-400 text-xs">New</p>
                </div>
                <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                  <p className="text-orange-400 text-xl font-bold">
                    {interestedParties.filter(p => p.status === 'Contacted').length}
                  </p>
                  <p className="text-gray-400 text-xs">Contacted</p>
                </div>
                <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                  <p className="text-green-400 text-xl font-bold">
                    {interestedParties.filter(p => p.status === 'Closed').length}
                  </p>
                  <p className="text-gray-400 text-xs">Closed</p>
                </div>
              </div>

              {/* Parties List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {interestedParties.map((party) => (
                  <div key={party.id} className="p-4 bg-[#1A1A1A] rounded-lg border border-primary/10 hover:border-primary/30 transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          {getTypeIcon(party.investorType)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate">{party.investorName}</p>
                          <p className="text-gray-400 text-xs">{party.investorType}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(party.status)}`}>
                        {party.status}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Mail className="w-3 h-3" />
                        {party.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Phone className="w-3 h-3" />
                        {party.phone}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(party.interestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    {/* Notes */}
                    {party.notes && (
                      <div className="p-2 bg-black/40 rounded text-xs text-gray-300 mb-3">
                        <span className="text-gray-500">Note:</span> {party.notes}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleContact(party)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors text-xs font-medium"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Contact
                      </button>
                      {party.status === 'New' && (
                        <button
                          onClick={() => handleMarkAsContacted(party.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-400/10 text-green-400 rounded hover:bg-green-400/20 transition-colors text-xs font-medium"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Mark Contacted
                        </button>
                      )}
                      <button
                        onClick={() => handleAddNote(party)}
                        className="p-2 bg-blue-400/10 text-blue-400 rounded hover:bg-blue-400/20 transition-colors"
                        title="Add Note"
                      >
                        <StickyNote className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal - Redesigned for Admin View */}
      {showContactModal && selectedParty && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-primary/30 rounded-lg max-w-md w-full relative">
            {/* Close Button in Corner */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A1A1A] hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-serif text-white mb-6">Investor Contact Details</h2>

              <div className="space-y-4">
                {/* Name */}
                <div className="p-4 bg-[#1A1A1A] rounded-lg border border-primary/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-white font-medium">{selectedParty.investorName}</p>
                </div>

                {/* Email */}
                <div className="p-4 bg-[#1A1A1A] rounded-lg border border-primary/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email Address</p>
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <a
                    href={`mailto:${selectedParty.email}`}
                    className="text-primary hover:text-[#F4CF57] transition-colors font-medium break-all"
                  >
                    {selectedParty.email}
                  </a>
                </div>

                {/* Phone */}
                <div className="p-4 bg-[#1A1A1A] rounded-lg border border-primary/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Phone Number</p>
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <a
                    href={`tel:${selectedParty.phone}`}
                    className="text-primary hover:text-[#F4CF57] transition-colors font-medium"
                  >
                    {selectedParty.phone}
                  </a>
                </div>

                {/* Investor Type */}
                <div className="p-4 bg-[#1A1A1A] rounded-lg border border-primary/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Investor Type</p>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedParty.investorType)}
                    <p className="text-white font-medium">{selectedParty.investorType}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="p-4 bg-[#1A1A1A] rounded-lg border border-primary/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current Status</p>
                  <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusBadge(selectedParty.status)}`}>
                    {selectedParty.status}
                  </span>
                </div>

                {/* Interest Date */}
                <div className="p-4 bg-[#1A1A1A] rounded-lg border border-primary/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Interest Expressed On</p>
                  <p className="text-white font-medium">
                    {new Date(selectedParty.interestDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && selectedParty && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-primary/30 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-serif text-white mb-4">Add Internal Note</h2>
            <p className="text-gray-400 text-sm mb-4">For: {selectedParty.investorName}</p>
            <textarea
              className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors min-h-[120px]"
              placeholder="Add your note here..."
            ></textarea>
            <div className="flex gap-3 mt-4">
              <Button onClick={() => setShowNoteModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => {
                alert('Note saved');
                setShowNoteModal(false);
              }} className="flex-1">
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}