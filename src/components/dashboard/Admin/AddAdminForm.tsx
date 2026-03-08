import { Eye, EyeOff, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { useCreateAdminMutation } from "../../../redux/features/user/userApi";
import { toast } from "sonner";

interface AddAdminFormProps {
  open: boolean;
  onClose: () => void;
}

export default function AddAdminForm({ open, onClose }: AddAdminFormProps) {  
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'ADMIN',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [addAdmin] = useCreateAdminMutation();

  if (!open) return;

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(newAdmin.password !== newAdmin.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const data = {
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: newAdmin.role,
        password: newAdmin.password
      }
      const response = await addAdmin(data)?.unwrap();
      if (response?.success) {
        toast.success(response?.message);
        onClose();
      }
    } catch (error:any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"        
      >
        <div
          className="bg-[#0A0A0A] border border-primary/30 rounded-xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif text-white">Add New Admin</h2>
            <button
              onClick={()=>onClose()}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
              <input
                type="text"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full bg-[#111111] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
              />
            </div>
                        <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="admin@investorshub.com"
                className="w-full bg-[#111111] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={newAdmin.phone}
                onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full bg-[#111111] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full bg-[#111111] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={newAdmin.confirmPassword}
                  onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                  className="w-full bg-[#111111] border border-primary/40 rounded-lg px-4 py-3 text-white focus:border-primary outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          <div className="flex gap-3 mt-6">
            <Button
              size="lg"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Admin
            </Button>
            <Button
              size="lg"
              className="flex-1 px-4 py-3 bg-[#1A1A1A] text-white border border-primary/20 rounded-lg hover:bg-[#2A2A2A] transition-all"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}