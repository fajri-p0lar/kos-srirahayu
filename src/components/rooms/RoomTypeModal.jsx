import React, { useState, useEffect } from 'react';
import { X, Layers, Plus, Check, Trash2 } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

const DEFAULT_FACILITY_OPTIONS = [
  "Air Conditioner (AC)",
  "Kamar Mandi Dalam",
  "Kamar Mandi Luar",
  "Water Heater",
  "Balkon Pribadi",
  "Kasur Springbed",
  "Kasur Ukuran Queen",
  "Lemari Pakaian",
  "Meja & Kursi Belajar",
  "WiFi 50 Mbps",
  "Smart TV",
  "Shower",
  "Exhaust Fan",
  "Dapur Mini"
];

export default function RoomTypeModal({
  isOpen,
  onClose,
  onSave,
  editingType
}) {
  const [name, setName] = useState('');
  const [priceMonthly, setPriceMonthly] = useState(1000000);
  const [size, setSize] = useState('3.5 x 4 m');
  const [facilities, setFacilities] = useState([]);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('');
  const [customFacility, setCustomFacility] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingType) {
      setName(editingType.name || '');
      setPriceMonthly(editingType.priceMonthly || 1000000);
      setSize(editingType.size || '3.5 x 4 m');
      setFacilities(editingType.facilities || []);
      setDescription(editingType.description || '');
      setBadge(editingType.badge || '');
      setImage(editingType.image || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80');
    } else {
      setName('');
      setPriceMonthly(1200000);
      setSize('3.5 x 4 m');
      setFacilities(["Kasur Springbed", "Lemari Pakaian", "Meja & Kursi Belajar", "WiFi 50 Mbps"]);
      setDescription('');
      setBadge('Tipe Baru');
      setImage('https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80');
    }
    setErrors({});
  }, [editingType, isOpen]);

  if (!isOpen) return null;

  const toggleFacility = (fac) => {
    if (facilities.includes(fac)) {
      setFacilities(facilities.filter(f => f !== fac));
    } else {
      setFacilities([...facilities, fac]);
    }
  };

  const handleAddCustomFacility = (e) => {
    e.preventDefault();
    if (customFacility.trim() && !facilities.includes(customFacility.trim())) {
      setFacilities([...facilities, customFacility.trim()]);
      setCustomFacility('');
    }
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Nama tipe kamar wajib diisi';
    if (!priceMonthly || priceMonthly <= 0) errs.priceMonthly = 'Tarif bulanan harus lebih dari 0';
    if (facilities.length === 0) errs.facilities = 'Pilih minimal satu fasilitas kamar';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: editingType ? editingType.id : `type-${Date.now()}`,
      name: name.trim(),
      priceMonthly: Number(priceMonthly),
      size: size.trim() || '3.5 x 4 m',
      facilities,
      description: description.trim(),
      badge: badge.trim() || 'Pilihan',
      image: image || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Layers size={20} className="text-primary" />
            <span>{editingType ? `Edit Tipe Kamar: ${editingType.name}` : 'Tambah Tipe Kamar Baru'}</span>
          </div>
          <button 
            type="button" 
            className="btn-icon" 
            onClick={onClose}
            title="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Nama Tipe & Ukuran */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="type-name-input">
                  <span>Nama Tipe Kamar <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="type-name-input"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Standar AC Plus"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  autoFocus
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="type-size-input">
                  <span>Ukuran Dimensi Kamar</span>
                </label>
                <input
                  id="type-size-input"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: 3.5 x 4 m"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
            </div>

            {/* Tarif Bulanan */}
            <div className="form-group">
              <label className="form-label" htmlFor="type-price-input">
                <span>Tarif Sewa Bulanan (Rp) <span className="text-red-500">*</span></span>
                <span className="text-primary font-bold">{formatRupiah(priceMonthly)} / bulan</span>
              </label>
              <input
                id="type-price-input"
                type="number"
                step="50000"
                min="100000"
                className="form-input font-semibold text-lg text-primary"
                value={priceMonthly}
                onChange={(e) => {
                  setPriceMonthly(e.target.value);
                  if (errors.priceMonthly) setErrors({ ...errors, priceMonthly: null });
                }}
              />
              {errors.priceMonthly ? (
                <span className="form-error">{errors.priceMonthly}</span>
              ) : (
                <span className="form-hint">Sesuai SOT: Sistem berbasis sewa bulanan (non-harian)</span>
              )}
            </div>

            {/* Fasilitas Checklist */}
            <div className="form-group">
              <label className="form-label">
                <span>Daftar Fasilitas Utama <span className="text-red-500">*</span></span>
                <span className="text-xs text-muted">({facilities.length} dipilih)</span>
              </label>

              <div className="facility-checklist">
                {DEFAULT_FACILITY_OPTIONS.map((fac) => (
                  <label key={fac} className="facility-check-item">
                    <input
                      type="checkbox"
                      checked={facilities.includes(fac)}
                      onChange={() => toggleFacility(fac)}
                    />
                    <span>{fac}</span>
                  </label>
                ))}

                {/* Fasilitas kustom yang ditambahkan */}
                {facilities
                  .filter(f => !DEFAULT_FACILITY_OPTIONS.includes(f))
                  .map(customF => (
                    <label key={customF} className="facility-check-item font-semibold text-primary">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => toggleFacility(customF)}
                      />
                      <span>{customF} (Kustom)</span>
                    </label>
                  ))
                }
              </div>
              {errors.facilities && <span className="form-error">{errors.facilities}</span>}

              {/* Tambah fasilitas kustom */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="+ Tambah fasilitas lainnya (contoh: Kulkas Mini)"
                  value={customFacility}
                  onChange={(e) => setCustomFacility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomFacility(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary text-xs"
                  onClick={handleAddCustomFacility}
                >
                  <Plus size={14} />
                  <span>Tambah</span>
                </button>
              </div>
            </div>

            {/* Deskripsi & Label Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="type-badge-input">
                  <span>Label Badge Promo/Status</span>
                </label>
                <input
                  id="type-badge-input"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Paling Favorit, Eksklusif"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="type-image-input">
                  <span>Foto Ilustrasi URL</span>
                </label>
                <input
                  id="type-image-input"
                  type="url"
                  className="form-input text-xs"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="type-desc-input">
                <span>Deskripsi Tipe Kamar</span>
              </label>
              <textarea
                id="type-desc-input"
                className="form-textarea"
                rows="2"
                placeholder="Deskripsi keunggulan tipe kamar ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <span>{editingType ? 'Simpan Tipe Kamar' : 'Buat Tipe Kamar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
