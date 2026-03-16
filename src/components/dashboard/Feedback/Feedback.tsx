import {
  MessageSquare,
  Star,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";


import Loader from "../../Shared/Loader";
import { useDeleteFeedbackMutation, useGetFeedbacksQuery, useToggleFeedbackStatusMutation } from "../../../redux/features/feedback/feedbackApi";
import FeedbackDetailModal from "./FeedbackDetailModal";


// ─── Star Rating Display ──────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600 fill-gray-600"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-400">({rating}/5)</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Feedbacks() {
  const [viewTarget, setViewTarget] = useState<any | null>(null);

  const { data: feedbacksData, isLoading } = useGetFeedbacksQuery({});
  const [deleteFeedback] = useDeleteFeedbackMutation();
  const [toggleFeedbackStatus] = useToggleFeedbackStatusMutation();


  console.log(feedbacksData);
  const handleToggleStatus = async (feedback: any) => {
    try {
      const response = await toggleFeedbackStatus({
        id: feedback._id,
        status: feedback.status === "active" ? "inactive" : "active",
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      theme: "dark",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteFeedback(id).unwrap();
        if (response?.success) {
          toast.success(response?.message);
        }
      } catch (error: any) {
        toast.error(error?.data?.message);
      }
    }
  };

  return (
    <div className="p-5">
      {/* Detail Modal */}
      {viewTarget && (
        <FeedbackDetailModal
          feedback={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif text-white mb-1">
            Feedback Management
          </h1>
          <p className="text-sm text-gray-400">
            Manage and moderate user feedback & reviews
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20 bg-[#1A1A1A]">
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Title
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Comment
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Rating
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Created At
                </th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex items-center justify-center h-20">
                      <Loader color="#fff" size={30} />
                    </div>
                  </td>
                </tr>
              ) : (
                feedbacksData?.data?.map((fb: any) => (
                  <tr
                    key={fb._id}
                    className="border-b border-primary/10 hover:bg-[#1A1A1A] transition-colors"
                  >
                    {/* Title + Icon */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-white font-medium text-sm">
                          {fb.title}
                        </p>
                      </div>
                    </td>

                    {/* Comment (truncated) */}
                    <td className="p-4 max-w-[220px]">
                      <p className="text-sm text-gray-400 truncate">
                        {fb.comment}
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="p-4">
                      <StarRating rating={fb.rating} />
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium ${
                          fb.status === "active"
                            ? "bg-green-400/10 text-green-400"
                            : "bg-gray-400/10 text-gray-400"
                        }`}
                      >
                        {fb.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Created At */}
                    <td className="p-4">
                      <span className="text-sm text-gray-400">
                        {new Date(fb.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* View */}
                        <button
                          onClick={() => setViewTarget(fb)}
                          className="p-2 bg-purple-400/10 text-purple-400 rounded hover:bg-purple-400/20 transition-colors"
                          title="View Feedback"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Toggle Active/Inactive */}
                        <button
                          onClick={() => handleToggleStatus(fb)}
                          className={`p-2 rounded transition-colors ${
                            fb.status === "active"
                              ? "bg-green-400/10 text-green-400 hover:bg-green-400/20"
                              : "bg-gray-400/10 text-gray-400 hover:bg-gray-400/20"
                          }`}
                          title={fb.status === "active" ? "Inactive" : "Activate"}
                        >
                          {fb.status === "active" ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(fb._id)}
                          className="p-2 bg-red-400/10 text-red-400 rounded hover:bg-red-400/20 transition-colors"
                          title="Delete Feedback"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!isLoading && feedbacksData?.data?.length === 0 && (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No feedbacks found</p>
          </div>
        )}
      </div>
    </div>
  );
}