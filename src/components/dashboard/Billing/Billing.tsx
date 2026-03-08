import {
    Calendar,
    Check,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Search,
    X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';

export default function Billing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock Recent Transactions
  const recentTransactions = [
    {
      id: 'TXN-001234',
      user: 'Michael Chen',
      email: 'michael.c@email.com',
      type: 'Subscription',
      plan: 'Premium',
      amount: 500,
      status: 'Completed',
      date: '2024-02-20 14:32',
    },
    {
      id: 'TXN-001233',
      user: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      type: 'Subscription',
      plan: 'Premium',
      amount: 500,
      status: 'Completed',
      date: '2024-02-20 12:15',
    },
    {
      id: 'TXN-001232',
      user: 'David Martinez',
      email: 'david.m@email.com',
      type: 'Renewal',
      plan: 'Premium',
      amount: 500,
      status: 'Completed',
      date: '2024-02-19 18:45',
    },
    {
      id: 'TXN-001231',
      user: 'ABC Developers Ltd',
      email: 'contact@abcdev.com',
      type: 'Subscription',
      plan: 'Premium',
      amount: 500,
      status: 'Pending',
      date: '2024-02-19 16:20',
    },
    {
      id: 'TXN-001230',
      user: 'Emma Wilson',
      email: 'emma.w@email.com',
      type: 'Refund',
      plan: 'Premium',
      amount: -500,
      status: 'Completed',
      date: '2024-02-19 10:00',
    },
    {
      id: 'TXN-001229',
      user: 'Robert Anderson',
      email: 'robert.a@email.com',
      type: 'Subscription',
      plan: 'Premium',
      amount: 500,
      status: 'Failed',
      date: '2024-02-18 21:30',
    },
  ];

  const filteredTransactions = recentTransactions.filter(txn => {
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || txn.status.toLowerCase() === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-400/10 text-green-400';
      case 'Pending':
        return 'bg-orange-400/10 text-orange-400';
      case 'Failed':
        return 'bg-red-400/10 text-red-400';
      default:
        return 'bg-gray-400/10 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Check className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Failed':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const totalRevenue = recentTransactions
    .filter(txn => txn.status === 'Completed')
    .reduce((sum, txn) => sum + txn.amount, 0);
  
  const completedCount = recentTransactions.filter(txn => txn.status === 'Completed').length;
  const pendingCount = recentTransactions.filter(txn => txn.status === 'Pending').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white mb-1">Billing & Revenue</h1>
        <p className="text-sm text-gray-400">Manage transactions and subscription revenue</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
          <p className="text-white text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-400/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-white text-3xl font-bold">{completedCount}</p>
        </div>

        <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-400/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-white text-3xl font-bold">{pendingCount}</p>
        </div>
      </div>

      {/* Subscription Tier Info */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-white font-medium">Premium Subscription</h3>
            <p className="text-gray-400 text-sm">$500 / month</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Active Subscribers</p>
            <p className="text-white font-medium text-lg">245</p>
          </div>
          <div>
            <p className="text-gray-400">Monthly Revenue</p>
            <p className="text-white font-medium text-lg">$122,500</p>
          </div>
          <div>
            <p className="text-gray-400">Features</p>
            <p className="text-white font-medium text-lg">All Access</p>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-[#111111] border border-primary/20 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl text-white font-medium">Recent Transactions</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 bg-black border border-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-black border border-primary/20 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              {/* Export */}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Transaction ID</th>
                <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">User</th>
                <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Type</th>
                <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Plan</th>
                <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Amount</th>
                <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Status</th>
                <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-white font-mono text-sm">{txn.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm font-medium">{txn.user}</p>
                    <p className="text-gray-400 text-xs">{txn.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm">{txn.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-primary text-sm font-medium">{txn.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${txn.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.abs(txn.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                      {getStatusIcon(txn.status)}
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {txn.date}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
