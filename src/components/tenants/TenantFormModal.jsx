import React, { useState, useEffect } from 'react';
import { X, User, Phone, IdCard, BedDouble, Calendar, Users, Plus, Check } from 'lucide-react';

export default function TenantFormModal({
  isOpen,
  onClose,
  onSave,
  editingTenant,
  rooms,
  roomTypes
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [roomId, setRoomId] = useState('');
  const [occupantCount, setOccupantCount] = useState(1);
  const [leaseStart, setLeaseStart] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTenant) {
      setName(editingTenant.name || '');
      setPhone(editingTenant.phone || '');
      setIdNumber(editingTenant.idNumber || '');
      setRoomId(editingTenant.roomId || '');
      setOccupantCount(editingTenant.occupantCount || 1);
      setLeaseStart(editingTenant.leaseStart || '');
      setEmergencyContact(editingTenant.emergencyContact || '');
      setNotes(editingTenant.notes || '');
    } else {
      setName('');
      setPhone('');
      setIdNumber('');
      setRoomId('');
      setOccupantCount(1);
      setLeaseStart(new Date().toISOString().split('T')[0]);
      setEmergencyContact('');
      setNotes('');
    }
    setErrors({});
  }, [editingTenant, isOpen]);

  if (!isOpen) return null;

  // Kamar yang bisa dipilih: kamar yang tersedia + kamar yang sedang ditempati tenant ini (jika edit)
  const availableRooms = rooms.filter(
    (r) => r.status === 'available' || (editingTenant && r.id === editingTenant.roomId)
  );

  const selectedRoom = rooms.find((r) => r.id === roomId);
  const selectedType = roomTypes.find((t) => t.id === selectedRoom?.typeId);
  const basePrice = selectedType?.priceMonthly || 0;
  const additionalFee = (occupantCount - 1) * 100000;
  const estimatedTotal = basePrice + additionalFee;

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Nama lengkap wajib diisi';
    if (!phone.trim()) errs.phone = 'Nomor WhatsApp wajib diisi';
    if (!roomId) errs.roomId = 'Pilih kamar untuk penghuni';
    if (!leaseStart) errs.leaseStart = 'Tanggal mulai sewa wajib diisi';
    if (occupantCount < 1) errs.occupantCount = 'Minimal 1 penghuni';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tenantData = {
      id: editingTenant ? editingTenant.id : `tenant-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      idNumber: idNumber.trim(),
      roomId,
      occupantCount: Number(occupantCount),
      leaseStart,
      emergencyContact: emergencyContact.trim(),
      notes: notes.trim(),
      status: 'active',
      createdAt: editingTenant ? editingTenant.createdAt : new Date().toISOString(),
    };

    onSave(tenantData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <User size={20} className="text-primary" />
            <span>{editingTenant ? `Edit Penghuni: ${editingTenant.name}` : 'Tambah Penghuni Baru'}</span>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} title="Tutup">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem' }}>
            {/* Nama & No. KTP/KTM */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="tenant-name">
                  <span>Nama Lengkap <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="tenant-name"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Andi Wijaya"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: null }); }}
                  autoFocus
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tenant-id">
                  <span>No. KTP / KTM</span>
                </label>
                <input
                  id="tenant-id"
                  type="text"
                  className="form-input"
                  placeholder="Nomor identitas (opsional)"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                />
              </div>
            </div>

            {/* WhatsApp & Kontak Darurat */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="tenant-phone">
                  <span>Nomor WhatsApp <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="tenant-phone"
                  type="text"
                  className="form-input"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: null }); }}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tenant-emergency">
                  <span>Kontak Darurat</span>
                </label>
                <input
                  id="tenant-emergency"
                  type="text"
                  className="form-input"
                  placeholder="Nama/No. kontak darurat (opsional)"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                />
              </div>
            </div>

            {/* Pilih Kamar */}
            <div className="form-group">
              <label className="form-label" htmlFor="tenant-room">
                <span>Pilih Kamar <span className="text-red-500">*</span></span>
              </label>
              {availableRooms.length === 0 ? (
                <div style={{ padding: '0.75rem', background: 'var(--amber-50)', border: '1px solid var(--amber-100)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--amber-700)' }}>
                  Tidak ada kamar tersedia. Semua kamar sudah terisi atau dalam perawatan.
                </div>
              ) : (
                <select
                  id="tenant-room"
                  className="form-input"
                  value={roomId}
                  onChange={(e) => { setRoomId(e.target.value); if (errors.roomId) setErrors({ ...errors, roomId: null }); }}
                >
                  <option value="">— Pilih Kamar —</option>
                  {availableRooms.map((r) => {
                    const type = roomTypes.find((t) => t.id === r.typeId);
                    return (
                      <option key={r.id} value={r.id}>
                        Kamar {r.number} (Lantai {r.floor}) — {type?.name || 'Tipe?'} — {r.status === 'occupied' && editingTenant?.roomId === r.id ? '(Ditempati)' : 'Tersedia'}
                      </option>
                    );
                  })}
                </select>
              )}
              {errors.roomId && <span className="form-error">{errors.roomId}</span>}
            </div>

            {/* Jumlah Penghuni & Tanggal Mulai */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="tenant-occupant">
                  <span>Jumlah Penghuni <span className="text-red-500">*</span></span>
                  <span className="text-xs text-muted">+Rp 100.000/orang tambahan</span>
                </label>
                <input
                  id="tenant-occupant"
                  type="number"
                  min="1"
                  max="4"
                  className="form-input"
                  value={occupantCount}
                  onChange={(e) => setOccupantCount(Math.max(1, Number(e.target.value)))}
                />
                {errors.occupantCount && <span className="form-error">{errors.occupantCount}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tenant-lease">
                  <span>Tanggal Mulai Sewa <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="tenant-lease"
                  type="date"
                  className="form-input"
                  value={leaseStart}
                  onChange={(e) => { setLeaseStart(e.target.value); if (errors.leaseStart) setErrors({ ...errors, leaseStart: null }); }}
                />
                {errors.leaseStart && <span className="form-error">{errors.leaseStart}</span>}
              </div>
            </div>

            {/* Estimasi Tagihan */}
            {selectedRoom && selectedType && (
              <div style={{ padding: '0.875rem 1rem', background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
                <span className="text-xs font-bold text-slate-500 uppercase">Estimasi Tagihan Bulanan</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8125rem' }}>
                  <span className="text-slate-600">Sewa {selectedType.name} (1 orang)</span>
                  <span className="font-semibold text-slate-800">Rp {basePrice.toLocaleString('id-ID')}</span>
                </div>
                {additionalFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.8125rem' }}>
                    <span className="text-slate-600">Tambahan {occupantCount - 1} penghuni</span>
                    <span className="font-semibold text-slate-800">Rp {additionalFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--slate-300)', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  <span>Total / bulan</span>
                  <span>Rp {estimatedTotal.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-xs text-muted mt-1">Termasuk listrik, air, dan kamar mandi dalam.</p>
              </div>
            )}

            {/* Catatan */}
            <div className="form-group">
              <label className="form-label" htmlFor="tenant-notes">
                <span>Catatan</span>
              </label>
              <textarea
                id="tenant-notes"
                className="form-textarea"
                rows="2"
                placeholder="Catatan tambahan (opsional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{editingTenant ? 'Simpan Perubahan' : 'Daftarkan Penghuni'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
