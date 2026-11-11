import React, { useState, useEffect } from 'react';
import { X, BedDouble, AlertCircle, Check } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export default function RoomFormModal({
  isOpen,
  onClose,
  onSave,
  editingRoom,
  roomTypes,
  existingRooms
}) {
  const [formData, setFormData] = useState({
    number: '',
    floor: 1,
    typeId: roomTypes[0]?.id || '',
    status: 'available',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingRoom) {
      setFormData({
        number: editingRoom.number || '',
        floor: editingRoom.floor || 1,
        typeId: editingRoom.typeId || (roomTypes[0]?.id || ''),
        status: editingRoom.status || 'available',
        notes: editingRoom.notes || ''
      });
    } else {
      // Propose next room number
      const nextNum = existingRooms.length > 0 
        ? String(Math.max(...existingRooms.map(r => parseInt(r.number, 10) || 100)) + 1)
        : '107';
      setFormData({
        number: nextNum,
        floor: nextNum.startsWith('2') ? 2 : 1,
        typeId: roomTypes[0]?.id || '',
        status: 'available',
        notes: ''
      });
    }
    setErrors({});
  }, [editingRoom, isOpen, roomTypes, existingRooms]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.number.trim()) {
      errs.number = 'Nomor kamar wajib diisi';
    } else {
      // Check duplicate number
      const isDuplicate = existingRooms.some(
        r => r.number.trim().toLowerCase() === formData.number.trim().toLowerCase() && 
             (!editingRoom || r.id !== editingRoom.id)
      );
      if (isDuplicate) {
        errs.number = `Nomor kamar ${formData.number} sudah digunakan!`;
      }
    }

    if (!formData.typeId) {
      errs.typeId = 'Pilih tipe kamar yang valid';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: editingRoom ? editingRoom.id : `R${formData.number}`,
      number: formData.number.trim(),
      floor: Number(formData.floor),
      typeId: formData.typeId,
      status: formData.status,
      tenantId: editingRoom ? editingRoom.tenantId : null,
      notes: formData.notes.trim()
    });
    onClose();
  };

  const selectedType = roomTypes.find(t => t.id === formData.typeId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <BedDouble size={20} className="text-primary" />
            <span>{editingRoom ? `Edit Data Kamar ${editingRoom.number}` : 'Tambah Kamar Baru Kos Srirahayu'}</span>
          </div>
          <button 
            type="button" 
            className="btn-icon" 
            onClick={onClose} 
            title="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Nomor Kamar & Lantai */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="room-number-input">
                  <span>Nomor Kamar <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="room-number-input"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: 107 atau 207"
                  value={formData.number}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoFloor = val.startsWith('2') ? 2 : (val.startsWith('1') ? 1 : formData.floor);
                    setFormData({ ...formData, number: val, floor: autoFloor });
                    if (errors.number) setErrors({ ...errors, number: null });
                  }}
                  autoFocus
                />
                {errors.number ? (
                  <span className="form-error">{errors.number}</span>
                ) : (
                  <span className="form-hint">Format 3 digit (1xx = Lantai 1, 2xx = Lantai 2)</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="room-floor-select">
                  <span>Lantai Gedung <span className="text-red-500">*</span></span>
                </label>
                <select
                  id="room-floor-select"
                  className="form-select"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                >
                  <option value={1}>Lantai 1 (Dasar)</option>
                  <option value={2}>Lantai 2 (Atas / Balkon)</option>
                </select>
              </div>
            </div>

            {/* Tipe Kamar */}
            <div className="form-group">
              <label className="form-label" htmlFor="room-type-select">
                <span>Tipe Kamar <span className="text-red-500">*</span></span>
              </label>
              <select
                id="room-type-select"
                className="form-select"
                value={formData.typeId}
                onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
              >
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {formatRupiah(t.priceMonthly)} / bulan ({t.size})
                  </option>
                ))}
              </select>
              {selectedType && (
                <div className="mt-2 p-2.5 bg-slate-50 border rounded text-xs text-slate-600">
                  <div className="font-semibold text-slate-800 mb-1">Fasilitas Standar Tipe Ini:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedType.facilities?.map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-white border rounded text-slate-700">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Ketersediaan */}
            <div className="form-group">
              <label className="form-label" htmlFor="room-status-select">
                <span>Status Ketersediaan <span className="text-red-500">*</span></span>
              </label>
              <select
                id="room-status-select"
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="available">Tersedia (Siap Huni)</option>
                <option value="occupied">Terisi (Sedang Disewa)</option>
                <option value="maintenance">Perawatan (Perbaikan / Servis)</option>
              </select>
              {formData.status === 'occupied' && !editingRoom?.tenantId && (
                <span className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={13} />
                  Kamar berstatus Terisi akan siap dihubungkan dengan data tenant pada Modul 3.
                </span>
              )}
            </div>

            {/* Catatan Posisi / Keistimewaan */}
            <div className="form-group">
              <label className="form-label" htmlFor="room-notes-input">
                <span>Catatan Posisi / Keistimewaan (Opsional)</span>
              </label>
              <textarea
                id="room-notes-input"
                className="form-textarea"
                rows="2"
                placeholder="Contoh: Menghadap taman samping, sirkulasi udara sangat segar..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Check size={16} />
              <span>{editingRoom ? 'Simpan Perubahan' : 'Tambah Kamar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
