import React, { useState } from 'react';
import { BedDouble, CheckCircle2, Clock, AlertTriangle, User } from 'lucide-react';
import { getRoomStatusBadge, formatRupiah } from '../../utils/formatters';

export default function OccupancyVisualizer({ rooms, roomTypes, tenants, onSelectRoom }) {
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;
  const occupancyPercentage = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

  const filteredRooms = rooms.filter(r => {
    if (selectedFloor === '1') return r.floor === 1;
    if (selectedFloor === '2') return r.floor === 2;
    return true;
  });

  return (
    <div className="card occupancy-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Status Hunian & Peta Kamar</h3>
          <p className="card-subtitle">Pemantauan visual sewa bulanan Kos Srirahayu</p>
        </div>
        {totalRooms > 0 && (
          <div className="floor-filter">
            <button 
              type="button" 
              className={`pill-btn ${selectedFloor === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFloor('all')}
            >
              Semua Lantai
            </button>
            <button 
              type="button" 
              className={`pill-btn ${selectedFloor === '1' ? 'active' : ''}`}
              onClick={() => setSelectedFloor('1')}
            >
              Lantai 1
            </button>
            <button 
              type="button" 
              className={`pill-btn ${selectedFloor === '2' ? 'active' : ''}`}
              onClick={() => setSelectedFloor('2')}
            >
              Lantai 2
            </button>
          </div>
        )}
      </div>

      <div className="card-body">
        {totalRooms === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 my-2">
            <BedDouble size={36} className="mx-auto text-slate-400 mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">Belum Ada Kamar Terdaftar</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Database dimulai dalam keadaan kosong (Zero-Data). Silakan tambahkan tipe kamar dan data kamar asli Kos Srirahayu pada modul <strong>Room Management</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* Occupancy Stats Header */}
            <div className="occupancy-stats-bar">
              <div className="occupancy-rate-box">
                <div className="rate-num">{occupancyPercentage}%</div>
                <div className="rate-label">Tingkat Okupansi ({occupiedCount}/{totalRooms} Kamar)</div>
              </div>

              <div className="occupancy-legend">
                <div className="legend-item">
                  <span className="legend-dot dot-occupied"></span>
                  <span className="legend-text">Terisi: <strong>{occupiedCount}</strong></span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot dot-available"></span>
                  <span className="legend-text">Tersedia: <strong>{availableCount}</strong></span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot dot-maintenance"></span>
                  <span className="legend-text">Perawatan: <strong>{maintenanceCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Room Grid */}
            <div className="room-grid">
          {filteredRooms.map((room) => {
            const type = roomTypes.find(t => t.id === room.typeId);
            const tenant = tenants.find(t => t.id === room.tenantId);
            const statusBadge = getRoomStatusBadge(room.status);

            return (
              <div
                key={room.id}
                className={`room-card status-${room.status}`}
                onMouseEnter={() => setHoveredRoom({ ...room, type, tenant })}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => onSelectRoom && onSelectRoom(room)}
              >
                <div className="room-header">
                  <span className="room-number">Kamar {room.number}</span>
                  <span className="floor-badge">Lt. {room.floor}</span>
                </div>
                
                <div className="room-type-name">{type ? type.name : '-'}</div>

                <div className="room-tenant-row">
                  {room.status === 'occupied' && tenant ? (
                    <div className="tenant-preview">
                      <User size={13} className="text-slate-400" />
                      <span className="tenant-name-truncate">{tenant.name}</span>
                    </div>
                  ) : room.status === 'available' ? (
                    <span className="text-emerald text-xs font-semibold">Siap Disewa</span>
                  ) : (
                    <span className="text-amber text-xs font-semibold">Sedang Perawatan</span>
                  )}
                </div>

                <div className="room-footer">
                  <span className={`badge ${statusBadge.className}`}>
                    <span className="badge-dot"></span>
                    {statusBadge.label}
                  </span>
                  <span className="room-price-tag">
                    {type ? formatRupiah(type.priceMonthly) : ''}<span className="text-muted text-xs">/bln</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

            {/* Hover Detail Preview Bar */}
            {hoveredRoom && (
              <div className="room-hover-info animate-fade-in">
                <div className="info-chip">
                  <span className="text-muted">Kamar Terpilih:</span>
                  <strong>Kamar {hoveredRoom.number} (Lantai {hoveredRoom.floor})</strong>
                </div>
                <div className="info-chip">
                  <span className="text-muted">Tipe:</span>
                  <strong>{hoveredRoom.type?.name} ({formatRupiah(hoveredRoom.type?.priceMonthly)}/bulan)</strong>
                </div>
                {hoveredRoom.tenant && (
                  <div className="info-chip">
                    <span className="text-muted">Penghuni Aktif:</span>
                    <strong>{hoveredRoom.tenant.name} ({hoveredRoom.tenant.phone})</strong>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
