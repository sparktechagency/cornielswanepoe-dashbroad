import {
  FileText,
  Plus
} from "lucide-react";
import { useState } from "react";

import { useGetBriefsQuery } from "../../../redux/features/brief/briefApi";

import { Button } from "../../ui/button";
import AddBrief from "./AddBrief";
import BriefCard from "./BriefCard";

// ← recommended: move interface to separate file

// ────────────────────────────────────────────────
// Optional: move to types.ts / interfaces.ts
// interface Brief {
//   _id: string;
//   name: string;
//   description: string;
//   image: string;
//   status: "active" | "inactive";
//   createdAt: string;
// }
// ────────────────────────────────────────────────

export default function InvestorBrief() {
  const [showModal, setShowModal] = useState(false);
  const [editingBrief, setEditingBrief] = useState<any | null>(null);

  const { data: briefData, isLoading } = useGetBriefsQuery({});
  const briefs: any[] = briefData?.data || [];

  // Handlers
  const handleCreateNew = () => {
    setEditingBrief(null);
    setShowModal(true);
  };

  const handleEdit = (brief: any) => {
    setEditingBrief(brief);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this brief?")) return;
    console.log("delete id:", id);
    // TODO: dispatch delete mutation here
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-white">
        Loading briefs...
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white mb-1">
            Investor Brief Management
          </h1>
          <p className="text-sm text-gray-400">
            Create and manage investor briefs for your users
          </p>
        </div>

        <Button onClick={handleCreateNew} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create New Brief
        </Button>
      </div>

      {/* Main content */}
      {briefs.length === 0 ? (
        <EmptyState onCreate={handleCreateNew} />
      ) : (
        <BriefGrid
          briefs={briefs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <AddBrief
          open={showModal}
          onClose={() => setShowModal(false)}
          brief={editingBrief}
        />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────
// Extracted Components
// ────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-16">
      <FileText className="mx-auto h-16 w-16 text-gray-600 mb-4" />
      <p className="text-gray-400 mb-6">No briefs created yet</p>
      <Button onClick={onCreate} size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Create First Brief
      </Button>
    </div>
  );
}

interface BriefGridProps {
  briefs: any[];
  onEdit: (brief: any) => void;
  onDelete: (id: string) => void;
}

function BriefGrid({ briefs, onEdit, onDelete }: BriefGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {briefs.map((brief) => (
        <BriefCard
          key={brief._id}
          brief={brief}
          onEdit={() => onEdit(brief)}
          onDelete={() => onDelete(brief._id)}
        />
      ))}
    </div>
  );
}


