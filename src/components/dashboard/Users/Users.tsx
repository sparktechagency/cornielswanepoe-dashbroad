import { AlertCircle, Briefcase, Building2, CheckCircle, Clock, Lock, Search, Shield, TrendingUp, Unlock, UserCheck, Users as UsersIcon, UserX, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useGetUsersQuery, useUpdateUserMutation } from '../../../redux/features/user/userApi';
import { getSearchParams } from '../../../utils/getSearchParams';
import { useUpdateSearchParams } from '../../../utils/updateSearchParams';
import Loader from '../../Shared/Loader';
import ManagePagination from '../../Shared/ManagePagination';


export default function Users() {
  const { data: usersData, isLoading, refetch } = useGetUsersQuery({});
  const [updateUser] = useUpdateUserMutation();

  const updateSearchParams = useUpdateSearchParams();
  const { searchTerm, role, page } = getSearchParams();

  useEffect(() => {
    // setSearchText(searchTerm);
    refetch()
  }, [searchTerm, role, page]);

  const handleUserStatus = async (id: string, status: string) => {
    const actionText = status === "active" ? "activate" : "block";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to ${actionText} this user!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText} it!`,      
      theme: 'dark'
    });

    if (result.isConfirmed) {
      try {
        await updateUser({
          id,
          status
        }).unwrap();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: `User has been ${actionText}d successfully.`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong!",
        });
      }
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'INVESTOR':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/10 text-green-400 rounded text-xs font-medium">
            <TrendingUp className="w-3 h-3" /> Investor
          </span>
        );
      case 'SELLER':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-400/10 text-blue-400 rounded text-xs font-medium">
            <Building2 className="w-3 h-3" /> Seller
          </span>
        );
      case 'DEVELOPER':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-400/10 text-purple-400 rounded text-xs font-medium">
            <Building2 className="w-3 h-3" /> Developer
          </span>
        );
      case 'AGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded text-xs font-medium">
            <Briefcase className="w-3 h-3" /> Agent
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-400/10 text-red-400 rounded text-xs font-medium">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-400/10 text-gray-400 rounded text-xs font-medium">
            {role}
          </span>
        );
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/10 text-green-400 rounded text-xs">
            <CheckCircle className="w-3 h-3" /> Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-400/10 text-orange-400 rounded text-xs">
            <Clock className="w-3 h-3" /> Inactive
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-400/10 text-red-400 rounded text-xs">
            <XCircle className="w-3 h-3" /> Blocked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-400/10 text-gray-400 rounded text-xs">
            {status}
          </span>
        );
    }
  };

  const roles = ['All', 'INVESTOR', 'SELLER', 'DEVELOPER', 'AGENT'];

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-1">User Management</h1>
        <p className="text-sm text-gray-400">
          Manage all platform users by role — Investors, Sellers, Developers, and Agents
        </p>
      </div>

      {/* Search and Role Filter */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              onChange={(e) => { updateSearchParams({ searchTerm: e.target.value }) }}
              placeholder="Search by email or phone"
              className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Role Filter */}
          <select
            value={role}
            onChange={(e) => { updateSearchParams({ role: e.target.value }) }}
            className="w-44 bg-[#1A1A1A] border border-primary/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
          >
            {roles.map((role) => (
              <option key={role} value={role === 'All' ? '' : role}>
                {role === 'All' ? 'All Roles' : role.charAt(0) + role.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20 bg-[#1A1A1A]">
                <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Role</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Phone</th>
                <th className="text-center p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-center p-4 text-sm font-medium text-gray-400">KYC</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7}><div className="flex items-center justify-center h-20"><Loader color="#fff" size={30} /></div></td></tr> : usersData.data.map((user: any) => (
                <tr
                  key={user._id}
                  className="border-b border-primary/10 hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* User Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-medium text-sm">
                              {user.name
                                .split(' ')
                                .map((n: any) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                        {/* Online dot */}
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#111111] ${user.onlineStatus?.isOnline ? 'bg-green-400' : 'bg-gray-500'
                            }`}
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-gray-500 text-xs">ID: {user._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4">{getRoleBadge(user.role)}</td>

                  {/* Email */}
                  <td className="p-4">
                    <span className="text-sm text-gray-300">{user.email}</span>
                  </td>

                  {/* Phone */}
                  <td className="p-4">
                    <span className="text-sm text-gray-300">{user.phone}</span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      {getStatusDisplay(user.status)}
                    </div>
                  </td>

                  {/* KYC */}
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      {user.isKycVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/10 text-green-400 rounded text-xs">
                          <Shield className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-400/10 text-orange-400 rounded text-xs">
                          <AlertCircle className="w-3 h-3" /> Unverified
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Approve — show when status is inactive/pending */}
                      {user.status !== 'active' && user.status !== 'blocked' && (
                        <button
                          className="p-2 bg-green-400/10 text-green-400 rounded hover:bg-green-400/20 transition-colors"
                          title="Approve User"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}

                      {/* Reject — show when status is inactive/pending */}
                      {user.status !== 'active' && user.status !== 'blocked' && (
                        <button
                          className="p-2 bg-red-400/10 text-red-400 rounded hover:bg-red-400/20 transition-colors"
                          title="Reject User"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}

                      {/* Block / Unblock — conditionally shown */}
                      {user.status === 'blocked' ? (
                        <button
                          onClick={() => handleUserStatus(user._id, "active")}
                          className="cursor-pointer p-2 bg-blue-400/10 text-blue-400 rounded hover:bg-blue-400/20 transition-colors"
                          title="Unblock User"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserStatus(user._id, "blocked")}
                          className="cursor-pointer p-2 bg-red-400/10 text-red-400 rounded hover:bg-red-400/20 transition-colors"
                          title="Block User"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {!isLoading && usersData?.data?.length === 0 && (
          <div className="p-12 text-center">
            <UsersIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No users found matching your criteria</p>
          </div>
        )}
      </div>

      <ManagePagination meta={usersData?.meta} />
    </div>
  );
}