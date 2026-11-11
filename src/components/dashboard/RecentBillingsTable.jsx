import React, { useState } from 'react';
import { Search, Eye, Send, CheckCircle, Filter, FileText, AlertCircle } from 'lucide-react';
import { formatRupiah, formatDateIndo, getStatusBillingBadge } from '../../utils/formatters';

export default function RecentBillingsTable({ billings, onSelectBilling, onOpenWaSim, onMarkAsPaid }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Count totals for tab badges
  const totalCount = billings.length;
  const paidCount = billings.filter(b => b.status === 'paid').length;
  const pendingCount = billings.filter(b => b.status === 'pending').length;
  const overdueCount = billings.filter(b => b.status === 'overdue').length;

  const filteredBillings = billings.filter((b) => {
    // Status filter
    if (activeFilter === 'paid' && b.status !== 'paid') return false;
    if (activeFilter === 'pending' && b.status !== 'pending') return false;
    if (activeFilter === 'overdue' && b.status !== 'overdue') return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = b.tenantName.toLowerCase().includes(q);
      const matchRoom = b.roomNumber.toLowerCase().includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      return matchName || matchRoom || matchId;
    }
    return true;
  });

  return (
    <div className="card billings-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Daftar Tagihan Bulanan Berjalan</h3>
          <p className="card-subtitle">Pengelolaan status penagihan sewa kamar Kos Srirahayu</p>
        </div>

        {/* Search Bar */}
        <div className="table-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Cari penghuni, kamar, atau invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="table-filter-bar">
        <button
          type="button"
          className={`tab-btn ${activeFilter === 'all' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          Semua Status <span className="tab-counter">{totalCount}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeFilter === 'paid' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveFilter('paid')}
        >
          Lunas <span className="tab-counter count-success">{paidCount}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeFilter === 'pending' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Menunggu <span className="tab-counter count-warning">{pendingCount}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeFilter === 'overdue' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveFilter('overdue')}
        >
          Terlambat <span className="tab-counter count-danger">{overdueCount}</span>
        </button>
      </div>

      <div className="table-responsive">
        {filteredBillings.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={36} className="text-muted" />
            <p className="empty-title">Tidak ada data tagihan</p>
            <p className="empty-desc">
              Tidak ada tagihan yang cocok dengan filter atau kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>No. Invoice</th>
                <th>Penghuni & Kamar</th>
                <th>Periode</th>
                <th>Jatuh Tempo</th>
                <th>Total Nominal</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBillings.map((b) => {
                const badge = getStatusBillingBadge(b.status);
                return (
                  <tr key={b.id}>
                    <td>
                      <span className="invoice-code">{b.id}</span>
                    </td>
                    <td>
                      <div className="tenant-cell">
                        <span className="tenant-name">{b.tenantName}</span>
                        <span className="room-sub">Kamar {b.roomNumber}</span>
                      </div>
                    </td>
                    <td>{b.period}</td>
                    <td>
                      <span className={b.status === 'overdue' ? 'text-rose font-semibold' : ''}>
                        {formatDateIndo(b.dueDate)}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-800">{formatRupiah(b.totalAmount)}</span>
                    </td>
                    <td>
                      <span className={`badge ${badge.className}`}>
                        <span className="badge-dot"></span>
                        {badge.label}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-wrap">
                        <button
                          type="button"
                          className="action-icon-btn"
                          title="Lihat Rincian Tagihan"
                          onClick={() => onSelectBilling(b)}
                        >
                          <Eye size={15} />
                        </button>

                        {b.status !== 'paid' && (
                          <button
                            type="button"
                            className="action-icon-btn text-emerald"
                            title="Kirim Pengingat WhatsApp (Simulasi)"
                            onClick={() => onOpenWaSim(b)}
                          >
                            <Send size={15} />
                          </button>
                        )}

                        {b.status !== 'paid' && onMarkAsPaid && (
                          <button
                            type="button"
                            className="action-icon-btn text-primary"
                            title="Konfirmasi Lunas"
                            onClick={() => onMarkAsPaid(b.id)}
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
