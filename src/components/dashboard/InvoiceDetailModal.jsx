import React from 'react';
import { X, CheckCircle, Clock, AlertTriangle, Printer, Send } from 'lucide-react';
import { formatRupiah, formatDateIndo, getStatusBillingBadge } from '../../utils/formatters';
import { PROPERTY_INFO } from '../../data/mockData';

export default function InvoiceDetailModal({ billing, onClose, onOpenWaSim, onMarkAsPaid }) {
  if (!billing) return null;

  const statusBadge = getStatusBillingBadge(billing.status);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="proto-badge">INVOICE SEWA BULANAN</span>
            <h3 className="modal-title mt-1">{billing.id}</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body invoice-content">
          {/* Properti & Status Header */}
          <div className="invoice-head-meta">
            <div>
              <h4 className="font-bold text-slate-800">{PROPERTY_INFO.name}</h4>
              <p className="text-xs text-muted mt-1">{PROPERTY_INFO.address}</p>
              <p className="text-xs text-muted">WhatsApp: {PROPERTY_INFO.phone}</p>
            </div>
            <div className="text-right">
              <span className={`badge ${statusBadge.className}`}>
                <span className="badge-dot"></span>
                {statusBadge.label}
              </span>
              <p className="text-xs text-muted mt-1">Periode: <strong>{billing.period}</strong></p>
              <p className="text-xs text-muted">Jatuh Tempo: <strong>{formatDateIndo(billing.dueDate)}</strong></p>
            </div>
          </div>

          <div className="divider my-3"></div>

          {/* Penghuni & Kamar Info */}
          <div className="invoice-tenant-meta">
            <div className="meta-block">
              <span className="meta-label">Nama Penghuni</span>
              <span className="meta-value">{billing.tenantName}</span>
            </div>
            <div className="meta-block">
              <span className="meta-label">Nomor Kamar</span>
              <span className="meta-value">Kamar {billing.roomNumber}</span>
            </div>
            <div className="meta-block">
              <span className="meta-label">Metode Pembayaran</span>
              <span className="meta-value">{billing.paymentMethod || 'Belum Dibayar'}</span>
            </div>
            <div className="meta-block">
              <span className="meta-label">Tanggal Pelunasan</span>
              <span className="meta-value">{billing.paymentDate ? formatDateIndo(billing.paymentDate) : '-'}</span>
            </div>
          </div>

          <div className="divider my-3"></div>

          {/* Rincian Komponen Tagihan */}
          <table className="table invoice-table">
            <thead>
              <tr>
                <th>Komponen Biaya</th>
                <th>Keterangan</th>
                <th className="text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">Sewa Kamar Bulanan</td>
                <td className="text-muted">Kamar {billing.roomNumber} ({billing.period})</td>
                <td className="text-right font-medium">{formatRupiah(billing.rentAmount)}</td>
              </tr>
              <tr>
                <td className="font-medium">Iuran Kebersihan & Air</td>
                <td className="text-muted">Biaya pemeliharaan bersama</td>
                <td className="text-right font-medium">{formatRupiah(billing.waterGarbageAmount)}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="2" className="font-bold text-slate-800">Total Tagihan</td>
                <td className="text-right font-bold text-primary text-base">{formatRupiah(billing.totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          {/* Rekening Pembayaran */}
          <div className="payment-guide-box mt-3">
            <span className="text-xs font-semibold text-slate-700">Rekening Tujuan Pembayaran:</span>
            <p className="text-xs text-slate-600 mt-1">
              Bank <strong>{PROPERTY_INFO.bankAccount.bank}</strong> — 
              No. Rek: <code className="code-badge">{PROPERTY_INFO.bankAccount.accountNumber}</code> 
              (a.n. {PROPERTY_INFO.bankAccount.accountHolder})
            </p>
          </div>
        </div>

        <div className="modal-footer">
          {billing.status !== 'paid' && (
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onClose();
                onOpenWaSim(billing);
              }}
            >
              <Send size={14} className="text-emerald" />
              Simulasi Pengingat WA
            </button>
          )}

          {billing.status !== 'paid' && onMarkAsPaid && (
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => {
                onMarkAsPaid(billing.id);
                onClose();
              }}
            >
              <CheckCircle size={14} />
              Tandai Telah Lunas
            </button>
          )}

          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
