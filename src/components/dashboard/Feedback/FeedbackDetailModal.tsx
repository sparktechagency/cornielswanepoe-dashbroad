import { Star, X } from "lucide-react";

interface Feedback {
  _id: string;
  title: string;
  comment: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  feedback: Feedback;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600 fill-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

export default function FeedbackDetailModal({ feedback, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111111] border border-primary/20 rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <h2 className="text-lg font-serif text-white">Feedback Detail</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Title
            </p>
            <p className="text-white font-medium">{feedback.title}</p>
          </div>

          {/* Comment */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Comment
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {feedback.comment}
            </p>
          </div>

          {/* Rating */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Rating
            </p>
            <StarRating rating={feedback.rating} />
          </div>

          {/* Status & Date */}
          <div className="flex items-center justify-between pt-2 border-t border-primary/10">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                feedback.isActive
                  ? "bg-green-400/10 text-green-400"
                  : "bg-gray-400/10 text-gray-400"
              }`}
            >
              {feedback.isActive ? "Active" : "Inactive"}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}