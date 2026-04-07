'use client';

import { useState, useMemo } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  plan: 'free' | 'premium';
  reads: number;
  joined: string;
}

const INITIAL_USERS: User[] = [
  { id: 0, name: 'Sofia Rios', email: 'sofia@school.edu', plan: 'premium', reads: 12, joined: 'Jan 2025' },
  { id: 1, name: 'Marcos López', email: 'marcos@gmail.com', plan: 'premium', reads: 8, joined: 'Feb 2025' },
  { id: 2, name: 'Ana Torres', email: 'ana@colegio.pe', plan: 'free', reads: 3, joined: 'Feb 2025' },
  { id: 3, name: 'Diego Fuentes', email: 'diego@gmail.com', plan: 'free', reads: 1, joined: 'Mar 2025' },
  { id: 4, name: 'Lucy Park', email: 'lucy@school.edu', plan: 'premium', reads: 15, joined: 'Jan 2025' },
  { id: 5, name: 'Carlos Vega', email: 'carlos@gmail.com', plan: 'free', reads: 5, joined: 'Mar 2025' },
  { id: 6, name: 'Mia Chen', email: 'mia@school.com', plan: 'premium', reads: 9, joined: 'Feb 2025' },
  { id: 7, name: 'Tom Rivera', email: 'tom@gmail.com', plan: 'free', reads: 2, joined: 'Mar 2025' },
];

export default function UsersPage() {
  const [usersData, setUsersData] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Create user form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserPlan, setNewUserPlan] = useState<'free' | 'premium'>('free');

  // Calculate filtered users
  const filteredUsers = useMemo(() => {
    return usersData.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = planFilter === 'all' || user.plan === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [searchQuery, planFilter, usersData]);

  const toggleUserPlan = (id: number) => {
    const updatedUsers = usersData.map(user => {
      if (user.id === id) {
        const newPlan: 'free' | 'premium' = user.plan === 'premium' ? 'free' : 'premium';
        showToast(`${user.name} is now ${newPlan}`);
        return { ...user, plan: newPlan };
      }
      return user;
    });
    setUsersData(updatedUsers);
  };

  const createUser = () => {
    // Validations
    if (!newUserName.trim()) {
      showToast('⚠️ Please enter user name');
      return;
    }
    if (!newUserEmail.trim()) {
      showToast('⚠️ Please enter user email');
      return;
    }
    if (!newUserPassword.trim()) {
      showToast('⚠️ Please enter user password');
      return;
    }

    // Check if email already exists
    const emailExists = usersData.some(u => u.email.toLowerCase() === newUserEmail.toLowerCase());
    if (emailExists) {
      showToast('⚠️ Email already registered');
      return;
    }

    // Create new user
    const newUser: User = {
      id: usersData.length,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      plan: newUserPlan,
      reads: 0,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setUsersData([...usersData, newUser]);
    showToast(`✅ User "${newUserName}" created successfully!`);
    
    // Reset form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserPlan('free');
    setShowCreateForm(false);
  };

  const cancelCreateUser = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserPlan('free');
    setShowCreateForm(false);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-ink">Users</h2>
        <p className="text-sm text-inkm">View and manage registered users</p>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-cream2 p-6 mb-4">
          <div className="font-display font-semibold text-ink mb-4">
            ➕ Create new user
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="e.g. user@example.com"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">
                Plan
              </label>
              <select
                value={newUserPlan}
                onChange={(e) => setNewUserPlan(e.target.value as 'free' | 'premium')}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={createUser}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white bg-orange hover:bg-oranged hover:-translate-y-0.5 transition-all shadow-[0_3px_10px_rgba(255,107,53,.3)]"
            >
              ✅ Create user
            </button>
            <button
              onClick={cancelCreateUser}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-inkm border-2 border-cream2 hover:border-cream3 hover:bg-cream transition-all"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
        {/* Header with search and filters */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream2 flex-wrap gap-3">
          <span className="font-display font-semibold text-ink">
            All users (<span>{filteredUsers.length}</span>)
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange hover:bg-oranged transition-all"
            >
              ➕ Add user
            </button>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-inkm text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search users…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 rounded-xl border border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all w-44"
              />
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as 'all' | 'free' | 'premium')}
              className="px-3 py-2 rounded-xl border border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all"
            >
              <option value="all">All plans</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream2 bg-cream text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm">User</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm">Plan</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm hidden sm:table-cell">Stories read</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm hidden md:table-cell">Joined</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream2">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-inkm">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#F8F5F0] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange/12 flex items-center justify-center text-sm font-bold text-oranged shrink-0">
                          {user.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-ink text-sm">{user.name}</div>
                          <div className="text-xs text-inkm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleUserPlan(user.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                          user.plan === 'premium'
                            ? 'bg-orange/12 text-oranged border-orange/20 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                            : 'bg-cream text-inkm border-cream2 hover:bg-mint/10 hover:text-green-700 hover:border-mint/40'
                        }`}
                      >
                        {user.plan === 'premium' ? '⭐ Premium' : '🌱 Free'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell text-sm text-inkm">
                      {user.reads}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-sm text-inkm">
                      {user.joined}
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-inks bg-cream border border-cream2 hover:border-cream3 hover:bg-white transition-all">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast notification */}
      {toastVisible && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-ink text-white text-sm font-medium px-5 py-3.5 rounded-2xl shadow-xl border-l-4 border-mint animate-in fade-in slide-in-from-top-4 duration-300">
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
