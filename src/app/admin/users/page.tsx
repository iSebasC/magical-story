'use client';

import { useState, useMemo, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium';
  accountType: 'school' | 'parent';
  reads: number;
  joined: string;
}

export default function UsersPage() {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Create user form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserPlan, setNewUserPlan] = useState<'free' | 'premium'>('free');
  const [newUserAccountType, setNewUserAccountType] = useState<'school' | 'parent'>('parent');

  // Edit user modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserPlan, setEditUserPlan] = useState<'free' | 'premium'>('free');
  const [editUserAccountType, setEditUserAccountType] = useState<'school' | 'parent'>('parent');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error('Sin conexión al API (¿Falta SUPABASE_SERVICE_ROLE_KEY en el .env?)');
      }
      
      if (data.success) {
        setUsersData(data.users);
      } else {
        showToast('❌ Error Backend: ' + (data.error || 'Autenticación API fallida'));
      }
    } catch (error: any) {
      console.error(error);
      showToast('⚠️ ' + (error.message || 'Fallo de conexión al API'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate filtered users
  const filteredUsers = useMemo(() => {
    return usersData.filter(user => {
      const matchName = user.name ? user.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const matchEmail = Boolean(user.email?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSearch = matchName || matchEmail;
      const matchesPlan = planFilter === 'all' || user.plan === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [searchQuery, planFilter, usersData]);

  const toggleUserPlan = async (id: string, currentPlan: string, name: string) => {
    const newPlan = currentPlan === 'premium' ? 'free' : 'premium';
    const originalUsers = [...usersData];

    // Optimistic UI update
    setUsersData(usersData.map(u => u.id === id ? { ...u, plan: newPlan } : u));
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${name} is now ${newPlan}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      // Revert on failure
      setUsersData(originalUsers);
      showToast('❌ Error updating plan: ' + error.message);
    }
  };

  const createUser = async () => {
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      showToast('⚠️ Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          password: newUserPassword,
          plan: newUserPlan,
          accountType: newUserAccountType,
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUsersData([...usersData, data.user]);
        showToast(`✅ User "${data.user.name}" created successfully!`);
        cancelCreateUser();
      } else {
        showToast('❌ Error: ' + data.error);
      }
    } catch (error: any) {
      showToast('❌ Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelCreateUser = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserPlan('free');
    setNewUserAccountType('parent');
    setShowCreateForm(false);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditUserName(user.name || '');
    setEditUserPlan(user.plan || 'free');
    setEditUserAccountType(user.accountType || 'parent');
    setEditUserPassword('');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const saveEditedUser = async () => {
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editUserName.trim(),
          plan: editUserPlan,
          accountType: editUserAccountType,
          ...(editUserPassword ? { password: editUserPassword } : {})
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUsersData(usersData.map(u => u.id === editingUser.id ? data.user : u));
        showToast(`✅ User updated successfully!`);
        closeEditModal();
      } else {
        showToast('❌ Error: ' + data.error);
      }
    } catch (error) {
      showToast('❌ Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsersData(usersData.filter(u => u.id !== id));
        showToast(`✅ User deleted successfully`);
        if (editingUser?.id === id) closeEditModal();
      } else {
        showToast('❌ Error deleting user: ' + data.error);
      }
    } catch (error) {
      showToast('❌ Failed to delete user');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  if (loading) {
    return <div className="p-10 text-center text-inkm">Loading users...</div>;
  }

  return (
    <div className="p-5 lg:p-7 relative">
      <div className="mb-5">
        <h2 className="font-display text-lg text-ink tracking-wide">Users</h2>
        <p className="text-sm text-inkm">View and manage registered users</p>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-cream2 p-6 mb-4">
          <div className="font-display font-medium text-ink mb-4 tracking-wide flex justify-between">
            <span>➕ Create new user</span>
            <button onClick={cancelCreateUser} className="text-inkm hover:text-ink">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Full name</label>
              <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="e.g. John Doe" className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Account Type</label>
              <select value={newUserAccountType} onChange={(e) => setNewUserAccountType(e.target.value as 'school' | 'parent')} className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none">
                <option value="parent">Parent</option>
                <option value="school">School</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Email address</label>
              <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="e.g. user@example.com" className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Password</label>
              <input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Plan</label>
              <select value={newUserPlan} onChange={(e) => setNewUserPlan(e.target.value as 'free' | 'premium')} className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none">
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button onClick={createUser} disabled={isSubmitting} className="px-5 py-2 rounded-full text-sm font-medium text-white bg-orange hover:bg-oranged transition-all shadow-[0_3px_10px_rgba(255,107,53,.3)] disabled:opacity-50">
              {isSubmitting ? 'Creating...' : '✅ Create user'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
        {/* Header with search and filters */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream2 flex-wrap gap-3">
          <span className="font-display font-medium text-ink tracking-wide">
            All users (<span>{filteredUsers.length}</span>)
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange hover:bg-oranged transition-all">
              ➕ Add user
            </button>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-inkm text-sm">🔍</span>
              <input type="text" placeholder="Search users…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-4 py-2 rounded-xl border border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all w-44" />
            </div>
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value as 'all' | 'free' | 'premium')} className="px-3 py-2 rounded-xl border border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all">
              <option value="all">All plans</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream2 bg-cream text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm text-left">User</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm text-center">Type</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm text-center">Plan</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm hidden md:table-cell text-center">Joined</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream2">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-inkm">No users found</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#F8F5F0] transition-colors">
                    <td className="px-5 py-3.5 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange/12 flex items-center justify-center text-sm font-medium text-oranged shrink-0">
                          {user.name && user.name.length > 0 ? user.name[0].toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-medium text-ink text-sm">{user.name}</div>
                          <div className="text-xs text-inkm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-[10px] uppercase font-bold text-inkm border border-cream2 px-2 py-0.5 rounded bg-white">
                        {user.accountType || 'parent'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button onClick={() => toggleUserPlan(user.id, user.plan, user.name)} className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all ${user.plan === 'premium' ? 'bg-orange/12 text-oranged border-orange/20 hover:bg-red-50 hover:text-red-500 hover:border-red-200' : 'bg-cream text-inkm border-cream2 hover:bg-mint/10 hover:text-green-700 hover:border-mint/40'}`}>
                        {user.plan === 'premium' ? '⭐ Premium' : '🌱 Free'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-sm text-inkm text-center">
                      {user.joined}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(user)} className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-inks bg-cream border border-cream2 hover:border-orange hover:text-orange transition-all">
                          Edit
                        </button>
                        <button onClick={() => deleteUser(user.id, user.name)} className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-red-500 bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white transition-all">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-cream2 flex justify-between items-center bg-cream/50">
              <h3 className="font-display font-medium text-ink">Edit User</h3>
              <button onClick={closeEditModal} className="text-inkm hover:text-ink w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream transition-colors">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Email (Read only)</label>
                <input type="email" value={editingUser.email} disabled className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-inkm bg-cream/50 cursor-not-allowed" />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Full name</label>
                <input type="text" value={editUserName} onChange={(e) => setEditUserName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-white focus:border-orange outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Plan</label>
                  <select value={editUserPlan} onChange={(e) => setEditUserPlan(e.target.value as 'free' | 'premium')} className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-white focus:border-orange outline-none">
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Type</label>
                  <select value={editUserAccountType} onChange={(e) => setEditUserAccountType(e.target.value as 'school' | 'parent')} className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-white focus:border-orange outline-none">
                    <option value="parent">Parent</option>
                    <option value="school">School</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5 flex justify-between">
                  <span>New Password</span>
                  <span className="text-[10px] text-orange bg-orange/10 px-2 rounded-full normal-case">Optional</span>
                </label>
                <input type="password" value={editUserPassword} onChange={(e) => setEditUserPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-white focus:border-orange outline-none transition-colors" />
              </div>
            </div>

            <div className="px-6 py-4 bg-cream/30 border-t border-cream2 flex justify-end gap-3 rounded-b-[24px]">
              <button onClick={closeEditModal} className="px-4 py-2 rounded-xl text-sm font-medium text-ink border-2 border-transparent hover:bg-cream transition-colors">
                Cancel
              </button>
              <button onClick={saveEditedUser} disabled={isSubmitting} className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-orange hover:bg-oranged transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastVisible && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-ink text-white text-sm font-medium px-5 py-3.5 rounded-2xl shadow-xl border-l-4 border-mint animate-in fade-in slide-in-from-top-4 duration-300">
          <span>{toastMessage.includes('❌') ? '' : '✅'}</span>
          <span>{toastMessage.replace('✅ ', '').replace('❌ ', '')}</span>
        </div>
      )}
    </div>
  );
}
