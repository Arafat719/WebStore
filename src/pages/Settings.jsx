import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';
import './Settings.css';

const API = import.meta.env.VITE_API_URL;

/* ── Sidebar nav ──────────────────────────────────────────────────── */
const NAV = [
  {
    group: 'Account',
    items: [
      { id: 'profile',       icon: '👤', label: 'Profile' },
      { id: 'account',       icon: '🔑', label: 'Account' },
      { id: 'security',      icon: '🛡️',  label: 'Security' },
    ],
  },
  {
    group: 'Commerce',
    items: [
      { id: 'billing',       icon: '💳', label: 'Billing' },
      { id: 'seller',        icon: '🏪', label: 'Seller Settings' },
    ],
  },
  {
    group: 'Preferences',
    items: [
      { id: 'notifications', icon: '🔔', label: 'Notifications' },
      { id: 'preferences',   icon: '🎨', label: 'Preferences' },
      { id: 'connected',     icon: '🔗', label: 'Connected Accounts' },
    ],
  },
];

/* ── Static dummy data ────────────────────────────────────────────── */
const SESSIONS = [
  { id: 1, icon: '💻', device: 'Chrome · macOS Ventura',     location: 'Dhaka, BD · 2 min ago',       current: true  },
  { id: 2, icon: '📱', device: 'Safari · iPhone 15 Pro',     location: 'Dhaka, BD · 1 hr ago',        current: false },
  { id: 3, icon: '🖥️', device: 'Firefox · Windows 11',       location: 'Chittagong, BD · 3 days ago', current: false },
];

const LOGIN_HISTORY = [
  { id: 1, event: 'Successful login',  date: 'Jun 15, 2026 · 11:32 AM', ip: '103.47.xx.xx' },
  { id: 2, event: 'Successful login',  date: 'Jun 12, 2026 · 08:15 PM', ip: '103.47.xx.xx' },
  { id: 3, event: 'Failed attempt',    date: 'Jun 10, 2026 · 03:44 AM', ip: '45.33.xx.xx'  },
  { id: 4, event: 'Password changed',  date: 'Jun 05, 2026 · 10:00 AM', ip: '103.47.xx.xx' },
];

const TRANSACTIONS = [
  { id: 'TXN-0091', type: 'sale',       desc: 'UI Kit Pro v2',         amount: '+$29.00', date: 'Jun 14, 2026' },
  { id: 'TXN-0090', type: 'purchase',   desc: 'SEO Booster Pack',      amount: '-$12.00', date: 'Jun 13, 2026' },
  { id: 'TXN-0089', type: 'sale',       desc: 'Icon Bundle 500+',      amount: '+$19.00', date: 'Jun 11, 2026' },
  { id: 'TXN-0088', type: 'withdrawal', desc: 'Payout to bank',        amount: '-$75.00', date: 'Jun 08, 2026' },
  { id: 'TXN-0087', type: 'sale',       desc: 'Landing Page HTML',     amount: '+$35.00', date: 'Jun 06, 2026' },
];

/* ══════════════════════════════════════════════════════════════
   Section: Profile
   ══════════════════════════════════════════════════════════════ */
function ProfilePanel() {
  const { getProfile, firstLetter } = useContext(UserContext);
  const [form, setForm] = useState({ name: '', username: '', bio: '', website: '' });
  const [msg, setMsg]       = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then(data => {
        if (data) setForm({
          name:     data.name     || '',
          username: data.username || '',
          bio:      data.bio      || '',
          website:  data.website  || '',
        });
      })
      .catch(() => {});
  }, []);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res  = await fetch(`${API}/auth/update-profile`, {
        method: 'PUT',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...stored, name: form.name }));
        setMsg({ text: 'Profile updated successfully', type: 'success' });
      } else {
        setMsg({ text: data.error || 'Failed to update profile', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  return (
    <div className="wmx-panel">
      <div className="wmx-card">
        <p className="wmx-card-title">👤 Public Profile</p>
        <p className="wmx-card-desc">This information is shown on your public marketplace page.</p>

        <div className="wmx-avatar-upload">
          <div className="wmx-avatar-circle">{firstLetter}</div>
          <div className="wmx-avatar-actions">
            <button className="wmx-btn-upload">Upload photo</button>
            <span className="wmx-avatar-hint">JPG, PNG or GIF · Max 2 MB</span>
          </div>
        </div>

        <div className="wmx-form-group">
          <label className="wmx-label">Name</label>
          <input className="wmx-input" type="text" value={form.name} onChange={set('name')} />
        </div>

        <div className="wmx-form-group">
          <label className="wmx-label">Username</label>
          <input className="wmx-input" type="text" value={form.username} onChange={set('username')} />
          <span className="wmx-hint">webmarketx.com/u/{form.username || '...'}</span>
        </div>

        <div className="wmx-form-group">
          <label className="wmx-label">Bio</label>
          <textarea className="wmx-textarea" value={form.bio} onChange={set('bio')} />
        </div>

        <div className="wmx-form-group">
          <label className="wmx-label">Website / Portfolio URL</label>
          <input className="wmx-input" type="url" value={form.website}
            placeholder="https://yoursite.com" onChange={set('website')} />
        </div>

        {msg.text && <p className={`wmx-inline-msg wmx-msg-${msg.type}`}>{msg.text}</p>}
        <button className="wmx-btn-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Section: Account
   ══════════════════════════════════════════════════════════════ */
function AccountPanel() {
  const navigate = useNavigate();

  const [vis, setVis] = useState({ cur: false, nxt: false, cfm: false });
  const toggle = k => setVis(v => ({ ...v, [k]: !v[k] }));

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg]         = useState({ text: '', type: '' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword]   = useState('');
  const [deleteError, setDeleteError]         = useState('');
  const [deleteLoading, setDeleteLoading]     = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setPasswordMsg({ text: 'All password fields are required', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Passwords don't match", type: 'error' });
      return;
    }
    const token = localStorage.getItem('token');
    const res   = await fetch(`${API}/auth/changepassword`, {
      method: 'PUT',
      headers: { token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setPasswordMsg({ text: 'Password updated!', type: 'success' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } else {
      setPasswordMsg({ text: data.error || 'Failed to change password', type: 'error' });
    }
    setTimeout(() => setPasswordMsg({ text: '', type: '' }), 4000);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { setDeleteError('Password is required'); return; }
    setDeleteLoading(true);
    setDeleteError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/auth/delete-account`, {
        method: 'DELETE',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });
      if (res.ok) {
        localStorage.clear();
        navigate('/');
      } else {
        const data = await res.json();
        setDeleteError(data.error || 'Incorrect password');
      }
    } catch {
      setDeleteError('Network error. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="wmx-panel">
      {/* Email */}
      <div className="wmx-card">
        <p className="wmx-card-title">📧 Email Address</p>
        <p className="wmx-card-desc">Update the email linked to your WebMarketX account.</p>
        <div className="wmx-form-group">
          <label className="wmx-label">Current Email</label>
          <input className="wmx-input" type="email" defaultValue="arafatkhan0186@gmail.com" disabled />
        </div>
        <div className="wmx-form-group">
          <label className="wmx-label">New Email</label>
          <input className="wmx-input" type="email" placeholder="new@email.com" disabled />
        </div>
        <span className="wmx-hint" style={{ display: 'block', marginTop: '0.3rem' }}>
          Email change coming soon
        </span>
        <button className="wmx-btn-save" disabled
          style={{ opacity: 0.45, cursor: 'not-allowed', marginTop: '1.4rem' }}>
          Update Email
        </button>
      </div>

      {/* Password */}
      <div className="wmx-card">
        <p className="wmx-card-title">🔑 Change Password</p>
        <p className="wmx-card-desc">Use a strong, unique password you don't use anywhere else.</p>

        <div className="wmx-form-group">
          <label className="wmx-label">Current Password</label>
          <div className="wmx-input-wrap">
            <input className="wmx-input" type={vis.cur ? 'text' : 'password'} placeholder="••••••••"
              value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <button className="wmx-eye-btn" onClick={() => toggle('cur')}>{vis.cur ? '🙈' : '👁️'}</button>
          </div>
        </div>

        <div className="wmx-form-row">
          <div className="wmx-form-group">
            <label className="wmx-label">New Password</label>
            <div className="wmx-input-wrap">
              <input className="wmx-input" type={vis.nxt ? 'text' : 'password'} placeholder="••••••••"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <button className="wmx-eye-btn" onClick={() => toggle('nxt')}>{vis.nxt ? '🙈' : '👁️'}</button>
            </div>
          </div>
          <div className="wmx-form-group">
            <label className="wmx-label">Confirm New Password</label>
            <div className="wmx-input-wrap">
              <input className="wmx-input" type={vis.cfm ? 'text' : 'password'} placeholder="••••••••"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <button className="wmx-eye-btn" onClick={() => toggle('cfm')}>{vis.cfm ? '🙈' : '👁️'}</button>
            </div>
          </div>
        </div>

        {passwordMsg.text && (
          <p className={`wmx-inline-msg wmx-msg-${passwordMsg.type}`}>{passwordMsg.text}</p>
        )}
        <button className="wmx-btn-save" onClick={handlePasswordChange}>Change Password</button>
      </div>

      {/* Danger zone */}
      <div className="wmx-danger-card">
        <p className="wmx-danger-title">⚠️ Danger Zone</p>
        <p className="wmx-danger-desc">
          Deleting your account is permanent. All products, reviews, and earnings history will be
          erased and cannot be recovered. This action cannot be undone.
        </p>
        <button className="wmx-btn-danger" onClick={() => setShowDeleteModal(true)}>
          Delete My Account
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="wmx-modal-overlay"
          onClick={e => e.target === e.currentTarget && closeDeleteModal()}>
          <div className="wmx-modal">
            <div className="wmx-modal-icon">⚠️</div>
            <h3 className="wmx-modal-title">Delete Your Account</h3>
            <p className="wmx-modal-desc">
              This action is permanent and cannot be undone. All your products, reviews,
              and earnings history will be permanently erased.
            </p>
            <div className="wmx-form-group" style={{ margin: 0 }}>
              <label className="wmx-label">Enter your password to confirm</label>
              <input className="wmx-input" type="password" placeholder="••••••••"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDeleteAccount()}
              />
            </div>
            {deleteError && (
              <p className="wmx-inline-msg wmx-msg-error" style={{ margin: 0 }}>{deleteError}</p>
            )}
            <div className="wmx-modal-btns">
              <button className="wmx-btn-ghost" onClick={closeDeleteModal}>Cancel</button>
              <button className="wmx-btn-danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting…' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Section: Notifications
   ══════════════════════════════════════════════════════════════ */
function NotificationsPanel() {
  const [toggles, setToggles] = useState({
    newMessage:     true,
    newSale:        true,
    newPurchase:    true,
    marketingEmail: false,
    pushNotif:      false,
  });
  const [msg, setMsg]       = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API}/auth/notifications`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        if (data?.notifications) setToggles(t => ({ ...t, ...data.notifications }));
      })
      .catch(() => {});
  }, []);

  const flip = key => setToggles(t => ({ ...t, [key]: !t[key] }));

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res  = await fetch(`${API}/auth/update-notifications`, {
        method: 'PUT',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: toggles }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Preferences saved', type: 'success' });
      } else {
        setMsg({ text: data.error || 'Failed to save preferences', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const rows = [
    { key: 'newMessage',     title: 'New Message',        desc: 'When a buyer or seller sends you a message' },
    { key: 'newSale',        title: 'New Sale',           desc: 'When someone purchases your product' },
    { key: 'newPurchase',    title: 'New Purchase',       desc: 'Order confirmation for your own purchases' },
    { key: 'marketingEmail', title: 'Marketing Emails',   desc: 'Deals, new features, and platform highlights' },
    { key: 'pushNotif',      title: 'Push Notifications', desc: 'Browser and mobile push alerts' },
  ];

  return (
    <div className="wmx-panel">
      <div className="wmx-card">
        <p className="wmx-card-title">🔔 Notification Preferences</p>
        <p className="wmx-card-desc">Choose which updates you want to receive and how.</p>

        {rows.map(r => (
          <div key={r.key} className="wmx-toggle-row">
            <div className="wmx-toggle-info">
              <p className="wmx-toggle-title">{r.title}</p>
              <p className="wmx-toggle-desc">{r.desc}</p>
            </div>
            <label className="wmx-switch">
              <input type="checkbox" checked={toggles[r.key]} onChange={() => flip(r.key)} />
              <span className="wmx-switch-track" />
            </label>
          </div>
        ))}

        {msg.text && <p className={`wmx-inline-msg wmx-msg-${msg.type}`}>{msg.text}</p>}
        <button className="wmx-btn-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Section: Security
   ══════════════════════════════════════════════════════════════ */
function SecurityPanel() {
  const [twoFA, setTwoFA]           = useState(false);
  const [sessions, setSessions]     = useState(SESSIONS);
  const revokeSession = id => setSessions(s => s.filter(x => x.id !== id));

  return (
    <div className="wmx-panel">
      <div className="wmx-coming-soon-banner">
        🚧 This section is coming soon. We're working on it!
      </div>

      {/* 2FA */}
      <div className="wmx-card">
        <p className="wmx-card-title">🔐 Two-Factor Authentication</p>
        <p className="wmx-card-desc">Add an extra layer of security using an authenticator app.</p>

        <div className="wmx-toggle-row" style={{ borderBottom: 'none' }}>
          <div className="wmx-toggle-info">
            <p className="wmx-toggle-title">Enable 2FA</p>
            <p className="wmx-toggle-desc">
              {twoFA
                ? 'Active — your account has extra protection'
                : 'Disabled — only a password protects your account'}
            </p>
          </div>
          <label className="wmx-switch">
            <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(v => !v)} />
            <span className="wmx-switch-track" />
          </label>
        </div>

        {twoFA && (
          <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'rgba(226,226,240,0.42)', lineHeight: 1.6 }}>
            Scan the QR code in your authenticator app (Google Authenticator, Authy, etc.) or
            enter a backup code manually to complete setup.
          </p>
        )}
      </div>

      {/* Active sessions */}
      <div className="wmx-card">
        <p className="wmx-card-title">📡 Active Sessions</p>
        <p className="wmx-card-desc">Devices currently signed into your account.</p>
        <div className="wmx-session-list">
          {sessions.map(s => (
            <div key={s.id} className="wmx-session-item">
              <span className="wmx-session-icon">{s.icon}</span>
              <div className="wmx-session-info">
                <p className="wmx-session-device">{s.device}</p>
                <p className="wmx-session-meta">{s.location}</p>
              </div>
              <span className={`wmx-session-badge ${s.current ? 'wmx-current' : 'wmx-other'}`}>
                {s.current ? 'This device' : 'Active'}
              </span>
              {!s.current && (
                <button className="wmx-btn-revoke" onClick={() => revokeSession(s.id)}>
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Login history */}
      <div className="wmx-card">
        <p className="wmx-card-title">📋 Login History</p>
        <p className="wmx-card-desc">Recent sign-in activity for your account.</p>
        <div className="wmx-table-wrapper">
          <table className="wmx-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date &amp; Time</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {LOGIN_HISTORY.map(h => (
                <tr key={h.id}>
                  <td style={{ color: h.event.startsWith('Failed') ? '#ff6b6b' : undefined }}>
                    {h.event}
                  </td>
                  <td>{h.date}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'rgba(226,226,240,0.42)' }}>
                    {h.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Section: Billing
   ══════════════════════════════════════════════════════════════ */
function BillingPanel() {
  return (
    <div className="wmx-panel">
      <div className="wmx-coming-soon-banner">
        🚧 This section is coming soon. We're working on it!
      </div>

      {/* Card UI */}
      <div className="wmx-card">
        <p className="wmx-card-title">💳 Payment Method</p>
        <p className="wmx-card-desc">Your saved card for purchases and subscription renewals.</p>

        <div className="wmx-payment-card">
          <div className="wmx-card-chip" />
          <p className="wmx-card-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;4242</p>
          <div className="wmx-card-footer">
            <div>
              <p className="wmx-card-label">Card Holder</p>
              <p className="wmx-card-value">Arafat Khan</p>
            </div>
            <div>
              <p className="wmx-card-label">Expires</p>
              <p className="wmx-card-value">09 / 28</p>
            </div>
            <div className="wmx-card-brand">VISA</div>
          </div>
        </div>

        <div className="wmx-inline-btns">
          <button className="wmx-btn-save">Replace Card</button>
          <button className="wmx-btn-danger">Remove Card</button>
        </div>
      </div>

      {/* Transaction history */}
      <div className="wmx-card">
        <p className="wmx-card-title">📊 Transaction History</p>
        <p className="wmx-card-desc">Last 30 days of account activity.</p>
        <div className="wmx-table-wrapper">
          <table className="wmx-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map(tx => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: 'rgba(226,226,240,0.38)' }}>
                    {tx.id}
                  </td>
                  <td>
                    <span className={`wmx-tx-badge wmx-${tx.type}`}>
                      {tx.type === 'sale' ? '↑' : tx.type === 'purchase' ? '↓' : '⇄'} {tx.type}
                    </span>
                  </td>
                  <td>{tx.desc}</td>
                  <td style={{
                    fontWeight: 600,
                    color: tx.type === 'sale' ? '#34d399' : tx.type === 'withdrawal' ? '#fbbf24' : undefined,
                  }}>
                    {tx.amount}
                  </td>
                  <td style={{ color: 'rgba(226,226,240,0.42)' }}>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal settings */}
      <div className="wmx-card">
        <p className="wmx-card-title">🏦 Withdrawal Settings</p>
        <p className="wmx-card-desc">Configure how and when your earnings are paid out.</p>

        <div className="wmx-form-group">
          <label className="wmx-label">Minimum Withdrawal Amount (USD)</label>
          <input className="wmx-input" type="number" defaultValue="50" style={{ maxWidth: 160 }} />
          <span className="wmx-hint">Payouts are processed every Friday for balances above this threshold.</span>
        </div>

        <div className="wmx-form-group">
          <label className="wmx-label">Payout Schedule</label>
          <select className="wmx-select" style={{ maxWidth: 240 }}>
            <option>Weekly (every Friday)</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        <button className="wmx-btn-save">Save Withdrawal Settings</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Section: Seller Settings
   ══════════════════════════════════════════════════════════════ */
function SellerPanel() {
  const { getProfile, userRoles, becomeSeller } = useContext(UserContext);
  const [form, setForm] = useState({
    shopName:      '',
    tagline:       '',
    category:      'UI / UX Design',
    payout:        'bank',
    listingPublic: true,
  });
  const [msg, setMsg]         = useState({ text: '', type: '' });
  const [saving, setSaving]   = useState(false);
  const [becoming, setBecoming]     = useState(false);
  const [becomeMsg, setBecomeMsg]   = useState({ text: '', type: '' });

  useEffect(() => {
    getProfile()
      .then(data => {
        if (data) setForm(f => ({
          ...f,
          shopName:      data.shopName      || data.name || '',
          tagline:       data.tagline       || '',
          category:      data.category      || 'UI / UX Design',
          payout:        data.payout        || 'bank',
          listingPublic: data.listingPublic !== undefined ? data.listingPublic : true,
        }));
      })
      .catch(() => {});
  }, []);

  const handleBecomeSeller = async () => {
    setBecoming(true);
    setBecomeMsg({ text: '', type: '' });
    const result = await becomeSeller();
    setBecoming(false);
    if (result?.success) {
      setBecomeMsg({ text: 'You are now a seller! Refresh to see your seller settings.', type: 'success' });
    } else {
      setBecomeMsg({ text: result?.data?.error || 'Something went wrong. Please try again.', type: 'error' });
      setTimeout(() => setBecomeMsg({ text: '', type: '' }), 4000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res  = await fetch(`${API}/auth/update-seller-settings`, {
        method: 'PUT',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Settings saved', type: 'success' });
      } else {
        setMsg({ text: data.error || 'Failed to save settings', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  return (
    <div className="wmx-panel">
      {!userRoles?.includes('seller') ? (
        <div className="wmx-become-seller-card">
          <p className="wmx-bsc-title">Start Selling on WebMarketX</p>
          <p className="wmx-bsc-desc">List your digital products and reach thousands of buyers.</p>
          {becomeMsg.text && <p className={`wmx-inline-msg wmx-msg-${becomeMsg.type}`}>{becomeMsg.text}</p>}
          <button className="wmx-btn-save" onClick={handleBecomeSeller} disabled={becoming}>
            {becoming ? 'Activating…' : 'Become a Seller'}
          </button>
        </div>
      ) : (
        <div className="wmx-card">
          <p className="wmx-card-title">🏪 Shop Details</p>
          <p className="wmx-card-desc">Customise how your seller profile appears on the marketplace.</p>

          <div className="wmx-form-group">
            <label className="wmx-label">Shop Display Name</label>
            <input className="wmx-input" type="text" value={form.shopName}
              onChange={e => setForm(f => ({ ...f, shopName: e.target.value }))} />
            <span className="wmx-hint">Shown on all your product listings and your public seller page.</span>
          </div>

          <div className="wmx-form-group">
            <label className="wmx-label">Shop Tagline</label>
            <input className="wmx-input" type="text" value={form.tagline}
              placeholder="One-line pitch for your shop"
              onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
          </div>

          <div className="wmx-form-group">
            <label className="wmx-label">Primary Category</label>
            <select className="wmx-select" value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option>UI / UX Design</option>
              <option>Templates</option>
              <option>Icons &amp; Illustrations</option>
              <option>Code &amp; Scripts</option>
              <option>Photography</option>
              <option>Audio &amp; Music</option>
            </select>
          </div>

          <hr className="wmx-divider" />

          <div className="wmx-form-group">
            <label className="wmx-label">Payout Preference</label>
            <div className="wmx-radio-group">
              {[
                { value: 'bank',   label: 'Bank Transfer' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'wise',   label: 'Wise' },
              ].map(opt => (
                <label key={opt.value} className="wmx-radio-opt">
                  <input type="radio" name="payout" value={opt.value}
                    checked={form.payout === opt.value}
                    onChange={() => setForm(f => ({ ...f, payout: opt.value }))} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <hr className="wmx-divider" />

          <div className="wmx-toggle-row" style={{ borderBottom: 'none' }}>
            <div className="wmx-toggle-info">
              <p className="wmx-toggle-title">Product Listing Visibility</p>
              <p className="wmx-toggle-desc">
                {form.listingPublic
                  ? 'Your products are visible to all marketplace visitors'
                  : 'Your products are hidden from public search'}
              </p>
            </div>
            <label className="wmx-switch">
              <input type="checkbox" checked={form.listingPublic}
                onChange={() => setForm(f => ({ ...f, listingPublic: !f.listingPublic }))} />
              <span className="wmx-switch-track" />
            </label>
          </div>

          {msg.text && <p className={`wmx-inline-msg wmx-msg-${msg.type}`}>{msg.text}</p>}
          <button className="wmx-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Section: Preferences
   ══════════════════════════════════════════════════════════════ */
function PreferencesPanel() {
  const { theme, toggleTheme } = useContext(UserContext);
  const [prefs, setPrefs] = useState({
    language: 'English (US)',
    currency: 'USD — US Dollar',
    timezone: 'Asia/Dhaka (UTC+6)',
  });
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [msg, setMsg]       = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API}/auth/preferences`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        if (data?.preferences) {
          const { theme: savedTheme, ...rest } = data.preferences;
          setPrefs(p => ({ ...p, ...rest }));
          if (savedTheme) setSelectedTheme(savedTheme);
        }
      })
      .catch(() => {});
  }, []);

  const handleThemeSelect = (newTheme) => {
    setSelectedTheme(newTheme);
    if (newTheme !== theme) toggleTheme();
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res  = await fetch(`${API}/auth/update-preferences`, {
        method: 'PUT',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: { ...prefs, theme: selectedTheme } }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Preferences saved', type: 'success' });
      } else {
        setMsg({ text: data.error || 'Failed to save preferences', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  return (
    <div className="wmx-panel">
      <div className="wmx-card">
        <p className="wmx-card-title">🌐 Language &amp; Region</p>
        <p className="wmx-card-desc">Set the language, currency and timezone used across the marketplace.</p>

        <div className="wmx-form-row">
          <div className="wmx-form-group">
            <label className="wmx-label">Language</label>
            <select className="wmx-select" value={prefs.language}
              onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))}>
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>বাংলা (Bangla)</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
              <option>日本語</option>
            </select>
          </div>
          <div className="wmx-form-group">
            <label className="wmx-label">Currency</label>
            <select className="wmx-select" value={prefs.currency}
              onChange={e => setPrefs(p => ({ ...p, currency: e.target.value }))}>
              <option>USD — US Dollar</option>
              <option>EUR — Euro</option>
              <option>GBP — British Pound</option>
              <option>BDT — Bangladeshi Taka</option>
              <option>JPY — Japanese Yen</option>
              <option>CAD — Canadian Dollar</option>
            </select>
          </div>
        </div>

        <div className="wmx-form-group">
          <label className="wmx-label">Timezone</label>
          <select className="wmx-select" value={prefs.timezone}
            onChange={e => setPrefs(p => ({ ...p, timezone: e.target.value }))}>
            <option>Asia/Dhaka (UTC+6)</option>
            <option>America/New_York (UTC−5)</option>
            <option>Europe/London (UTC+0)</option>
            <option>Asia/Tokyo (UTC+9)</option>
          </select>
        </div>

        <hr className="wmx-divider" />

        <div className="wmx-form-group">
          <label className="wmx-label">Theme</label>
          <div className="wmx-theme-row">
            {[
              { value: 'dark',  label: 'Dark',  previewClass: 'wmx-dark' },
              { value: 'light', label: 'Light', previewClass: 'wmx-light' },
            ].map(opt => (
              <button key={opt.value}
                className={`wmx-theme-opt ${selectedTheme === opt.value ? 'wmx-selected' : ''}`}
                onClick={() => handleThemeSelect(opt.value)}
              >
                <div className={`wmx-theme-preview ${opt.previewClass}`} />
                <p className="wmx-theme-label">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>

        {msg.text && <p className={`wmx-inline-msg wmx-msg-${msg.type}`}>{msg.text}</p>}
        <button className="wmx-btn-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Section: Connected Accounts
   ══════════════════════════════════════════════════════════════ */
function ConnectedPanel() {
  const [connected, setConnected] = useState({ google: true, github: false });
  const toggle = key => setConnected(c => ({ ...c, [key]: !c[key] }));

  const ACCOUNTS = [
    {
      key: 'google',
      logoClass: 'wmx-google',
      symbol: 'G',
      name: 'Google',
      connectedDesc:    'Connected as arafatkhan0186@gmail.com',
      disconnectedDesc: 'Sign in faster with your Google account',
    },
    {
      key: 'github',
      logoClass: 'wmx-github',
      symbol: '⌥',
      name: 'GitHub',
      connectedDesc:    'Connected as @arafat-dev',
      disconnectedDesc: 'Link GitHub for developer product verification',
    },
  ];

  return (
    <div className="wmx-panel">
      <div className="wmx-coming-soon-banner">
        🚧 This section is coming soon. We're working on it!
      </div>

      <div className="wmx-card">
        <p className="wmx-card-title">🔗 Connected Accounts</p>
        <p className="wmx-card-desc">Link third-party accounts for faster login and additional features.</p>

        <div className="wmx-connect-list">
          {ACCOUNTS.map(a => (
            <div key={a.key} className="wmx-connect-item">
              <div className="wmx-connect-left">
                <div className={`wmx-connect-logo ${a.logoClass}`}>{a.symbol}</div>
                <div>
                  <p className="wmx-connect-name">{a.name}</p>
                  <p className={`wmx-connect-status ${connected[a.key] ? 'wmx-connected' : ''}`}>
                    {connected[a.key] ? a.connectedDesc : a.disconnectedDesc}
                  </p>
                </div>
              </div>
              <button
                className={`wmx-btn-connect ${connected[a.key] ? 'wmx-do-disconnect' : 'wmx-do-connect'}`}
                onClick={() => toggle(a.key)}
              >
                {connected[a.key] ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Root
   ══════════════════════════════════════════════════════════════ */
export default function Settings() {
  const [active, setActive] = useState('profile');
  const { userType, userRoles } = useContext(UserContext);

  const visibleNAV = NAV;

  const PANELS = {
    profile:       <ProfilePanel />,
    account:       <AccountPanel />,
    notifications: <NotificationsPanel />,
    security:      <SecurityPanel />,
    billing:       <BillingPanel />,
    seller:        <SellerPanel />,
    preferences:   <PreferencesPanel />,
    connected:     <ConnectedPanel />,
  };

  return (
    <div className="wmx-settings-root">
      <header className="wmx-settings-header">
        <h1>Settings</h1>
        <p>Manage your WebMarketX account, seller profile, and preferences.</p>
      </header>

      <div className="wmx-settings-layout">
        {/* Sidebar */}
        <nav className="wmx-settings-sidebar">
          {visibleNAV.map(group => (
            <div key={group.group} className="wmx-sidebar-group">
              <span className="wmx-sidebar-label">{group.group}</span>
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`wmx-sidebar-btn ${active === item.id ? 'wmx-active' : ''}`}
                  onClick={() => setActive(item.id)}
                >
                  <span className="wmx-sidebar-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Content — key forces remount → CSS fade-in fires on every switch */}
        <main className="wmx-settings-content" key={active}>
          {PANELS[active]}
        </main>
      </div>
    </div>
  );
}
