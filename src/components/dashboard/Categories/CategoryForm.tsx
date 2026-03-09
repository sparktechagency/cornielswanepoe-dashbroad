import { useEffect, useState } from "react";

import { useAddCategoryMutation, useUpdateCategoryMutation } from "../../../redux/features/categoryApi";
import { Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../ui/button";

const defaultForm = {
  name: ""
};

export default function CategoryForm({ open, onClose, editData }: any) {
  const isEdit = !!editData;

  const [form, setForm] = useState(defaultForm);

  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name    
      });
    } else {
      setForm(defaultForm);
    }
  }, [editData]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (isEdit) {
        const res = await updateCategory({
          id: editData._id,
          ...form,
        }).unwrap();

        if (res?.success) {
          toast.success(res?.message ?? "Category updated");
          onClose();
        }
      } else {
        const res = await addCategory(form).unwrap();

        if (res?.success) {
          toast.success(res?.message ?? "Category created");
          onClose();
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0A0A0A] border border-primary/30 rounded-xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-white">
            {isEdit ? "Edit Category" : "Add New Category"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Category Name *
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Residential, Commercial…"
              className="w-full bg-[#111111] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
            />
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            type="submit"
            size="lg"
            className="flex-1 flex items-center justify-center gap-2"
          >
            {isEdit ? (
              <>
                <Pencil className="w-4 h-4" /> Update Category
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Category
              </>
            )}
          </Button>

          <Button
            type="button"
            size="lg"
            onClick={onClose}
            className="flex-1 bg-[#1A1A1A] text-white border border-primary/20 hover:bg-[#2A2A2A]"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}