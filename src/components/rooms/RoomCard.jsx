import React from 'react';
import { 
  BedDouble, 
  User, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Eye, 
  MoreVertical 
} from 'lucide-react';
import { formatRupiah, getRoomStatusBadge } from '../../utils/formatters';

export default function RoomCard({ 
  room, 
  roomType, 
  tenant, 
  onViewDetail, 
  onEdit, 
  onDelete, 
  onChangeStatus 
}) {
  const statusBadge = getRoomStatusBadge(room.status);
  const typeName = roomType ? roomType.name : "Tipe Tidak Diketahui";
  const price = roomType ? roomType.priceMonthly : 0;
  const image = roomType?.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="room-item-card">
      {/* Media / Photo & Badges */}
      <div className="room-card-media" onClick={() => onViewDetail(room)} style={{ cursor: 'pointer' }}>
        <img 
          src={image} 
          alt={`Kamar ${room.number} Kos Srirahayu`} 
          className="room-card-img"
          loading="lazy"
        />
        
        <div className="room-card-badges">
          <div className="room-number-pill">
            <BedDouble size={14} />
            <span>Kamar {room.number}</span>
          </div>

          <span className={`status-badge ${statusBadge.className}`} style={{ backdropFilter: 'blur(6px)' }}>
            <span className="status-dot" style={{ backgroundColor: statusBadge.dotColor }}></span>
            {statusBadge.label}
          </span>
        </div>

        <div className="room-floor-tag">
          Lantai {room.floor}
        </div>
      </div>

      {/* Body */}
      <div className="room-card-body">
        <div className="room-type-title-row">
          <div>
            <h4 className="room-type-name">{typeName}</h4>
            <span className="text-xs text-muted">Ukuran: {roomType?.size || "3 x 3.5 m"}</span>
          </div>
          <div>
            <div className="room-price-tag">{formatRupiah(price)}</div>
            <div className="room-price-sub">per bulan</div>
          </div>
        </div>

        {/* Tenant status box */}
        <div className="room-tenant-status-box">
          <div className="tenant-box-left">
            <User size={15} className={room.status === 'occupied' ? 'text-primary' : 'text-slate-400'} />
            {room.status === 'occupied' && tenant ? (
              <span>
                Penghuni: <span className="tenant-name-bold">{tenant.name}</span>
              </span>
            ) : room.status === 'maintenance' ? (
              <span className="text-amber-600 font-semibold text-xs">Sedang Perawatan Fisik</span>
            ) : (
              <span className="text-emerald-600 font-semibold text-xs">Kamar Siap Huni</span>
            )}
          </div>

          {/* Quick status change button */}
          <select 
            value={room.status} 
            onChange={(e) => onChangeStatus(room.id, e.target.value)}
            className="text-xs py-1 px-2 border rounded font-semibold bg-white cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            title="Ubah Status Ketersediaan Cepat"
          >
            <option value="available">Tersedia</option>
            <option value="occupied">Terisi</option>
            <option value="maintenance">Perawatan</option>
          </select>
        </div>

        {/* Amenities Pill Tags */}
        <div className="room-amenities-tags">
          {roomType?.facilities?.slice(0, 4).map((f, idx) => (
            <span key={idx} className="amenity-pill">
              {f}
            </span>
          ))}
          {roomType?.facilities?.length > 4 && (
            <span className="amenity-pill font-semibold text-primary">
              +{roomType.facilities.length - 4} lainnya
            </span>
          )}
        </div>

        {room.notes && (
          <p className="text-xs text-slate-500 italic mb-2 line-clamp-1">
            "{room.notes}"
          </p>
        )}

        {/* Action Buttons */}
        <div className="room-card-actions">
          <button 
            type="button" 
            className="card-btn card-btn-primary"
            onClick={() => onViewDetail(room)}
          >
            <Eye size={13} />
            <span>Detail</span>
          </button>
          
          <button 
            type="button" 
            className="card-btn"
            onClick={() => onEdit(room)}
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>

          <button 
            type="button" 
            className="card-btn card-btn-danger"
            onClick={() => onDelete(room)}
            title="Hapus Kamar"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
