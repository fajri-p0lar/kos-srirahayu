import React, { useState, useEffect } from 'react';
import { X, Receipt, Calendar, Check, AlertCircle } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export default function BillingFormModal({
  isOpen,
  onClose,
  onSave,
  tenants,
  rooms,
  roomTypes,
  billings
}) {
  const [tenantId, setTenantId] = useState('');
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setTenantId('');
      const now = new Date();
      setPeriod(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
      // Default due date: tanggal 10 bulan berjalan
      setDueDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-10`);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeTenants = tenants.filter((t) => t.status === 'active');
  const selectedTenant = tenants.find((t) => t.id === tenantId);
  const selectedRoom = rooms.find((r) => r.id === selectedTenant?.roomId);
  const selectedType = roomTypes.find((t) => t.id === selectedRoom?.typeId);

  const basePrice = selectedType?.priceMonthly || 0;
  const additionalFee = selectedTenant ? (selectedTenant.occupantCount - 1) * 100000 : 0;
  const totalAmount = basePrice + additionalFee;

  // Cek apakah sudah ada tagihan untuk tenant+periode yang sama
  const duplicateExists = billings.some(
    (b) => b.tenantId === tenantId && b.period === period
  );

  const validate = () => {
    const errs = {};
    if (!tenantId) errs.tenantId = 'Pilih penghuni';
    if (!period) errs.period = 'Pilih periode tagihan';
    if (!dueDate) errs.dueDate = 'Tanggal jatuh tempo wajib diisi';
    if (duplicateExists) errs.tenantId = 'Tagihan untuk penghuni dan periode ini sudah ada';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate invoice number
    const year = new Date().getFullYear();
    const yearBills = billings.filter((b) => b.invoiceNumber?.includes(`INV-${year}`));
    const seq = String(yearBills.length + 1).padStart(3, '0');

    const billingData = {
      id: `bill-${Date.now()}`,
      invoiceNumber: `INV-${year}-${seq}`,
      tenantId: selectedTenant.id,
      tenantName: selectedTenant.name,
      tenantPhone: selectedTenant.phone,
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.number,
      typeId: selectedType.id,
      typeName: selectedType.name,
      period,
      dueDate,
      components: {
        rent: basePrice,
        additionalOccupant: additionalFee,
      },
      occupantCount: selectedTenant.occupantCount,
      totalAmount,
      status: 'pending',
      paymentDate: null,
      paymentMethod: null,
      createdAt: new Date().toISOString(),
    };

    onSave(billingData);
    onClose();
  };

  const periodLabel = (periodStr) => {
    if (!periodStr) return '-';
    const [y, m] = periodStr.split('-');
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${months[Number(m) - 1]} ${y}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Receipt size={20} className="text-primary" />
            <span>Buat Tagihan Sewa Bulanan</span>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} title="Tutup">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem' }}>
            {activeTenants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <AlertCircle size={36} className="text-amber-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">Belum ada penghuni aktif</p>
                <p className="text-xs text-slate-500 mt-1">Daftarkan penghuni terlebih dahulu di tab "Daftar Penghuni" sebelum membuat tagihan.</p>
              </div>
            ) : (
              <>
                {/* Pilih Penghuni */}
                <div className="form-group">
                  <label className="form-label" htmlFor="billing-tenant">
                    <span>Pilih Penghuni <span className="text-red-500">*</span></span>
                  </label>
                  <select
                    id="billing-tenant"
                    className="form-input"
                    value={tenantId}
                    onChange={(e) => { setTenantId(e.target.value); if (errors.tenantId) setErrors({ ...errors, tenantId: null }); }}
                  >
                    <option value="">— Pilih Penghuni —</option>
                    {activeTenants.map((t) => {
                      const room = rooms.find((r) => r.id === t.roomId);
                      return (
                        <option key={t.id} value={t.id}>
                          {t.name} — Kamar {room?.number || '?'} ({t.occupantCount} orang)
                        </option>
                      );
                    })}
                  </select>
                  {errors.tenantId && <span className="form-error">{errors.tenantId}</span>}
                </div>

                {/* Periode & Jatuh Tempo */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="billing-period">
                      <span>Periode Tagihan <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      id="billing-period"
                      type="month"
                      className="form-input"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    />
                    <span className="text-xs text-muted">{periodLabel(period)}</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="billing-due">
                      <span>Tanggal Jatuh Tempo <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      id="billing-due"
                      type="date"
                      className="form-input"
                      value={dueDate}
                      onChange={(e) => { setDueDate(e.target.value); if (errors.dueDate) setErrors({ ...errors, dueDate: null }); }}
                    />
                    {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
                  </div>
                </div>

                {/* Rincian Tagihan */}
                {selectedTenant && selectedType && (
                  <div style={{ padding: '1rem 1.125rem', background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="text-xs font-bold text-slate-500 uppercase">Rincian Tagihan</span>
                      <span className="text-xs font-semibold text-slate-600">{periodLabel(period)}</span>
                    </div>

                    <div className="billing-breakdown-row">
                      <span>Sewa {selectedType.name} (1 orang)</span>
                      <span className="font-semibold text-slate-800">{formatRupiah(basePrice)}</span>
                    </div>
                    {additionalFee > 0 && (
                      <div className="billing-breakdown-row">
                        <span>Tambahan {selectedTenant.occupantCount - 1} penghuni (× Rp 100.000)</span>
                        <span className="font-semibold text-slate-800">{formatRupiah(additionalFee)}</span>
                      </div>
                    )}
                    <div className="billing-breakdown-row included">
                      <span>Listrik &amp; Air</span>
                      <span className="billing-included-tag">Termasuk</span>
                    </div>
                    <div className="billing-breakdown-row included">
                      <span>Kamar Mandi Dalam</span>
                      <span className="billing-included-tag">Termasuk</span>
                    </div>
                    <div className="billing-breakdown-row total">
                      <span>Total Tagihan</span>
                      <span className="text-primary">{formatRupiah(totalAmount)}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {activeTenants.length > 0 && (
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={16} />
                <span>Buat Tagihan</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
