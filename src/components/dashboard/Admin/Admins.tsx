import { Shield, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useDeleteAdminMutation, useGetAdminQuery } from '../../../redux/features/user/userApi';
import { Button } from '../../ui/button';
import AddAdminForm from './AddAdminForm';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { FormatDate } from '../../Shared/FormatDate';

type AdminRole = 'Super Admin' | 'Admin';
type AdminStatus = 'Active' | 'Inactive';

export default function AdminManage() {

  const [showAddModal, setShowAddModal] = useState(false);
  const { data: adminData } = useGetAdminQuery({});
  const [deleteAdmin] = useDeleteAdminMutation();

  const getRoleColor = (role: AdminRole) => {
    switch (role) {
      case 'Super Admin': return 'text-primary bg-primary/10 border-primary/30';
      case 'Admin': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    }
  };

  const getStatusColor = (status: AdminStatus) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400/10';
      case 'Inactive': return 'text-gray-400 bg-gray-400/10';
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    const result = await Swal.fire({
      title: "Delete Admin?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#1f2937", // dark background
      color: "#fff", // text color
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteAdmin(adminId).unwrap();

        if (response?.success) {
          toast.success(response?.message);
        }

      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error?.data?.message,
          icon: "error",
          background: "#1f2937",
          color: "#fff",
        });
      }
    }
  };
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-serif text-white mb-1">Admin Management</h1>
            <p className="text-sm text-gray-400">Manage administrator accounts (Super Admin can add new admins)</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            size="lg"
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add New Admin
          </Button>
        </div>

      </div>

      {/* Admins Table */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left p-4 text-gray-400 font-medium text-sm">Admin</th>
                <th className="text-left p-4 text-gray-400 font-medium text-sm">Role</th>
                <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-left p-4 text-gray-400 font-medium text-sm">Join Date</th>

                <th className="text-left p-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminData?.map((admin: any) => (
                <tr
                  key={admin?._id}
                  className="border-b border-primary/10 hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {admin?.name.split(' ').map((n: any) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{admin?.name}</p>
                        <p className="text-gray-400 text-sm">{admin?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(admin?.role)}`}>
                      {admin?.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(admin?.status)}`}>
                      {admin?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-200 text-md">{FormatDate(admin?.createdAt)}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {admin.role !== 'Super Admin' && (
                        <button
                          onClick={() => handleDeleteAdmin(admin?._id)}
                          className="p-2 hover:bg-red-400/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {adminData?.length === 0 && (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No Admins Found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <AddAdminForm open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>

  );
}