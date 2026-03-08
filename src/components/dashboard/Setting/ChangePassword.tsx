import { Eye, EyeOff, Lock } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from '../../ui/button';
import { useChangePasswordMutation } from '../../../redux/features/auth/authApi';
import { toast } from 'sonner';

const ChangePassword = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isSaving, setIsSaving] = useState(false);
    
    const [changePassword] = useChangePasswordMutation();

    const handleChangePassword = async() => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

       try {
        const response = await changePassword(passwordData)?.unwrap();

        if(response?.success){
            toast.success(response?.message);
        }
       } catch (error:any) {
            toast.error(error?.data?.message);
       }
    };

    return (
        <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-400/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-lg font-serif text-white">Change Password</h2>
                    <p className="text-sm text-gray-400">Update your password to keep your account secure</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-primary"
                            placeholder="Enter current password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-primary"
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                </div>

                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-primary"
                            placeholder="Confirm new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={handleChangePassword}
                        disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Lock className="w-4 h-4" />
                        {isSaving ? 'Updating...' : 'Change Password'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword