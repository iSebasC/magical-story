'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [freeLimit, setFreeLimit] = useState('3');
  const [priceMonthly, setPriceMonthly] = useState('9.90');
  const [currency, setCurrency] = useState('USD');
  const [adminEmail, setAdminEmail] = useState('admin@magicalstory.com');
  const [newPassword, setNewPassword] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const saveSetting = (type: string) => {
    const messages: Record<string, string> = {
      freeLimit: 'Free plan limit updated!',
      price: 'Premium pricing updated!',
      account: 'Admin account updated!',
    };
    showToast(messages[type] || 'Settings saved!');
  };

  const handleLogout = () => {
    if (confirm('Sign out?')) {
      window.location.href = '/login';
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="mb-5">
        <h2 className="font-display text-lg text-ink tracking-wide">Settings</h2>
        <p className="text-sm text-inkm">Platform configuration</p>
      </div>

      <div className="flex flex-col gap-4 max-w-lg">
        {/* Free plan limits */}
        <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
          <div className="px-6 py-4 border-b border-cream2">
            <span className="font-display font-medium text-ink tracking-wide">Free plan limits</span>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">
                Free stories available to users
              </label>
              <select
                value={freeLimit}
                onChange={(e) => setFreeLimit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all"
              >
                <option value="3">3 stories</option>
                <option value="5">5 stories</option>
                <option value="10">10 stories</option>
              </select>
            </div>
            <p className="text-xs text-inkm leading-relaxed">
              The first N stories marked as &quot;Free&quot; in the library will be available to non-premium users.
            </p>
            <button
              onClick={() => saveSetting('freeLimit')}
              className="self-start flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white bg-orange hover:bg-oranged hover:-translate-y-0.5 transition-all shadow-[0_3px_10px_rgba(255,107,53,.3)]"
            >
              Save changes
            </button>
          </div>
        </div>

        {/* Premium pricing */}
        <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
          <div className="px-6 py-4 border-b border-cream2">
            <span className="font-display font-medium text-ink tracking-wide">Premium pricing</span>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">
                  Monthly price ($)
                </label>
                <input
                  type="number"
                  value={priceMonthly}
                  onChange={(e) => setPriceMonthly(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all"
                >
                  <option>USD</option>
                  <option>PEN</option>
                  <option>EUR</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => saveSetting('price')}
              className="self-start flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white bg-orange hover:bg-oranged hover:-translate-y-0.5 transition-all shadow-[0_3px_10px_rgba(255,107,53,.3)]"
            >
              Save changes
            </button>
          </div>
        </div>

        {/* Admin account */}
        <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
          <div className="px-6 py-4 border-b border-cream2">
            <span className="font-display font-medium text-ink tracking-wide">Admin account</span>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">
                Admin email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => saveSetting('account')}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white bg-orange hover:bg-oranged hover:-translate-y-0.5 transition-all shadow-[0_3px_10px_rgba(255,107,53,.3)]"
              >
                Save changes
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-inkm border-2 border-cream2 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                Sign out
              </button>
            </div>
          </div>
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
