import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faKey, faShield, faStore,
  faBell, faPaintbrush, faLink, faMobileScreen,
  faDesktop, faEnvelope, faEye, faEyeSlash,
  faTriangleExclamation, faLock, faSatelliteDish,
  faClipboardList, faGlobe,
  faHardHat
} from '@fortawesome/free-solid-svg-icons';
import './Settings.css';

const API = import.meta.env.VITE_API_URL;

/* ── Sidebar nav ──────────────────────────────────────────────────── */
const NAV = [
  {
    group: 'Account',
    items: [
      { id: 'profile',       icon: faUser,    label: 'Profile' },
      { id: 'account',       icon: faKey,     label: 'Account' },
      { id: 'security',      icon: faShield,  label: 'Security' },
    ],
  },
  {
    group: 'Commerce',
    items: [
      { id: 'seller',        icon: faStore,      label: 'Seller Settings' },
    ],
  },
  {
    group: 'Preferences',
    items: [
      { id: 'notifications', icon: faBell,       label: 'Notifications' },
      { id: 'preferences',   icon: faPaintbrush, label: 'Preferences' },
      { id: 'connected',     icon: faLink,       label: 'Connected Accounts' },
    ],
  },
];

/* ── Static dummy data ────────────────────────────────────────────── */
// Masks the trailing octet(s) of an IP so the raw address isn't shown on screen.
function maskIp(ip) {
  if (!ip) return '—';
  // Only a bare IPv4 address (not an IPv4-mapped IPv6 form like "::ffff:1.2.3.4")
  // gets octet-masked; anything else (IPv6, ::1, etc.) is truncated instead.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.xx.xx`;
  }
  return ip.length > 8 ? `${ip.slice(0, 8)}…` : ip;
}

function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1)   return 'just now';
  if (min < 60)  return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24)   return `${hr} hr ago`;
  const days = Math.floor(hr / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function sessionIcon(device = '') {
  if (/Android|iOS/.test(device)) return faMobileScreen;
  return faDesktop;
}

/* ══════════════════════════════════════════════════════════════
   Section: Profile
   ══════════════════════════════════════════════════════════════ */
function ProfilePanel() {
  const { firstLetter, setUserVersion } = useContext(UserContext);
  const [form, setForm] = useState({ name: '', username: '', bio: '', website: '' });
  const [msg, setMsg]       = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  // /auth/getuser works for both buyers and sellers (unlike /seller/profile,
  // which 404s for buyer-only accounts that never called become-seller).
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API}/auth/getuser`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        const u = data?.user;
        if (u) setForm(f => ({
          ...f,
          name:    u.name    || '',
          bio:     u.bio     || '',
          website: u.website || '',
        }));
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
        setUserVersion(v => v + 1);
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
        <p className="wmx-card-title"><FontAwesomeIcon icon={faUser} /> Public Profile</p>
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

  const [currentEmail, setCurrentEmail]       = useState('');
  const [newEmail, setNewEmail]               = useState('');
  const [emailPassword, setEmailPassword]     = useState('');
  const [emailMsg, setEmailMsg]               = useState({ text: '', type: '' });
  const [emailSaving, setEmailSaving]         = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword]   = useState('');
  const [deleteError, setDeleteError]         = useState('');
  const [deleteLoading, setDeleteLoading]     = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API}/auth/getuser`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        const u = data?.user;
        if (u) {
          setCurrentEmail(u.email || '');
          setIsGoogleAccount(u.provider === 'google');
        }
      })
      .catch(() => {});
  }, []);

  const handleEmailChange = async () => {
    if (!newEmail || !emailPassword) {
      setEmailMsg({ text: 'New email and password are required', type: 'error' });
      return;
    }
    setEmailSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res  = await fetch(`${API}/auth/update-email`, {
        method: 'PUT',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, password: emailPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentEmail(data.email);
        setNewEmail('');
        setEmailPassword('');
        setEmailMsg({ text: 'Email updated successfully', type: 'success' });
      } else {
        setEmailMsg({ text: data.error || 'Failed to update email', type: 'error' });
      }
    } catch {
      setEmailMsg({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setEmailSaving(false);
      setTimeout(() => setEmailMsg({ text: '', type: '' }), 4000);
    }
  };

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
        <p className="wmx-card-title"><FontAwesomeIcon icon={faEnvelope} /> Email Address</p>
        <p className="wmx-card-desc">Update the email linked to your WebMarketX account.</p>
        <div className="wmx-form-group">
          <label className="wmx-label">Current Email</label>
          <input className="wmx-input" type="email" value={currentEmail} disabled />
        </div>

        {isGoogleAccount ? (
          <span className="wmx-hint" style={{ display: 'block', marginTop: '0.3rem' }}>
            This account signs in with Google — email is managed by your Google account.
          </span>
        ) : (
          <>
            <div className="wmx-form-group">
              <label className="wmx-label">New Email</label>
              <input className="wmx-input" type="email" placeholder="new@email.com"
                value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            </div>
            <div className="wmx-form-group">
              <label className="wmx-label">Current Password</label>
              <input className="wmx-input" type="password" placeholder="••••••••"
                value={emailPassword} onChange={e => setEmailPassword(e.target.value)} />
              <span className="wmx-hint">Confirm your password to change your email.</span>
            </div>
            {emailMsg.text && <p className={`wmx-inline-msg wmx-msg-${emailMsg.type}`}>{emailMsg.text}</p>}
            <button className="wmx-btn-save" onClick={handleEmailChange} disabled={emailSaving}
              style={{ marginTop: '1.4rem' }}>
              {emailSaving ? 'Updating…' : 'Update Email'}
            </button>
          </>
        )}
      </div>

      {/* Password */}
      <div className="wmx-card">
        <p className="wmx-card-title"><FontAwesomeIcon icon={faKey} /> Change Password</p>
        <p className="wmx-card-desc">Use a strong, unique password you don't use anywhere else.</p>

        <div className="wmx-form-group">
          <label className="wmx-label">Current Password</label>
          <div className="wmx-input-wrap">
            <input className="wmx-input" type={vis.cur ? 'text' : 'password'} placeholder="••••••••"
              value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <button className="wmx-eye-btn" onClick={() => toggle('cur')}><FontAwesomeIcon icon={vis.cur ? faEyeSlash : faEye} /></button>
          </div>
        </div>

        <div className="wmx-form-row">
          <div className="wmx-form-group">
            <label className="wmx-label">New Password</label>
            <div className="wmx-input-wrap">
              <input className="wmx-input" type={vis.nxt ? 'text' : 'password'} placeholder="••••••••"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <button className="wmx-eye-btn" onClick={() => toggle('nxt')}><FontAwesomeIcon icon={vis.nxt ? faEyeSlash : faEye} /></button>
            </div>
          </div>
          <div className="wmx-form-group">
            <label className="wmx-label">Confirm New Password</label>
            <div className="wmx-input-wrap">
              <input className="wmx-input" type={vis.cfm ? 'text' : 'password'} placeholder="••••••••"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <button className="wmx-eye-btn" onClick={() => toggle('cfm')}><FontAwesomeIcon icon={vis.cfm ? faEyeSlash : faEye} /></button>
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
        <p className="wmx-danger-title"><FontAwesomeIcon icon={faTriangleExclamation} /> Danger Zone</p>
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
            <div className="wmx-modal-icon"><FontAwesomeIcon icon={faTriangleExclamation} /></div>
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
    messages:  true,
    sales:     true,
    purchases: true,
    marketing: false,
    push:      false,
  });
  const [msg, setMsg]       = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API}/auth/getuser`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        if (data?.user?.notifications) setToggles(t => ({ ...t, ...data.user.notifications }));
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
        body: JSON.stringify(toggles),
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
    { key: 'messages',  title: 'New Message',        desc: 'When a buyer or seller sends you a message' },
    { key: 'sales',     title: 'New Sale',           desc: 'When someone purchases your product' },
    { key: 'purchases', title: 'New Purchase',       desc: 'Order confirmation for your own purchases' },
    { key: 'marketing', title: 'Marketing Emails',   desc: 'Deals, new features, and platform highlights' },
    { key: 'push',      title: 'Push Notifications', desc: 'Browser and mobile push alerts' },
  ];

  return (
    <div className="wmx-panel">
      <div className="wmx-card">
        <p className="wmx-card-title"><FontAwesomeIcon icon={faBell} /> Notification Preferences</p>
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
  const [twoFALoading, setTwoFALoading] = useState(true);
  const [setupStep, setSetupStep]   = useState(null); // null | 'qr' | 'backupCodes'
  const [qrCode, setQrCode]         = useState('');
  const [manualSecret, setManualSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [backupCodes, setBackupCodes]   = useState([]);
  const [twoFAMsg, setTwoFAMsg]     = useState({ text: '', type: '' });
  const [twoFABusy, setTwoFABusy]   = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disablePassword, setDisablePassword]       = useState('');
  const [disableCode, setDisableCode]               = useState('');
  const [isGoogleAccount, setIsGoogleAccount]       = useState(false);

  const [sessions, setSessions]         = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [revokingId, setRevokingId]     = useState(null);

  const [loginHistory, setLoginHistory]     = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API}/auth/getuser`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        setTwoFA(!!data?.user?.twoFactor?.enabled);
        setIsGoogleAccount(data?.user?.provider === 'google');
      })
      .catch(() => {})
      .finally(() => setTwoFALoading(false));

    fetch(`${API}/auth/login-history`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        if (data?.loginHistory) setLoginHistory(data.loginHistory);
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));

    fetch(`${API}/auth/sessions`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        if (data?.sessions) setSessions(data.sessions);
      })
      .catch(() => {})
      .finally(() => setSessionsLoading(false));
  }, []);

  const startTwoFASetup = async () => {
    setTwoFABusy(true);
    setTwoFAMsg({ text: '', type: '' });
    const token = localStorage.getItem('token');
    try {
      const res  = await fetch(`${API}/auth/2fa/setup`, { method: 'POST', headers: { token } });
      const data = await res.json();
      if (res.ok) {
        setQrCode(data.qrCode);
        setManualSecret(data.secret);
        setSetupStep('qr');
      } else {
        setTwoFAMsg({ text: data.error || 'Failed to start setup', type: 'error' });
      }
    } catch {
      setTwoFAMsg({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setTwoFABusy(false);
    }
  };

  const confirmTwoFASetup = async () => {
    if (!verifyCode) return;
    setTwoFABusy(true);
    setTwoFAMsg({ text: '', type: '' });
    const token = localStorage.getItem('token');
    try {
      const res  = await fetch(`${API}/auth/2fa/verify-setup`, {
        method: 'POST',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setBackupCodes(data.backupCodes);
        setSetupStep('backupCodes');
        setTwoFA(true);
        setVerifyCode('');
      } else {
        setTwoFAMsg({ text: data.error || 'Invalid code', type: 'error' });
      }
    } catch {
      setTwoFAMsg({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setTwoFABusy(false);
    }
  };

  const finishTwoFASetup = () => {
    setSetupStep(null);
    setQrCode('');
    setManualSecret('');
    setBackupCodes([]);
  };

  const cancelTwoFASetup = () => {
    setSetupStep(null);
    setQrCode('');
    setManualSecret('');
    setVerifyCode('');
    setTwoFAMsg({ text: '', type: '' });
  };

  const disableTwoFA = async () => {
    setTwoFABusy(true);
    setTwoFAMsg({ text: '', type: '' });
    const token = localStorage.getItem('token');
    try {
      const res  = await fetch(`${API}/auth/2fa/disable`, {
        method: 'POST',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isGoogleAccount ? { code: disableCode } : { password: disablePassword }
        ),
      });
      const data = await res.json();
      if (res.ok) {
        setTwoFA(false);
        setShowDisableConfirm(false);
        setDisablePassword('');
        setDisableCode('');
      } else {
        setTwoFAMsg({ text: data.error || 'Failed to disable 2FA', type: 'error' });
      }
    } catch {
      setTwoFAMsg({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setTwoFABusy(false);
    }
  };

  const revokeSession = async (sessionId) => {
    setRevokingId(sessionId);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { token },
      });
      if (res.ok) {
        setSessions(s => s.filter(x => x.sessionId !== sessionId));
      }
    } catch {
      /* leave the session in the list; user can retry */
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="wmx-panel">
      {/* 2FA */}
      <div className="wmx-card">
        <p className="wmx-card-title"><FontAwesomeIcon icon={faLock} /> Two-Factor Authentication</p>
        <p className="wmx-card-desc">Add an extra layer of security using an authenticator app.</p>

        {twoFALoading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>

        ) : setupStep === 'qr' ? (
          <div style={{ marginTop: '0.5rem' }}>
            <p className="wmx-hint" style={{ display: 'block', marginBottom: '0.8rem' }}>
              Scan this QR code with Google Authenticator, Authy, or any TOTP app, then enter the
              6-digit code it shows to confirm.
            </p>
            {qrCode && (
              <img src={qrCode} alt="2FA QR code" style={{ width: 180, height: 180, borderRadius: 8, background: '#fff', padding: 8 }} />
            )}
            <p className="wmx-hint" style={{ display: 'block', margin: '0.6rem 0' }}>
              Can't scan? Enter this key manually: <code style={{ userSelect: 'all' }}>{manualSecret}</code>
            </p>
            <div className="wmx-form-group">
              <label className="wmx-label">6-digit code</label>
              <input className="wmx-input" type="text" inputMode="numeric" maxLength={6}
                placeholder="123456" value={verifyCode}
                onChange={e => setVerifyCode(e.target.value.trim())}
                onKeyDown={e => e.key === 'Enter' && confirmTwoFASetup()}
                style={{ maxWidth: 160 }} />
            </div>
            {twoFAMsg.text && <p className={`wmx-inline-msg wmx-msg-${twoFAMsg.type}`}>{twoFAMsg.text}</p>}
            <div className="wmx-inline-btns">
              <button className="wmx-btn-save" onClick={confirmTwoFASetup} disabled={twoFABusy}>
                {twoFABusy ? 'Verifying…' : 'Verify & Enable'}
              </button>
              <button className="wmx-btn-ghost" onClick={cancelTwoFASetup}>Cancel</button>
            </div>
          </div>

        ) : setupStep === 'backupCodes' ? (
          <div style={{ marginTop: '0.5rem' }}>
            <p className="wmx-inline-msg wmx-msg-success">Two-factor authentication is now active.</p>
            <p className="wmx-hint" style={{ display: 'block', marginBottom: '0.8rem' }}>
              Save these one-time backup codes somewhere safe. Each one can be used once to sign in
              if you lose access to your authenticator app. They won't be shown again.
            </p>
            <div className="wmx-table-wrapper">
              <table className="wmx-table">
                <tbody>
                  {backupCodes.map((c, i) => (
                    <tr key={i}><td style={{ fontFamily: 'monospace' }}>{c}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="wmx-btn-save" onClick={finishTwoFASetup} style={{ marginTop: '1rem' }}>
              I've saved my backup codes
            </button>
          </div>

        ) : twoFA ? (
          <>
            <div className="wmx-toggle-row" style={{ borderBottom: 'none' }}>
              <div className="wmx-toggle-info">
                <p className="wmx-toggle-title">Enable 2FA</p>
                <p className="wmx-toggle-desc">Active — your account has extra protection</p>
              </div>
              <label className="wmx-switch">
                <input type="checkbox" checked={twoFA} onChange={() => setShowDisableConfirm(true)} />
                <span className="wmx-switch-track" />
              </label>
            </div>

            {showDisableConfirm && (
              <div style={{ marginTop: '1rem' }}>
                <div className="wmx-form-group" style={{ margin: 0 }}>
                  {isGoogleAccount ? (
                    <>
                      <label className="wmx-label">Enter your authenticator code to disable 2FA</label>
                      <input className="wmx-input" type="text" inputMode="numeric" maxLength={6}
                        placeholder="123456" style={{ maxWidth: 160 }}
                        value={disableCode} onChange={e => setDisableCode(e.target.value.trim())}
                        onKeyDown={e => e.key === 'Enter' && disableTwoFA()} />
                      <span className="wmx-hint">This account signs in with Google, so a code confirms it's you instead of a password.</span>
                    </>
                  ) : (
                    <>
                      <label className="wmx-label">Enter your password to disable 2FA</label>
                      <input className="wmx-input" type="password" placeholder="••••••••"
                        value={disablePassword} onChange={e => setDisablePassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && disableTwoFA()} />
                    </>
                  )}
                </div>
                {twoFAMsg.text && <p className={`wmx-inline-msg wmx-msg-${twoFAMsg.type}`}>{twoFAMsg.text}</p>}
                <div className="wmx-inline-btns" style={{ marginTop: '0.8rem' }}>
                  <button className="wmx-btn-danger" onClick={disableTwoFA} disabled={twoFABusy}>
                    {twoFABusy ? 'Disabling…' : 'Disable 2FA'}
                  </button>
                  <button className="wmx-btn-ghost" onClick={() => { setShowDisableConfirm(false); setDisablePassword(''); setDisableCode(''); }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>

        ) : (
          <div className="wmx-toggle-row" style={{ borderBottom: 'none' }}>
            <div className="wmx-toggle-info">
              <p className="wmx-toggle-title">Enable 2FA</p>
              <p className="wmx-toggle-desc">Disabled — only a password protects your account</p>
              {twoFAMsg.text && <p className={`wmx-inline-msg wmx-msg-${twoFAMsg.type}`}>{twoFAMsg.text}</p>}
            </div>
            <label className="wmx-switch">
              <input type="checkbox" checked={twoFA} onChange={startTwoFASetup} disabled={twoFABusy} />
              <span className="wmx-switch-track" />
            </label>
          </div>
        )}
      </div>

      {/* Active sessions */}
      <div className="wmx-card">
        <p className="wmx-card-title"><FontAwesomeIcon icon={faSatelliteDish} /> Active Sessions</p>
        <p className="wmx-card-desc">Devices currently signed into your account.</p>
        <div className="wmx-session-list">
          {sessionsLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
          ) : sessions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No active sessions found.</p>
          ) : (
            sessions.map(s => (
              <div key={s.sessionId} className="wmx-session-item">
                <span className="wmx-session-icon"><FontAwesomeIcon icon={sessionIcon(s.device)} /></span>
                <div className="wmx-session-info">
                  <p className="wmx-session-device">{s.device}</p>
                  <p className="wmx-session-meta">{maskIp(s.ip)} · {timeAgo(s.lastActive)}</p>
                </div>
                <span className={`wmx-session-badge ${s.current ? 'wmx-current' : 'wmx-other'}`}>
                  {s.current ? 'This device' : 'Active'}
                </span>
                {!s.current && (
                  <button className="wmx-btn-revoke" onClick={() => revokeSession(s.sessionId)}
                    disabled={revokingId === s.sessionId}>
                    {revokingId === s.sessionId ? 'Revoking…' : 'Revoke'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Login history */}
      <div className="wmx-card">
        <p className="wmx-card-title"><FontAwesomeIcon icon={faClipboardList} /> Login History</p>
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
              {historyLoading ? (
                <tr><td colSpan={3} style={{ color: 'var(--text-muted)' }}>Loading…</td></tr>
              ) : loginHistory.length === 0 ? (
                <tr><td colSpan={3} style={{ color: 'var(--text-muted)' }}>No login activity yet.</td></tr>
              ) : (
                loginHistory.map(h => (
                  <tr key={h._id}>
                    <td style={{ color: h.event.startsWith('Failed') ? '#ff6b6b' : undefined }}>
                      {h.event}
                    </td>
                    <td>{new Date(h.date).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                    })}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {maskIp(h.ip)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
        const seller = data?.seller;
        if (seller) setForm(f => ({
          ...f,
          shopName:      seller.sellerSettings?.shopName      || seller.name || '',
          tagline:       seller.sellerSettings?.tagline       || '',
          category:      seller.sellerSettings?.category      || 'UI / UX Design',
          payout:        seller.sellerSettings?.payoutPreference || 'bank',
          listingPublic: (seller.sellerSettings?.listingVisibility || 'public') !== 'private',
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
        body: JSON.stringify({
          shopName: form.shopName,
          tagline: form.tagline,
          category: form.category,
          payoutPreference: form.payout,
          listingVisibility: form.listingPublic ? 'public' : 'private',
        }),
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
          <p className="wmx-card-title"><FontAwesomeIcon icon={faStore} /> Shop Details</p>
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
    fetch(`${API}/auth/getuser`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        if (data?.user?.preferences) {
          const { theme: savedTheme, ...rest } = data.user.preferences;
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
        body: JSON.stringify({ ...prefs, theme: selectedTheme }),
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
        <p className="wmx-card-title"><FontAwesomeIcon icon={faGlobe} /> Language &amp; Region</p>
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
        <FontAwesomeIcon icon={faHardHat} /> This section is coming soon. We're working on it!
      </div>

      <div className="wmx-card">
        <p className="wmx-card-title"><FontAwesomeIcon icon={faLink} /> Connected Accounts</p>
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
                  <span className="wmx-sidebar-icon"><FontAwesomeIcon icon={item.icon} /></span>
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
