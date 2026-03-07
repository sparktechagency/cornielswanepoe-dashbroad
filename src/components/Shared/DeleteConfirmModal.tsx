import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    description,
    itemName,
    isLoading = false,
}: DeleteConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] border border-[#D4AF37]/20 rounded-lg p-6 max-w-md w-full">

                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <Trash2 className="w-5 h-5 text-red-400" />
                    </div>

                    <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
                </div>

                <p className="text-sm text-gray-400 mb-6">
                    {description ?? (
                        <>
                            Are you sure you want to delete{" "}
                            {itemName && (
                                <span className="text-white font-medium">"{itemName}"</span>
                            )}
                            ? This action cannot be undone.
                        </>
                    )}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-[#1A1A1A] text-white border border-[#D4AF37]/30 rounded-lg hover:border-[#D4AF37] hover:bg-[#2A2A2A] transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}