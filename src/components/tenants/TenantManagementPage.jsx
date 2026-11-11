import React, { useState, useMemo } from 'react';
import {
  Users, BedDouble, Receipt, Wallet, AlertTriangle, CheckCircle2,
  Plus, Search, Edit3, Trash2, Eye, X, Phone, Calendar, UserX,
  Clock, TrendingUp, FileText
} from 'lucide-react';
import TenantFormModal from './TenantFormModal';
import BillingFormModal from './BillingFormModal';
import PaymentConfirmModal from './PaymentConfirmModal';
import { formatRupiah, formatDateIndo, getStatusBillingBadge } from '../../utils/formatters';
import './TenantManagement.css';

export default function TenantManagementPage({
  rooms = [],
  roomTypes = [],
  tenants = [],
  billings = [],
  onUpdateTenants,
  onUpdateBillings,
  onUpdateRooms
}) {
  const [activeTab, setActiveTab] = useState('tenants'); // 'tenants' | 'billings' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [billingFilter, setBillingFilter] = useState('all');

  // Modal states
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [isDeleteTenantOpen, setIsDeleteTenantOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  /* ============ KPI Stats ============ */
  const activeTenants = tenants.filter((t) => t.status === 'active');
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const pendingBillings = billings.filter((b) => b.status === 'pending');
  const paidBillings = billings.filter((b) => b.status === 'paid');
  const overdueBillings = billings.filter((b) => b.status === 'overdue');
  const totalUnpaid = [...pendingBillings, ...overdueBillings].reduce((a, b) => a + b.totalAmount, 0);
  const totalCollected = paidBillings.reduce((a, b) => a + b.totalAmount, 0);

  /* ============ Filtered Tenants ============ */
  const filteredTenants = useMemo(() => {
    if (!searchQuery.trim()) return activeTenants;
    const q = searchQuery.toLowerCase();
    return activeTenants.filter(
      (t) => t.name.toLowerCase().includes(q) || t.phone.includes(q)
    );
  }, [activeTenants, searchQuery]);

  /* ============ Filtered Billings ============ */
  const filteredBillings = useMemo(() => {
    let result = billings;
    if (billingFilter !== 'all') {
      result = result.filter((b) => b.status === billingFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) => b.tenantName?.toLowerCase().includes(q) || b.invoiceNumber?.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [billings, billingFilter, searchQuery]);

  /* ============ Payment History ============ */
  const paymentHistory = useMemo(() => {
    return paidBillings
      .sort((a, b) => new Date(b.paymentDate || b.createdAt) - new Date(a.paymentDate || a.createdAt));
  }, [paidBillings]);

  /* ============ Handlers ============ */

  // Sinkronisasi status kamar dengan perubahan data penghuni
  const syncRoomStatus = (updatedTenants, context = {}) => {
    const updatedRooms = rooms.map((room) => {
      // Cari tenant yang menempati kamar ini
      const assignedTenant = updatedTenants.find(
        (t) => t.roomId === room.id && t.status === 'active'
      );
      if (assignedTenant) {
        return { ...room, status: 'occupied', tenantId: assignedTenant.id };
      }
      // Jika tidak ada tenant aktif dan kamar sedang occupied, kembalikan ke available
      if (room.status === 'occupied' && !room.tenantId) return room;
      // Cek apakah tenant lama masih ada
      const oldTenantStillThere = updatedTenants.find(
        (t) => t.id === room.tenantId && t.status === 'active' && t.roomId === room.id
      );
      if (!oldTenantStillThere && room.status === 'occupied') {
        return { ...room, status: 'available', tenantId: null };
      }
      return room;
    });
    onUpdateRooms(updatedRooms);
  };

  // Simpan tenant (tambah/edit)
  const handleSaveTenant = (tenantData) => {
    let updatedTenants;
    if (editingTenant) {
      updatedTenants = tenants.map((t) => (t.id === tenantData.id ? tenantData : t));
      showToast(`Penghuni "${tenantData.name}" berhasil diperbarui`);
    } else {
      updatedTenants = [...tenants, tenantData];
      showToast(`Penghuni "${tenantData.name}" berhasil didaftarkan`);
    }
    onUpdateTenants(updatedTenants);
    // Update room: kamar baru jadi occupied, kamar lama (jika ganti) jadi available
    const updatedRooms = rooms.map((r) => {
      // Kamar baru tenant -> occupied
      if (r.id === tenantData.roomId) {
        return { ...r, status: 'occupied', tenantId: tenantData.id };
      }
      // Kamar lama (jika ganti kamar) -> available
      if (editingTenant && r.id === editingTenant.roomId && r.id !== tenantData.roomId) {
        return { ...r, status: 'available', tenantId: null };
      }
      return r;
    });
    onUpdateRooms(updatedRooms);
    setEditingTenant(null);
  };

  // Hapus tenant
  const handleDeleteTenant = () => {
    if (!tenantToDelete) return;
    // Cek apakah ada tagihan belum lunas
    const hasUnpaidBills = billings.some(
      (b) => b.tenantId === tenantToDelete.id && b.status !== 'paid'
    );
    if (hasUnpaidBills) {
      showToast('Tidak bisa menghapus: masih ada tagihan belum lunas');
      setIsDeleteTenantOpen(false);
      setTenantToDelete(null);
      return;
    }
    // Hapus tenant dan kosongkan kamar
    const updatedTenants = tenants.filter((t) => t.id !== tenantToDelete.id);
    onUpdateTenants(updatedTenants);
    const updatedRooms = rooms.map((r) => {
      if (r.id === tenantToDelete.roomId) {
        return { ...r, status: 'available', tenantId: null };
      }
      return r;
    });
    onUpdateRooms(updatedRooms);
    showToast(`Penghuni "${tenantToDelete.name}" telah dihapus`);
    setIsDeleteTenantOpen(false);
    setTenantToDelete(null);
  };

  // Buat tagihan
  const handleSaveBilling = (billingData) => {
    onUpdateBillings([...billings, billingData]);
    showToast(`Tagihan ${billingData.invoiceNumber} untuk ${billingData.tenantName} berhasil dibuat`);
  };

  // Konfirmasi pembayaran
  const handleConfirmPayment = (billingId, paymentMethod, paymentDate, notes) => {
    const updated = billings.map((b) => {
      if (b.id === billingId) {
        return {
          ...b,
          status: 'paid',
          paymentDate,
          paymentMethod,
          paymentNotes: notes || '',
        };
      }
      return b;
    });
    onUpdateBillings(updated);
    const bill = billings.find((b) => b.id === billingId);
    showToast(`Pembayaran ${bill?.invoiceNumber} dikonfirmasi lunas`);
  };

  // Update status tagihan yang overdue (sederhana: check due date)
  const checkOverdue = () => {
    const today = new Date().toISOString().split('T')[0];
    const updated = billings.map((b) => {
      if (b.status === 'pending' && b.dueDate < today) {
        return { ...b, status: 'overdue' };
      }
      return b;
    });
    // Cek apakah ada perubahan
    const hasChange = updated.some((b, i) => b.status !== billings[i]?.status);
    if (hasChange) onUpdateBillings(updated);
  };

  // Auto-check overdue on render (lightweight)
  useMemo(() => { checkOverdue(); }, [billings]);

  /* ============ Render ============ */
  return (
    <div className="tenant-module-container">
      {/* Header Banner */}
      <div className="module-header-banner">
        <div className="module-header-info">
          <div className="module-header-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <Users size={26} />
          </div>
          <div>
            <h2 className="module-header-title">Penghuni &amp; Tagihan</h2>
            <p className="module-header-desc">
              Kelola data penghuni, tagihan sewa bulanan, dan riwayat pembayaran.
            </p>
          </div>
        </div>
        <div className="module-header-actions">
          <button type="button" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => { setEditingTenant(null); setIsTenantModalOpen(true); }}>
            <Plus size={16} /> Tambah Penghuni
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsBillingModalOpen(true)}>
            <Receipt size={16} /> Buat Tagihan
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="tenant-stats-grid">
        <div className="tenant-stat-card">
          <div className="tenant-stat-icon" style={{ background: 'var(--indigo-50)' }}>
            <Users size={22} className="text-indigo-600" style={{ color: 'var(--indigo-600)' }} />
          </div>
          <div>
            <div className="tenant-stat-value">{activeTenants.length}</div>
            <div className="tenant-stat-label">Penghuni Aktif</div>
          </div>
        </div>
        <div className="tenant-stat-card">
          <div className="tenant-stat-icon" style={{ background: 'var(--primary-50)' }}>
            <BedDouble size={22} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div>
            <div className="tenant-stat-value">{occupiedRooms} / {rooms.length}</div>
            <div className="tenant-stat-label">Kamar Terisi</div>
          </div>
        </div>
        <div className="tenant-stat-card">
          <div className="tenant-stat-icon" style={{ background: 'var(--amber-50)' }}>
            <AlertTriangle size={22} style={{ color: 'var(--amber-600)' }} />
          </div>
          <div>
            <div className="tenant-stat-value">{pendingBillings.length + overdueBillings.length}</div>
            <div className="tenant-stat-label">Tagihan Belum Lunas</div>
          </div>
        </div>
        <div className="tenant-stat-card">
          <div className="tenant-stat-icon" style={{ background: 'var(--emerald-50)' }}>
            <Wallet size={22} style={{ color: 'var(--emerald-600)' }} />
          </div>
          <div>
            <div className="tenant-stat-value">{formatRupiah(totalCollected)}</div>
            <div className="tenant-stat-label">Pemasukan Terkumpul</div>
          </div>
        </div>
        <div className="tenant-stat-card">
          <div className="tenant-stat-icon" style={{ background: 'var(--rose-50)' }}>
            <TrendingUp size={22} style={{ color: 'var(--rose-600)' }} />
          </div>
          <div>
            <div className="tenant-stat-value">{formatRupiah(totalUnpaid)}</div>
            <div className="tenant-stat-label">Tunggakan</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tenant-tabs">
        <button type="button" className={`tenant-tab-btn ${activeTab === 'tenants' ? 'active' : ''}`} onClick={() => setActiveTab('tenants')}>
          <Users size={15} /> Daftar Penghuni
          <span className="tenant-tab-count">{activeTenants.length}</span>
        </button>
        <button type="button" className={`tenant-tab-btn ${activeTab === 'billings' ? 'active' : ''}`} onClick={() => setActiveTab('billings')}>
          <Receipt size={15} /> Tagihan Bulanan
          <span className="tenant-tab-count">{billings.length}</span>
        </button>
        <button type="button" className={`tenant-tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          <CheckCircle2 size={15} /> Riwayat Pembayaran
          <span className="tenant-tab-count">{paidBillings.length}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="tenant-toolbar">
        <div className="tenant-toolbar-left">
          <div className="table-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={activeTab === 'history' ? 'Cari nama atau invoice...' : 'Cari nama penghuni...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Billing filter tabs */}
          {activeTab === 'billings' && (
            <div className="billing-filter-tabs">
              <button type="button" className={`billing-filter-tab ${billingFilter === 'all' ? 'active' : ''}`} onClick={() => setBillingFilter('all')}>
                Semua <span className="tab-counter">{billings.length}</span>
              </button>
              <button type="button" className={`billing-filter-tab ${billingFilter === 'pending' ? 'active' : ''}`} onClick={() => setBillingFilter('pending')}>
                Menunggu <span className="tab-counter">{pendingBillings.length}</span>
              </button>
              <button type="button" className={`billing-filter-tab ${billingFilter === 'overdue' ? 'active' : ''}`} onClick={() => setBillingFilter('overdue')}>
                Terlambat <span className="tab-counter">{overdueBillings.length}</span>
              </button>
              <button type="button" className={`billing-filter-tab ${billingFilter === 'paid' ? 'active' : ''}`} onClick={() => setBillingFilter('paid')}>
                Lunas <span className="tab-counter">{paidBillings.length}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== TAB: DAFTAR PENHUNI ===== */}
      {activeTab === 'tenants' && (
        <div className="tenant-table-wrap">
          {filteredTenants.length === 0 ? (
            <div className="tenant-empty">
              <UserX size={40} style={{ color: 'var(--slate-300)', margin: '0 auto' }} />
              <h3>{activeTenants.length === 0 ? 'Belum Ada Penghuni Terdaftar' : 'Tidak Ditemukan'}</h3>
              <p>{activeTenants.length === 0 ? 'Klik "Tambah Penghuni" untuk mendaftarkan penghuni pertama ke kamar yang tersedia.' : 'Coba ubah kata kunci pencarian.'}</p>
            </div>
          ) : (
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>Nama Penghuni</th>
                  <th>WhatsApp</th>
                  <th>Kamar</th>
                  <th>Penghuni</th>
                  <th>Mulai Sewa</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((t) => {
                  const room = rooms.find((r) => r.id === t.roomId);
                  const type = roomTypes.find((ty) => ty.id === room?.typeId);
                  return (
                    <tr key={t.id}>
                      <td className="tenant-name-cell">{t.name}</td>
                      <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={13} className="text-slate-400" />{t.phone}</span></td>
                      <td><span className="room-pill"><BedDouble size={12} />Kamar {room?.number}</span></td>
                      <td><span className="occupant-badge">{t.occupantCount} orang</span></td>
                      <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--slate-600)' }}><Calendar size={13} className="text-slate-400" />{formatDateIndo(t.leaseStart)}</span></td>
                      <td>
                        <div className="tenant-action-btns">
                          <button type="button" className="tenant-action-btn" onClick={() => { setEditingTenant(t); setIsTenantModalOpen(true); }} title="Edit">
                            <Edit3 size={14} />
                          </button>
                          <button type="button" className="tenant-action-btn danger" onClick={() => { setTenantToDelete(t); setIsDeleteTenantOpen(true); }} title="Hapus">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== TAB: TAGIHAN BULANAN ===== */}
      {activeTab === 'billings' && (
        <div className="tenant-table-wrap">
          {filteredBillings.length === 0 ? (
            <div className="tenant-empty">
              <Receipt size={40} style={{ color: 'var(--slate-300)', margin: '0 auto' }} />
              <h3>{billings.length === 0 ? 'Belum Ada Tagihan Dibuat' : 'Tidak Ditemukan'}</h3>
              <p>{billings.length === 0 ? 'Klik "Buat Tagihan" untuk membuat tagihan sewa bulanan pertama.' : 'Coba ubah filter atau kata kunci pencarian.'}</p>
            </div>
          ) : (
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Penghuni</th>
                  <th>Kamar</th>
                  <th>Periode</th>
                  <th>Jatuh Tempo</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBillings.map((b) => {
                  const badge = getStatusBillingBadge(b.status);
                  return (
                    <tr key={b.id}>
                      <td><span className="billing-invoice-code">{b.invoiceNumber}</span></td>
                      <td className="tenant-name-cell">{b.tenantName}</td>
                      <td><span className="room-pill"><BedDouble size={12} />Kamar {b.roomNumber}</span></td>
                      <td style={{ fontSize: '0.8125rem' }}>{b.period}</td>
                      <td style={{ fontSize: '0.8125rem' }}>{formatDateIndo(b.dueDate)}</td>
                      <td><span className={`billing-amount ${b.status !== 'paid' ? 'unpaid' : ''}`}>{formatRupiah(b.totalAmount)}</span></td>
                      <td>
                        <span className={`badge ${badge.className}`}>
                          <span className="badge-dot" style={{ backgroundColor: badge.dotColor }} />
                          {badge.label}
                        </span>
                      </td>
                      <td>
                        <div className="tenant-action-btns">
                          {b.status !== 'paid' && (
                            <button type="button" className="tenant-action-btn success" onClick={() => { setSelectedBilling(b); setIsPaymentModalOpen(true); }} title="Konfirmasi Pembayaran">
                              <CheckCircle2 size={14} />
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
      )}

      {/* ===== TAB: RIWAYAT PEMBAYARAN ===== */}
      {activeTab === 'history' && (
        <div className="tenant-table-wrap">
          {paymentHistory.length === 0 ? (
            <div className="tenant-empty">
              <FileText size={40} style={{ color: 'var(--slate-300)', margin: '0 auto' }} />
              <h3>Belum Ada Riwayat Pembayaran</h3>
              <p>Riwayat pembayaran akan muncul di sini setelah tagihan dikonfirmasi lunas.</p>
            </div>
          ) : (
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Penghuni</th>
                  <th>Kamar</th>
                  <th>Periode</th>
                  <th>Tanggal Bayar</th>
                  <th>Metode</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((b) => (
                  <tr key={b.id}>
                    <td><span className="billing-invoice-code">{b.invoiceNumber}</span></td>
                    <td className="tenant-name-cell">{b.tenantName}</td>
                    <td><span className="room-pill"><BedDouble size={12} />Kamar {b.roomNumber}</span></td>
                    <td style={{ fontSize: '0.8125rem' }}>{b.period}</td>
                    <td style={{ fontSize: '0.8125rem' }}>{formatDateIndo(b.paymentDate)}</td>
                    <td style={{ fontSize: '0.8125rem' }}>{b.paymentMethod || '-'}</td>
                    <td><span className="billing-amount">{formatRupiah(b.totalAmount)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== MODALS ===== */}
      <TenantFormModal
        isOpen={isTenantModalOpen}
        onClose={() => { setIsTenantModalOpen(false); setEditingTenant(null); }}
        onSave={handleSaveTenant}
        editingTenant={editingTenant}
        rooms={rooms}
        roomTypes={roomTypes}
      />
      <BillingFormModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        onSave={handleSaveBilling}
        tenants={tenants}
        rooms={rooms}
        roomTypes={roomTypes}
        billings={billings}
      />
      <PaymentConfirmModal
        isOpen={isPaymentModalOpen}
        onClose={() => { setIsPaymentModalOpen(false); setSelectedBilling(null); }}
        onConfirm={handleConfirmPayment}
        billing={selectedBilling}
        tenant={tenants.find((t) => t.id === selectedBilling?.tenantId)}
      />

      {/* Delete Tenant Confirmation */}
      {isDeleteTenantOpen && tenantToDelete && (
        <div className="modal-overlay" onClick={() => setIsDeleteTenantOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div className="modal-title">
                <AlertTriangle size={20} className="text-rose-500" />
                <span>Hapus Penghuni</span>
              </div>
              <button type="button" className="btn-icon" onClick={() => setIsDeleteTenantOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>
                Apakah Anda yakin ingin menghapus penghuni <strong>{tenantToDelete.name}</strong>?
                Kamar {rooms.find((r) => r.id === tenantToDelete.roomId)?.number} akan kembali berstatus "Tersedia".
              </p>
              {billings.some((b) => b.tenantId === tenantToDelete.id && b.status !== 'paid') && (
                <div style={{ marginTop: '0.75rem', padding: '0.625rem 0.875rem', background: 'var(--rose-50)', border: '1px solid var(--rose-100)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--rose-700)' }}>
                  <AlertTriangle size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Tidak dapat menghapus: masih ada tagihan belum lunas untuk penghuni ini.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteTenantOpen(false)}>Batal</button>
              <button type="button" className="btn" style={{ background: 'var(--rose-600)', color: 'white' }} onClick={handleDeleteTenant}>
                <Trash2 size={16} /> Hapus Penghuni
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="tenant-toast">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
