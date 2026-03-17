import { AlertCircle, Clock, Edit, Eye, Search, Shield, UserCheck, UsersIcon, UserX, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { imageUrl } from "../../../redux/base/baseAPI";
import { useGetKycSubmissionQuery, useKycUpdateMutation } from "../../../redux/features/setting/settingApi";
import { getSearchParams } from "../../../utils/getSearchParams";
import { useUpdateSearchParams } from "../../../utils/updateSearchParams";
import ImageViewer from "../../Shared/ImageViewer";
import Loader from "../../Shared/Loader";

// Reject Modal Component
const RejectModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111111] border border-primary/20 rounded-xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-900/30 rounded-lg">
              <UserX className="w-4 h-4 text-red-400" />
            </div>
            <h3 className="text-white font-semibold text-base">Reject KYC Submission</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-gray-400 text-sm">
            Please provide a reason for rejecting this KYC submission. This will be visible to the user.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Rejection Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Document is blurry, ID has expired, name mismatch..."
              rows={4}
              className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none text-sm"
            />
            <p className="text-gray-600 text-xs mt-1">{reason.length} / 500 characters</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-primary/20">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader color="#fff" size={14} />
            ) : (
              <UserX className="w-4 h-4" />
            )}
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────

const KycSubmission = () => {
  const { data: kycData, isLoading, refetch } = useGetKycSubmissionQuery({});
  const [kycUpdate, { isLoading: isUpdating }] = useKycUpdateMutation();

  const updateSearchParams = useUpdateSearchParams();
  const { searchTerm, role, page } = getSearchParams();

  // Reject modal state
  const [rejectModal, setRejectModal] = useState<{ open: boolean; kycId: string | null }>({
    open: false,
    kycId: null,
  });

  useEffect(() => {
    refetch();
  }, [searchTerm, role, page]);

  const handleKycApproved = async (id: string) => {
    try {
      const response = await kycUpdate({ id, status: "APPROVED" }).unwrap();
      if (response?.success) {
        toast.success(response?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const openRejectModal = (kycId: string) => {
    setRejectModal({ open: true, kycId });
  };

  const closeRejectModal = () => {
    setRejectModal({ open: false, kycId: null });
  };

  const handleKycRejected = async (reason: string) => {
    if (!rejectModal.kycId) return;
    try {
      const response = await kycUpdate({
        id: rejectModal.kycId,
        status: "REJECTED",
        rejectionReason: reason,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message ?? "KYC rejected successfully.");
        closeRejectModal();
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to reject KYC.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModal.open}
        onClose={closeRejectModal}
        onConfirm={handleKycRejected}
        isLoading={isUpdating}
      />

      {/* Search and Role Filter */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              onChange={(e) => updateSearchParams({ searchTerm: e.target.value })}
              placeholder="Search by email or phone"
              className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20 bg-[#1A1A1A]">
                <th className="text-left p-4 text-sm font-medium text-gray-400">User Id</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">ID / Passport</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Resendential Address</th>
                <th className="text-center p-4 text-sm font-medium text-gray-400">Classification</th>
                <th className="text-center p-4 text-sm font-medium text-gray-400">Document</th>
                <th className="text-center p-4 text-sm font-medium text-gray-400">Document Type</th>
                <th className="text-center p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9}>
                    <div className="flex items-center justify-center h-20">
                      <Loader color="#fff" size={30} />
                    </div>
                  </td>
                </tr>
              ) : (
                kycData?.map((kyc: any) => (
                  <tr
                    key={kyc._id}
                    className="border-b border-primary/10 hover:bg-[#1A1A1A] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          {kyc.userId.image ? (
                            <img
                              src={imageUrl + kyc.userId.image}
                              alt={kyc.userId.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-medium text-sm">
                                {kyc.userId.name
                                  .split(" ")
                                  .map((n: any) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#111111] ${
                              kyc.userId.onlineStatus?.isOnline ? "bg-green-400" : "bg-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{kyc.userId.name}</p>
                          <p className="text-gray-500 text-xs">ID: {kyc.userId._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{kyc?.name}</td>
                    <td className="p-4 text-gray-500 text-sm">{kyc?.idOrPassportNumber}</td>
                    <td className="p-4 text-gray-500 text-sm">{kyc?.residentialAddress}</td>
                    <td className="p-4 text-gray-500 text-sm">{kyc?.investorClassification}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      <ImageViewer
                        images={[kyc.image]}
                        imageUrl={imageUrl}
                        className="mt-2"
                        thumbnailClassName="cursor-pointer"
                        thumbnailHeight="h-14"
                        thumbnailWidth="w-14"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        {(() => {
                          const status = (kyc.status || "").toUpperCase();
                          if (status === "APPROVED") {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-900/40 text-green-400 rounded-full text-xs font-medium border border-green-800/50">
                                <Shield className="w-3.5 h-3.5" />
                                Verified
                              </span>
                            );
                          }
                          if (status === "REJECTED" || status === "REJECT") {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-900/40 text-red-400 rounded-full text-xs font-medium border border-red-800/50">
                                <XCircle className="w-3.5 h-3.5" />
                                Rejected
                              </span>
                            );
                          }
                          if (status === "PENDING" || status === "UNDER_REVIEW") {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-900/40 text-yellow-400 rounded-full text-xs font-medium border border-yellow-800/50">
                                <Clock className="w-3.5 h-3.5" />
                                Pending
                              </span>
                            );
                          }
                          if (status === "DRAFT") {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-900/40 text-purple-400 rounded-full text-xs font-medium border border-purple-800/50">
                                <Edit className="w-3.5 h-3.5" />
                                Draft
                              </span>
                            );
                          }
                          return (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs font-medium border border-gray-700">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {status || "Unknown"}
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      <div className="flex flex-col gap-0.5">
                        <span>{kyc.documentType || "—"}</span>
                        {kyc.idOrPassportNumber && (
                          <span className="text-gray-500 text-xs">{kyc.idOrPassportNumber}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {kyc.status !== "APPROVED" &&
                          kyc.status !== "REJECTED" &&
                          kyc.status !== "REJECT" && (
                            <>
                              <button
                                onClick={() => handleKycApproved(kyc._id)}
                                className="p-2 bg-green-900/30 hover:bg-green-800/50 text-green-400 rounded transition-colors"
                                title="Approve KYC"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => openRejectModal(kyc._id)}
                                className="p-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded transition-colors"
                                title="Reject KYC"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        {kyc.image && (
                          <button
                            className="p-2 bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 rounded transition-colors"
                            title="View Documents"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && kycData?.length === 0 && (
          <div className="p-12 text-center">
            <UsersIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycSubmission;