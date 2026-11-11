import React from 'react';
import { 
  X, 
  BedDouble, 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Edit3, 
  Trash2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { formatRupiah, formatDateIndo, getRoomStatusBadge } from '../../utils/formatters';

export default function RoomDetailModal({
  isOpen,
  onClose,
  room,
  roomType,
  tenant,
  onEdit,
  onDelete,
  onChangeStatus
}) {
  if (!isOpen || !room) return null;

  const statusBadge = getRoomStatusBadge(room.status);
  const image = roomType?.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <BedDouble size={20} className="text-primary" />
            <span>Spesifikasi & Detail Kamar {room.number}</span>
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

        <div className="modal-body" style={{ maxHeight: '78vh' }}>
          {/* Photo & Primary Specs */}
          <div className="relative rounded-xl overflow-hidden h-52 bg-slate-100 border border-slate-200">
            <img 
              src={image} 
              alt={`Kamar ${room.number}`} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-bold text-sm border border-white/20">
              Kamar {room.number} • Lantai {room.floor}
            </div>
            <div className="absolute top-3 right-3">
              <span className={`status-badge ${statusBadge.className}`} style={{ backdropFilter: 'blur(8px)' }}>
                <span className="status-dot" style={{ backgroundColor: statusBadge.dotColor }}></span>
                {statusBadge.label}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Sewa: </span>
              <span className="font-extrabold text-primary-700">{formatRupiah(roomType?.priceMonthly)}</span>
              <span className="text-xs text-slate-500"> / bulan</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <div className="text-xs text-slate-500 font-medium">Tipe Kamar</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{roomType?.name || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Ukuran Ruangan</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{roomType?.size || '3 x 3.5 m'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Lokasi Lantai</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">Lantai {room.floor}</div>
            </div>
          </div>

          {/* Tenant Information (If Occupied) */}
          {room.status === 'occupied' && tenant ? (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <User size={16} className="text-blue-600" />
                  <span>Data Penghuni Aktif (Sewa Berjalan)</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  Tenant Resmi
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mt-3">
                <div>
                  <span className="text-slate-500 block">Nama Lengkap:</span>
                  <span className="font-bold text-slate-900 text-sm">{tenant.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nomor Kontak / WA:</span>
                  <span className="font-medium text-slate-800">{tenant.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mulai Sewa:</span>
                  <span className="font-medium text-slate-800">{formatDateIndo(tenant.startDate)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Siklus Penagihan:</span>
                  <span className="font-medium text-blue-700">Bulanan (Tanggal 10)</span>
                </div>
              </div>
            </div>
          ) : room.status === 'maintenance' ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Status Perawatan Kamar</span>
                Kamar sedang dalam proses perbaikan fisik atau servis fasilitas. Tidak disarankan untuk dialokasikan ke penyewa baru sebelum selesai.
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-xs text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Kamar Siap Huni</span>
                Kamar bersih, fasilitas lengkap, dan siap ditempati oleh calon penghuni baru.
              </div>
            </div>
          )}

          {/* Fasilitas Kamar */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Fasilitas Kamar Ini ({roomType?.facilities?.length || 0})
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {roomType?.facilities?.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan / Keterangan Khusus */}
          {room.notes && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <FileText size={13} className="text-slate-500" />
                <span>Catatan Pengelola</span>
              </div>
              <p className="text-xs text-slate-600 italic">"{room.notes}"</p>
            </div>
          )}

          {/* Ubah Status Ketersediaan */}
          <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Ubah Status Ketersediaan:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                className={`px-2.5 py-1 text-xs font-semibold rounded border transition-all ${
                  room.status === 'available' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'
                }`}
                onClick={() => onChangeStatus(room.id, 'available')}
              >
                Tersedia
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 text-xs font-semibold rounded border transition-all ${
                  room.status === 'occupied' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
                }`}
                onClick={() => onChangeStatus(room.id, 'occupied')}
              >
                Terisi
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 text-xs font-semibold rounded border transition-all ${
                  room.status === 'maintenance' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-700 border-slate-300'
                }`}
                onClick={() => onChangeStatus(room.id, 'maintenance')}
              >
                Perawatan
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200"
            onClick={() => {
              onClose();
              onDelete(room);
            }}
          >
            <Trash2 size={15} />
            <span>Hapus Kamar</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              onEdit(room);
            }}
          >
            <Edit3 size={15} />
            <span>Edit Kamar</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
