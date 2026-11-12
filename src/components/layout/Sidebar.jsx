import React from 'react';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  MessageSquare,
  Receipt,
  ShieldAlert,
  Globe,
  Lock
} from 'lucide-react';

export default function Sidebar({ activeModule, onSelectModule, onGoToPublic }) {
  const modules = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      available: true,
    },
    {
      id: 'rooms',
      title: 'Manajemen Kamar',
      icon: BedDouble,
      available: true,
    },
    {
      id: 'tenants',
      title: 'Penghuni & Tagihan',
      icon: Users,
      available: true,
    },
    {
      id: 'whatsapp',
      title: 'Notifikasi WhatsApp',
      icon: MessageSquare,
      available: true,
    },
    {
      id: 'expenses',
      title: 'Pengeluaran & Laporan',
      icon: Receipt,
      available: false,
    },
    {
      id: 'users',
      title: 'Manajemen Pengguna',
      icon: ShieldAlert,
      available: false,
    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand-wrap">
        <div className="sidebar-brand-icon">
          <BedDouble size={18} />
        </div>
        <span className="sidebar-brand-label">Kos Srirahayu</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = activeModule === m.id;
          const isLocked = !m.available;

          return (
            <button
              key={m.id}
              type="button"
              className={`nav-item ${isActive ? 'nav-item-active' : ''} ${isLocked ? 'nav-item-locked' : ''}`}
              onClick={() => !isLocked && onSelectModule(m.id)}
              title={isLocked ? 'Segera hadir' : m.title}
              disabled={isLocked}
            >
              <Icon size={17} className="nav-icon" />
              <span className="nav-label">{m.title}</span>
              {isLocked && <Lock size={12} className="nav-lock-icon" />}
            </button>
          );
        })}
      </nav>

      {/* Website publik link */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="pub-link-btn"
          onClick={onGoToPublic}
        >
          <Globe size={15} />
          <span>Lihat Website Publik</span>
        </button>
        <p className="sidebar-copy">© {new Date().getFullYear()} Kos Srirahayu</p>
      </div>
    </aside>
  );
}
