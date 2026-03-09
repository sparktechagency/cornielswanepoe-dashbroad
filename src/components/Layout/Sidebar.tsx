import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Building2,
  CheckCircle,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  Settings,
  UserCog,
  Users,
  Box
} from 'lucide-react';
import { useState } from "react";

// ───────────────── Children ───────────────────────────────
// Types
// interface SidebarItemChild {
//   path: string;
//   icon?: React.ReactNode;
//   label: string;
// }

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/users', icon: Users, label: 'User Management' },
  { path: '/admins', icon: UserCog, label: 'Admin Management' },
  { path: '/approvals', icon: CheckCircle, label: 'Approval', badge: 5 },
  { path: '/requests', icon: MessageSquare, label: 'Requests Board' },
  { path: '/categories', icon: Box, label: 'Categories' },
  { path: '/stocks', icon: Building2, label: 'Stocks' },
  { path: '/billing', icon: CreditCard, label: 'Billing & Revenue' },
  { path: '/investor-brief', icon: Newspaper, label: 'Investor Brief' },
  { path: '/cms', icon: FileText, label: 'CMS Editor' },
  { path: '/settings', icon: Settings, label: 'Settings' }
];
// ────────────────────────────────────────────────
export default function Sidebar() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const location = useLocation()
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  return (
    <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0A0A0A] border-r border-primary/20 
        flex flex-col z-50 transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Admin Header */}
      <div className="p-6 border-b border-primary/20">
        <div className={`flex items-center justify-center gap-3`}>
          <img
            src="/logo.png"
            alt="Investors Hub"
            className=" w-30"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${active
                    ? 'bg-primary/20 text-primary border border-primary'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                  }
                  `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-primary/20 space-y-2">
        {/* <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition-all"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">View Website</span>
          </Link> */}
        <button
          onClick={() => {            
            handleLogout();
          }}
          className="w-full bg-transparent  flex items-center  gap-3 px-4 py-3 text-red-500 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </aside>
  );
}