import { Check, Crown, Lock, Search, Shield, Trash2, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { useDeleteAdminMutation, useGetAdminQuery } from '../../../redux/features/user/userApi';
import { Button } from '../../ui/button';
import AddAdminForm from './AddAdminForm';

type AdminRole = 'Super Admin' | 'Admin';
type AdminStatus = 'Active' | 'Inactive';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}



export default function AdminManage() {
    const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@investorshub.com',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: '2 hours ago',
      createdAt: '2023-01-15',
      permissions: ['all']
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john.smith@investorshub.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '1 day ago',
      createdAt: '2023-06-20',
      permissions: ['users', 'stock', 'requests', 'notifications']
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRole | 'All'>('All');

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'Admin' as AdminRole,
    password: '',
    confirmPassword: ''
  });

  const {data: adminData, isLoading} = useGetAdminQuery({});
  const [deleteAdmin] = useDeleteAdminMutation();


  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || admin.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert('Please fill all required fields');
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const admin: Admin = {
      id: admins.length + 1,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      status: 'Active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: newAdmin.role === 'Super Admin' ? ['all'] : 
                   newAdmin.role === 'Admin' ? ['users', 'stock', 'requests', 'notifications'] :
                   ['requests', 'notifications']
    };

    setAdmins([...admins, admin]);
    setShowAddModal(false);
    setNewAdmin({ name: '', email: '', role: 'Admin', password: '', confirmPassword: '' });
  };

  const handleDeleteAdmin = (id: number) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setAdmins(admins.map(admin => 
      admin.id === id 
        ? { ...admin, status: admin.status === 'Active' ? 'Inactive' : 'Active' as AdminStatus }
        : admin
    ));
  };

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
                <th className="text-left p-4 text-gray-400 font-medium text-sm">Last Login</th>

                <th className="text-left p-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminData?.map((admin:any) => (
                <tr
                  key={admin?._id}                 
                  className="border-b border-primary/10 hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {admin?.name.split(' ').map((n:any) => n[0]).join('').slice(0, 2)}
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
                    <p className="text-gray-500 text-xs">Joined {admin?.createdAt}</p>
                  </td>                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">                      
                      {admin.role !== 'Super Admin' && (
                        <button
                          onClick={() => {
                            setAdminToDelete(admin);
                            setShowDeleteModal(true);
                          }}
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