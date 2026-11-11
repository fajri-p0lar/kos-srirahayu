import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Phone, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  Building2
} from 'lucide-react';

export default function AdminSetupModal({ isOpen, onCompleteSetup }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('admin');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Nama lengkap pengelola wajib diisi';
    if (!username.trim()) errs.username = 'Username wajib diisi';
    if (!phone.trim()) errs.phone = 'Nomor WhatsApp pengelola wajib diisi';
    if (!password) {
      errs.password = 'Kata sandi wajib diisi';
    } else if (password.length < 6) {
      errs.password = 'Kata sandi minimal 6 karakter';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Konfirmasi kata sandi tidak cocok';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const adminAccount = {
      id: `admin-${Date.now()}`,
      fullName: fullName.trim(),
      username: username.trim(),
      phone: phone.trim(),
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    onCompleteSetup(adminAccount);
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(8px)', zIndex: 9999, padding: '1rem' }}>
      <div className="modal-card animate-fade-in" style={{ maxWidth: '500px', maxHeight: '92vh', overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
        {/* Header Visual */}
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '1.25rem 1.5rem', color: '#ffffff', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', boxShadow: '0 6px 14px rgba(37, 99, 235, 0.35)' }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-1.5">
            <Sparkles size={12} />
            <span>Inisialisasi Awal • Kebijakan Zero-Data</span>
          </div>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Setup Akun Administrator Utama
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem', lineHeight: 1.4 }}>
            Sistem Informasi Manajemen & Pembayaran <strong>Kos Srirahayu</strong>
          </p>
        </div>

        {/* Security Notice */}
        <div style={{ padding: '0.65rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={14} className="text-primary shrink-0" />
          <span>
            Database dimulai dalam keadaan <strong>kosong tanpa dummy</strong>. Akun ini memiliki kewenangan penuh menginput data asli.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem', gap: '1rem' }}>
            {/* Nama Lengkap */}
            <div className="form-group">
              <label className="form-label" htmlFor="setup-name">
                <span>Nama Lengkap Pengelola / Pemilik <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <input
                  id="setup-name"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Ibu Srirahayu atau Nama Pengelola"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: null });
                  }}
                  autoFocus
                />
              </div>
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            {/* Username & WhatsApp */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label" htmlFor="setup-username">
                  <span>Username Login <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="setup-username"
                  type="text"
                  className="form-input"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: null });
                  }}
                />
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="setup-phone">
                  <span>No. WhatsApp <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="setup-phone"
                  type="text"
                  className="form-input"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label" htmlFor="setup-password">
                  <span>Kata Sandi <span className="text-red-500">*</span></span>
                </label>
                <div className="relative">
                  <input
                    id="setup-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Min. 6 karakter"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="setup-confirm-password">
                  <span>Ulangi Sandi <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="setup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Ketik ulang kata sandi"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                  }}
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="modal-footer" style={{ padding: '1.25rem 1.5rem', background: '#f8fafc' }}>
            <button
              type="submit"
              className="btn btn-primary w-full py-2.5 font-bold"
              style={{ justifyContent: 'center' }}
            >
              <CheckCircle2 size={18} />
              <span>Daftarkan Akun & Buka Sistem Kos Srirahayu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
