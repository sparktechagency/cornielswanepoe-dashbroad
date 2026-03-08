import { Bell, Clock, Menu, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import { useState } from "react";
import { Button } from "../ui/button";


import {
  Building2,
  ChevronDown,
  CreditCard,
  LogOut,
  MessageSquare,
  Settings,
  User
} from 'lucide-react';
import { useGetProfileQuery } from "../../redux/features/user/userApi";
import { imageUrl } from "../../redux/base/baseAPI";
const Navbar = () => {  
  const navigate = useNavigate();  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState(5);
  const {data: profileData} = useGetProfileQuery({});
  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  console.log("profileData", profileData);
  

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0A] border-b border-primary/20">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <Button          
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Mobile Logo */}
        <div className="">
          <div className={`flex items-center justify-center gap-3`}>
            <img
              src="/logo.png"
              alt="Investors Hub"
              className=" w-20"
            />
          </div>
        </div>


        {/* Spacer for layout */}
        <div className="hidden lg:block flex-1"></div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {notifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-96 bg-[#1A1A1A] border border-primary/20 rounded-lg shadow-xl z-20 overflow-hidden max-h-[500px] flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b border-primary/20 flex items-center justify-between">
                    <h3 className="text-white font-medium">Notifications</h3>
                    <button className="text-xs text-primary hover:underline">
                      Mark all as read
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto flex-1">
                    {/* New User Registration */}
                    <div className="p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">New User Registration</p>
                          <p className="text-gray-400 text-xs mt-1">John Smith just registered for a Premium account</p>
                          <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            5 minutes ago
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                      </div>
                    </div>

                    {/* Property Listed */}
                    <div className="p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">New Property Listed</p>
                          <p className="text-gray-400 text-xs mt-1">Investor042 listed "Coastal Villa" worth $5M</p>
                          <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            2 hours ago
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                      </div>
                    </div>

                    {/* Payment Received */}
                    <div className="p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">Payment Received</p>
                          <p className="text-gray-400 text-xs mt-1">Premium subscription payment of $99 received</p>
                          <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            3 hours ago
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* New Request */}
                    <div className="p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">New Investment Request</p>
                          <p className="text-gray-400 text-xs mt-1">Developer009 posted request for hotel assets</p>
                          <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            5 hours ago
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* System Update */}
                    <div className="p-4 hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center flex-shrink-0">
                          <Settings className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">System Update</p>
                          <p className="text-gray-400 text-xs mt-1">Dashboard analytics updated with new metrics</p>
                          <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            1 day ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-primary/20 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-primary hover:underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
            >
              <img src={profileData?.image ? imageUrl + profileData.image : "/placeholder.png"} alt="Profile" className="w-10 h-10 rounded-full object-cover"  />
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">{profileData?.name}</p>
                <p className="text-gray-400 text-xs">{profileData?.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-[#1A1A1A] border border-primary/20 rounded-lg shadow-xl z-20 overflow-hidden">
                  <div className="p-4 border-b border-primary/20">
                    <p className="text-white font-medium text-sm">{profileData?.name}</p>
                    <p className="text-gray-400 text-xs">{profileData?.email}</p>
                  </div>

                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">My Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </Link>
                  <div className="border-t border-primary/20" />

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;