import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Wallet, CreditCard, Banknote, Building2, Calendar } from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

const PAYMENT_METHODS = [
  { id: 'transfer-bca', label: 'Transfer BCA', icon: Building2 },
  { id: 'transfer-lain', label: 'Transfer Bank Lain', icon: CreditCard },
  { id: 'tunai', label: 'Tunai (Cash)', icon: Banknote },
  { id: 'qris', label: 'QRIS / E-Wallet', icon: Wallet },
];

export default function PaymentConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  billing,
  tenant
}) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && billing) {
      setPaymentMethod('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [isOpen, billing]);

  if (!isOpen || !billing) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod || !paymentDate) return;

    const methodLabel = PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || paymentMethod;
    onConfirm(billing.id, methodLabel, paymentDate, notes.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <span>Konfirmasi Pembayaran</span>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} title="Tutup">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem' }}>
            {/* Info tagihan */}
            <div style={{ padding: '0.875rem 1rem', background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="billing-invoice-code">{billing.invoiceNumber}</span>
                <span className="text-xs text-slate-500">{billing.period}</span>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.5rem' }}>
                {tenant?.name || billing.tenantName} — Kamar {billing.roomNumber}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.625rem', paddingTop: '0.625rem', borderTop: '1px dashed var(--slate-300)' }}>
                <span className="text-xs text-slate-500">Total Tagihan</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>{formatRupiah(billing.totalAmount)}</span>
              </div>
            </div>

            {/* Pilih metode pembayaran */}
            <div className="form-group">
              <label className="form-label">
                <span>Metode Pembayaran <span className="text-red-500">*</span></span>
              </label>
              <div className="payment-method-grid">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.id}
                      className={`payment-method-card ${paymentMethod === m.id ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(m.id)}
                    >
                      <Icon size={22} className={paymentMethod === m.id ? 'text-primary' : 'text-slate-500'} />
                      <span>{m.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tanggal pembayaran */}
            <div className="form-group">
              <label className="form-label" htmlFor="payment-date">
                <span>Tanggal Pembayaran <span className="text-red-500">*</span></span>
              </label>
              <input
                id="payment-date"
                type="date"
                className="form-input"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>

            {/* Catatan (opsional) */}
            <div className="form-group">
              <label className="form-label" htmlFor="payment-notes">
                <span>Catatan (opsional)</span>
              </label>
              <input
                id="payment-notes"
                type="text"
                className="form-input"
                placeholder="Contoh: Sudah masuk rekening BCA"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={!paymentMethod || !paymentDate}>
              <CheckCircle2 size={16} />
              <span>Konfirmasi Lunas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
