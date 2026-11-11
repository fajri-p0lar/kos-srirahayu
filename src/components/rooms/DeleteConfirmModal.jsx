import React from 'react';
import { AlertTriangle, ShieldAlert, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  room,
  tenant
}) {
  if (!isOpen || !room) return null;

  const isOccupied = room.status === 'occupied' || !!tenant;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div className="modal-title text-red-600">
            <AlertTriangle size={20} />
            <span>Konfirmasi Penghapusan Kamar</span>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} title="Tutup">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {isOccupied ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <ShieldAlert size={18} />
                <span>Kamar Sedang Dihuni (Terproteksi SOT)</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed">
                Kamar <strong>{room.number}</strong> saat ini masih terhubung dengan penghuni aktif 
                {tenant ? <strong> ({tenant.name})</strong> : ''}.
              </p>
              <p className="text-xs text-red-600 mt-2">
                Sesuai aturan integritas data sewa bulanan Kos Srirahayu, Anda tidak dapat menghapus kamar yang sedang berpenghuni aktif. Silakan selesaikan masa sewa atau pindahkan penghuni pada Modul 3 terlebih dahulu.
              </p>
            </div>
          ) : (
            <div className="text-sm text-slate-700">
              <p>
                Apakah Anda yakin ingin menghapus data <strong>Kamar {room.number} (Lantai {room.floor})</strong>?
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Tindakan ini akan menghapus kamar dari daftar inventaris dan denah visual kamar Kos Srirahayu.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            {isOccupied ? 'Tutup' : 'Batal'}
          </button>
          
          {!isOccupied && (
            <button
              type="button"
              className="btn bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={() => {
                onConfirm(room.id);
                onClose();
              }}
            >
              <Trash2 size={16} />
              <span>Ya, Hapus Kamar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
