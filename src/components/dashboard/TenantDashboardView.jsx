import React from 'react';
import { User, Home, Calendar, CreditCard, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { formatRupiah, formatDateIndo, getStatusBillingBadge } from '../../utils/formatters';
import { PROPERTY_INFO } from '../../data/mockData';

export default function TenantDashboardView({ currentTenant, room, billings, onOpenInvoiceModal }) {
  if (!currentTenant) {
    return (
      <div className="card p-6 text-center">
        <p className="text-muted">Data akun tenant belum dipilih.</p>
      </div>
    );
  }

  // Filter bills for this tenant only (SOT Rule: Tenant only accesses their own data)
  const tenantBillings = billings.filter(b => b.tenantId === currentTenant.id);
  const activeBill = tenantBillings[0]; // bill berjalan

  return (
    <div className="tenant-view-container animate-fade-in">
      {/* Banner SOT Proteksi Akses */}
      <div className="tenant-privacy-banner">
        <ShieldCheck size={18} className="text-emerald" />
        <div>
          <span className="font-semibold text-xs text-slate-800">Ruang Data Pribadi Penghuni (SOT Modul 3 & 6)</span>
          <p className="text-xs text-slate-600 mt-0.5">
            Sesuai ketentuan, Anda sedang melihat profil dan tagihan milik <strong>{currentTenant.name}</strong> secara privat.
          </p>
        </div>
      </div>

      <div className="tenant-grid-layout mt-4">
        {/* Profil Penghuni & Kamar */}
        <div className="card tenant-profile-card">
          <div className="card-header">
            <h3 className="card-title">Profil & Informasi Kamar</h3>
            <span className="badge badge-info">Penghuni Aktif</span>
          </div>
          <div className="card-body">
            <div className="tenant-avatar-row">
              <div className="tenant-large-avatar">
                <User size={30} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{currentTenant.name}</h4>
                <p className="text-xs text-muted">{currentTenant.phone}</p>
                <p className="text-xs text-muted">No. Identitas: {currentTenant.idNumber}</p>
              </div>
            </div>

            <div className="divider my-4"></div>

            <div className="tenant-detail-list">
              <div className="detail-item">
                <span className="detail-label">Kamar Yang Ditempati</span>
                <span className="detail-val font-bold text-primary">Kamar {currentTenant.roomNumber} (Lt. {room?.floor || 1})</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tanggal Mulai Sewa</span>
                <span className="detail-val">{formatDateIndo(currentTenant.startDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Siklus Pembayaran</span>
                <span className="detail-val">Bulanan (Tiap Tanggal 10)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tagihan Bulan Berjalan */}
        <div className="card tenant-active-bill-card">
          <div className="card-header">
            <h3 className="card-title">Tagihan Sewa Bulan Ini</h3>
            {activeBill && (
              <span className={`badge ${getStatusBillingBadge(activeBill.status).className}`}>
                <span className="badge-dot"></span>
                {getStatusBillingBadge(activeBill.status).label}
              </span>
            )}
          </div>
          <div className="card-body">
            {activeBill ? (
              <div>
                <div className="bill-big-amount">
                  <span className="amount-label">Total Yang Harus Dibayar:</span>
                  <div className="amount-number">{formatRupiah(activeBill.totalAmount)}</div>
                  <span className="text-xs text-muted">Jatuh Tempo: <strong>{formatDateIndo(activeBill.dueDate)}</strong></span>
                </div>

                <div className="divider my-3"></div>

                <div className="bill-breakdown-list">
                  <div className="breakdown-row">
                    <span>Sewa Kamar ({activeBill.period})</span>
                    <span>{formatRupiah(activeBill.rentAmount)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Iuran Kebersihan & Air</span>
                    <span>{formatRupiah(activeBill.waterGarbageAmount)}</span>
                  </div>
                </div>

                <div className="bank-info-box mt-4">
                  <span className="text-xs font-semibold text-slate-700">Petunjuk Pembayaran Transfer:</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Silakan transfer ke rekening <strong>{PROPERTY_INFO.bankAccount.bank} {PROPERTY_INFO.bankAccount.accountNumber}</strong> a.n <strong>{PROPERTY_INFO.bankAccount.accountHolder}</strong>.
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Setelah transfer, konfirmasi bukti pembayaran dapat dikirimkan kepada pengelola via WhatsApp.
                  </p>
                </div>

                <button 
                  type="button" 
                  className="btn btn-primary btn-sm w-full mt-4"
                  onClick={() => onOpenInvoiceModal(activeBill)}
                >
                  Lihat Kuitansi / Rincian Tagihan
                </button>
              </div>
            ) : (
              <p className="text-muted text-center py-4">Belum ada tagihan aktif untuk periode ini.</p>
            )}
          </div>
        </div>
      </div>

      {/* Riwayat Tagihan Milik Penghuni */}
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">Riwayat Pembayaran Anda</h3>
          <span className="text-xs text-muted">Hanya menampilkan riwayat pribadi</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No. Invoice</th>
                <th>Periode</th>
                <th>Jatuh Tempo</th>
                <th>Nominal</th>
                <th>Status</th>
                <th>Tanggal Bayar</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tenantBillings.map((b) => {
                const badge = getStatusBillingBadge(b.status);
                return (
                  <tr key={b.id}>
                    <td><span className="invoice-code">{b.id}</span></td>
                    <td>{b.period}</td>
                    <td>{formatDateIndo(b.dueDate)}</td>
                    <td className="font-semibold">{formatRupiah(b.totalAmount)}</td>
                    <td>
                      <span className={`badge ${badge.className}`}>
                        <span className="badge-dot"></span>
                        {badge.label}
                      </span>
                    </td>
                    <td>{b.paymentDate ? formatDateIndo(b.paymentDate) : '-'}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenInvoiceModal(b)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
