import React from 'react';
import { Bell, Globe } from 'lucide-react';

export default function Navbar({ adminUser, onGoToPublic }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1 className="brand-name">Kos Srirahayu</h1>
        <span className="brand-divider" />
        <span className="brand-subtitle">Panel Pengelola</span>
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          className="navbar-action-btn"
          onClick={onGoToPublic}
          title="Lihat halaman publik"
        >
          <Globe size={16} />
          <span>Website</span>
        </button>

        <button type="button" className="navbar-action-btn navbar-notif-btn" title="Notifikasi">
          <Bell size={16} />
        </button>

        {adminUser && (
          <div className="navbar-user">
            <div className="navbar-avatar">
              {adminUser.fullName?.charAt(0).toUpperCase()}
            </div>
            <span className="navbar-user-name">{adminUser.fullName}</span>
          </div>
        )}
      </div>
    </header>
  );
}
