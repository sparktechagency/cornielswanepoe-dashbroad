
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { imageUrl } from "../../../redux/base/baseAPI";



function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return dateStr.slice(0, 10); // "YYYY-MM-DD"
}

function getStatusStyle(status?: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-500/20 text-green-400 border border-green-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    case "inactive":
    case "rejected":
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  }
}

function getCategoryLabel(title: string, category?: string) {
  if (category) return category.toUpperCase();
  if (title.toLowerCase().includes("land")) return "AGRICULTURAL";
  if (title.toLowerCase().includes("villa") || title.toLowerCase().includes("house"))
    return "RESIDENTIAL";
  if (title.toLowerCase().includes("commercial")) return "COMMERCIAL";
  return "PROPERTY";
}

export default function MyStockCard({
  item,
  canExpressInterest,
  setSelectStock,
  setOpenUpdateForm,
  setDeleteModal,
  viewCount = 0,
  interestCount = 0,
  index = 1,
}: {
  item: any;
  canExpressInterest: boolean;
  setSelectStock: any;
  setOpenUpdateForm: any;
  setDeleteModal?: any,
  viewCount?: number;
  interestCount?: number;
  index?: number;
}) {
  const displayImage = item.images?.[0];

  return (
    <div className="bg-[#111111] border border-white/8 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row  gap-4 p-4">
        <Link
          to={`/user-dashboard/my-listing/stock/${item._id}`}
          className="relative flex-shrink-0 w-full aspect-5/3 md:w-[120px] md:h-[80px] rounded-lg overflow-hidden block"
        >
          <img
            src={item.images?.length ? imageUrl + displayImage : "/placeholder.png"}
            alt={item.title}            
            className={`object-cover group-hover:scale-105 transition-transform duration-500 `}
            sizes="250px"
          />
        </Link>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-1">
            <Link to={`/user-dashboard/my-listing/stock/${item._id}`}>
              <h3 className="text-white font-semibold text-base hover:text-primary transition-colors truncate max-w-[260px]">
                {item.title}
              </h3>
            </Link>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${getStatusStyle(
                item.status
              )}`}
            >
              {item.status ?? "unknown"}
            </span>

            

            {item?.isBlur ? (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-black-400 border border-blue-500/30 flex items-center gap-1 w-fit">
                <EyeOff className="w-3 h-3" />
                Blur
              </span>
            ): (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-black-400 border border-yellow-500/30 flex items-center gap-1 w-fit">
                <Eye className="w-3 h-3" />
                Unblur
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm line-clamp-1 mb-3">
            {item.description}
          </p>

          {/* Info columns */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">
                Price
              </p>
              <p className="text-white text-sm font-semibold">
                R {Number(item.price).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">
                Location
              </p>
              <p className="text-white text-sm truncate">{item.location}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">
                Posted
              </p>
              <p className="text-white text-sm">{formatDate(item.createdAt)}</p>
            </div>
          </div>

          {/* Footer meta */}
          <div className="flex  items-center  gap-4 mt-3 text-gray-500 text-xs">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {viewCount} views
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>{interestCount} interests</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>ID: {index}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex gap-1 justify-center items-start flex-shrink-0 ml-2">
          <Link
            to={`/user-dashboard/my-listing/stock/${item._id}`}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              setSelectStock(item);
              setOpenUpdateForm(true);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setSelectStock(item);
              setDeleteModal(true);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}