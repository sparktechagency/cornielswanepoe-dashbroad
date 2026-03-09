import { Calendar, Edit2, ImageIcon, Trash2 } from 'lucide-react';
import { imageUrl } from '../../../redux/base/baseAPI';
import { Button } from '../../ui/button';


interface BriefCardProps {
  brief: any;
  onEdit: () => void;
  onDelete: () => void;
}

function BriefCard({ brief, onEdit, onDelete }: BriefCardProps) {
  const formattedDate = new Date(brief.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-primary/20 bg-[#111111] transition-colors hover:border-primary/40">
      {/* Image + Status */}
      <div className="relative h-48 bg-[#1A1A1A]">
        {brief.image ? (
          <img
            src={`${imageUrl}${brief.image}`}
            alt={brief.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-600" />
          </div>
        )}

        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              brief.status === "active"
                ? "border-green-400/20 bg-green-400/10 text-green-400"
                : "border-gray-400/20 bg-gray-400/10 text-gray-400"
            }`}
          >
            {brief.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 font-medium text-white">
          {brief.name}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-400">
          {brief.description}
        </p>

        <div className="mb-4 flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="h-4 w-4" />
          <time dateTime={brief.createdAt}>{formattedDate}</time>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 text-black!"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="border-red-400/20 text-red-400 hover:bg-red-400/10 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BriefCard