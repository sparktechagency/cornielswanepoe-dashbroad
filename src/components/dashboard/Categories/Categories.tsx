import {
  Layers,
  Pencil,
  Plus,
  Tag,
  Trash2
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "../../ui/button";

import { useDeleteCategoryMutation, useGetCategoriesQuery } from "../../../redux/features/categoryApi";
import Loader from "../../Shared/Loader";
import CategoryForm from "./CategoryForm";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}




// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Categories() {  
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  
  const { data: categoriesData, isLoading } = useGetCategoriesQuery({});
  const [deleteCategory] = useDeleteCategoryMutation();

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      theme: "dark",
    });

    if (result.isConfirmed) {
      try {

        const response = await deleteCategory(id).unwrap();
        if(response?.success){
          toast.success(response?.message);
        }        
      } catch(error:any) {
       toast.error(error?.data?.message)
      }
    }
  };

  return (
    <div className="p-5">
      {/* Modal */}
      <CategoryForm open={modalOpen} onClose={() => setModalOpen(false)} editData={editTarget} />
       

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif text-white mb-1">
            Category Management
          </h1>
          <p className="text-sm text-gray-400">
            Organise your platform content with categories
          </p>
        </div>
        <Button
          onClick={openAdd}
          size="lg"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20 bg-[#1A1A1A]">
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Category
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
                categoriesData?.map((cat:any) => (
                  <tr
                    key={cat._id}
                    className="border-b border-primary/10 hover:bg-[#1A1A1A] transition-colors"
                  >
                    {/* Category Name + Icon */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {cat.icon ? (
                            <img
                              src={cat.icon}
                              alt={cat.name}
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <Tag className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium text-md">
                            {cat.name}
                          </p>                         
                        </div>
                      </div>
                    </td>
                   

                    {/* Created At */}
                    <td className="p-4">
                      <span className="text-sm text-gray-400">
                        {new Date(cat.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 bg-blue-400/10 text-blue-400 rounded hover:bg-blue-400/20 transition-colors"
                          title="Edit Category"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 bg-red-400/10 text-red-400 rounded hover:bg-red-400/20 transition-colors"
                          title="Delete Category"
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
        {!isLoading && categoriesData.length === 0 && (
          <div className="p-12 text-center">
            <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              No categories found matching your criteria
            </p>
          </div>
        )}
      </div>

    </div>
  );
}