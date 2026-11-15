import React, { useState, useMemo } from 'react';
import { 
  BedDouble, 
  Layers, 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Edit3, 
  Trash2, 
  Eye, 
  ShieldCheck,
  DoorOpen,
  X
} from 'lucide-react';
import RoomCard from './RoomCard';
import RoomFormModal from './RoomFormModal';
import RoomTypeModal from './RoomTypeModal';
import RoomDetailModal from './RoomDetailModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import RoomGalleryModal from './RoomGalleryModal';
import { formatRupiah, getRoomStatusBadge } from '../../utils/formatters';
import './RoomManagement.css';

export default function RoomManagementPage({
  rooms = [],
  roomTypes = [],
  tenants = [],
  onUpdateRooms,
  onUpdateRoomTypes
}) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'types' | 'gallery'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Modal states
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailRoom, setSelectedDetailRoom] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations
  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;
  const totalTypes = roomTypes.length;

  // Filtered rooms logic
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const type = roomTypes.find(t => t.id === r.typeId);
      const tenant = tenants.find(t => t.id === r.tenantId);

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchNumber = r.number.toLowerCase().includes(query);
      const matchType = type ? type.name.toLowerCase().includes(query) : false;
      const matchTenant = tenant ? tenant.name.toLowerCase().includes(query) : false;
      const matchSearch = !query || matchNumber || matchType || matchTenant;

      // Floor match
      const matchFloor = filterFloor === 'all' || String(r.floor) === String(filterFloor);

      // Status match
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;

      // Type match
      const matchTypeValue = filterType === 'all' || r.typeId === filterType;

      return matchSearch && matchFloor && matchStatus && matchTypeValue;
    });
  }, [rooms, roomTypes, tenants, searchQuery, filterFloor, filterStatus, filterType]);

  // Gallery items builder
  const galleryItems = useMemo(() => {
    const items = [];
    roomTypes.forEach((t) => {
      items.push({
        title: `Tipe ${t.name}`,
        subtitle: `${t.size} • ${t.facilities?.slice(0, 3).join(', ')}`,
        price: t.priceMonthly,
        src: t.image || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
      });
    });
    rooms.forEach((r) => {
      const type = roomTypes.find(t => t.id === r.typeId);
      items.push({
        title: `Kamar ${r.number} (Lantai ${r.floor})`,
        subtitle: `Tipe ${type?.name || 'Kamar'} • Status: ${r.status === 'occupied' ? 'Terisi' : 'Tersedia'}`,
        price: type?.priceMonthly,
        src: type?.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
      });
    });
    return items;
  }, [rooms, roomTypes]);

  // Room CRUD Handlers
  const handleSaveRoom = (roomData) => {
    let updated;
    if (editingRoom) {
      updated = rooms.map(r => r.id === roomData.id ? { ...r, ...roomData } : r);
      showToast(`Kamar ${roomData.number} berhasil diperbarui.`);
    } else {
      updated = [...rooms, roomData];
      showToast(`Kamar ${roomData.number} baru berhasil ditambahkan.`);
    }
    onUpdateRooms(updated);
  };

  const handleChangeRoomStatus = (roomId, newStatus) => {
    const updated = rooms.map(r => {
      if (r.id === roomId) {
        return { ...r, status: newStatus };
      }
      return r;
    });
    const targetRoom = rooms.find(r => r.id === roomId);
    onUpdateRooms(updated);
    showToast(`Status Kamar ${targetRoom?.number || roomId} diubah ke '${newStatus === 'available' ? 'Tersedia' : newStatus === 'occupied' ? 'Terisi' : 'Perawatan'}'.`);
  };

  const handleConfirmDeleteRoom = (roomId) => {
    const target = rooms.find(r => r.id === roomId);
    const updated = rooms.filter(r => r.id !== roomId);
    onUpdateRooms(updated);
    showToast(`Kamar ${target?.number || roomId} berhasil dihapus.`);
  };

  // Room Type CRUD Handlers
  const handleSaveRoomType = (typeData) => {
    let updated;
    if (editingType) {
      updated = roomTypes.map(t => t.id === typeData.id ? { ...t, ...typeData } : t);
      showToast(`Tipe kamar '${typeData.name}' berhasil diperbarui.`);
    } else {
      updated = [...roomTypes, typeData];
      showToast(`Tipe kamar baru '${typeData.name}' berhasil ditambahkan.`);
    }
    onUpdateRoomTypes(updated);
  };

  return (
    <div className="page-wrapper animate-fade-in">
    <div className="room-module-container">
      {/* Module Header */}
      <div className="module-header-banner">
        <div className="module-header-info">
          <div className="module-header-icon">
            <BedDouble size={28} />
          </div>
          <div>
            <h1 className="module-header-title">Manajemen Kamar</h1>
            <p className="module-header-desc">
              Kelola inventaris kamar, tipe kamar, fasilitas, dan status ketersediaan.
            </p>
          </div>
        </div>

        <div className="module-header-actions">
          <button
            type="button"
            className="btn btn-secondary text-slate-900 bg-white hover:bg-slate-100 font-semibold"
            onClick={() => {
              setEditingType(null);
              setIsTypeModalOpen(true);
            }}
          >
            <Layers size={16} className="text-primary" />
            <span>+ Tambah Tipe Kamar</span>
          </button>

          <button
            type="button"
            className="btn btn-primary bg-blue-600 hover:bg-blue-500 font-semibold"
            onClick={() => {
              setEditingRoom(null);
              setIsRoomModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>+ Tambah Kamar Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="room-stats-grid">
        <div className="room-stat-card">
          <div className="room-stat-icon stat-icon-total">
            <DoorOpen size={22} />
          </div>
          <div className="room-stat-details">
            <span className="room-stat-val">{totalRooms}</span>
            <span className="room-stat-lbl">Total Inventaris Kamar</span>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon stat-icon-occupied">
            <Users size={22} />
          </div>
          <div className="room-stat-details">
            <span className="room-stat-val">{occupiedCount}</span>
            <span className="room-stat-lbl">Kamar Terisi ({Math.round((occupiedCount / (totalRooms || 1)) * 100)}%)</span>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon stat-icon-available">
            <CheckCircle2 size={22} />
          </div>
          <div className="room-stat-details">
            <span className="room-stat-val">{availableCount}</span>
            <span className="room-stat-lbl">Kamar Tersedia</span>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon stat-icon-maintenance">
            <AlertTriangle size={22} />
          </div>
          <div className="room-stat-details">
            <span className="room-stat-val">{maintenanceCount}</span>
            <span className="room-stat-lbl">Dalam Perawatan</span>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon stat-icon-types">
            <Layers size={22} />
          </div>
          <div className="room-stat-details">
            <span className="room-stat-val">{totalTypes}</span>
            <span className="room-stat-lbl">Tipe Kamar</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & View Controls */}
      <div className="room-tabs-bar">
        <div className="room-tabs-group">
          <button
            type="button"
            className={`room-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <BedDouble size={16} />
            <span>Daftar Kamar ({rooms.length})</span>
          </button>

          <button
            type="button"
            className={`room-tab-btn ${activeTab === 'types' ? 'active' : ''}`}
            onClick={() => setActiveTab('types')}
          >
            <Layers size={16} />
            <span>Tipe Kamar & Tarif ({roomTypes.length})</span>
          </button>

          <button
            type="button"
            className={`room-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <ImageIcon size={16} />
            <span>Galeri Foto Kamar</span>
          </button>
        </div>

        {activeTab === 'rooms' && (
          <div className="room-view-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Tampilan Kartu Grid"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Tampilan Tabel Data"
            >
              <TableIcon size={16} />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: DAFTAR KAMAR */}
      {activeTab === 'rooms' && (
        <div className="flex flex-col gap-4">
          {/* Filter Toolbar */}
          <div className="room-filter-toolbar">
            <div className="filter-left-controls">
              {/* Search Bar */}
              <div className="search-input-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari nomor kamar, tipe, atau penghuni..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter Lantai */}
              <select
                className="filter-select"
                value={filterFloor}
                onChange={(e) => setFilterFloor(e.target.value)}
              >
                <option value="all">Semua Lantai</option>
                <option value="1">Lantai 1</option>
                <option value="2">Lantai 2</option>
              </select>

              {/* Filter Status */}
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="occupied">Terisi</option>
                <option value="maintenance">Perawatan</option>
              </select>

              {/* Filter Tipe Kamar */}
              <select
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Semua Tipe Kamar</option>
                {roomTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Menampilkan {filteredRooms.length} dari {rooms.length} kamar
            </div>
          </div>

          {/* Empty State */}
          {filteredRooms.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <BedDouble size={48} className="mx-auto text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">Tidak Ada Kamar yang Sesuai</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Silakan sesuaikan kata kunci pencarian atau ubah filter status/lantai untuk melihat kamar lainnya.
              </p>
              <button
                type="button"
                className="btn btn-secondary text-xs mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setFilterFloor('all');
                  setFilterStatus('all');
                  setFilterType('all');
                }}
              >
                Reset Semua Filter
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="room-grid">
              {filteredRooms.map((room) => {
                const roomType = roomTypes.find(t => t.id === room.typeId);
                const tenant = tenants.find(t => t.id === room.tenantId);

                return (
                  <RoomCard
                    key={room.id}
                    room={room}
                    roomType={roomType}
                    tenant={tenant}
                    onViewDetail={(r) => {
                      setSelectedDetailRoom(r);
                      setIsDetailModalOpen(true);
                    }}
                    onEdit={(r) => {
                      setEditingRoom(r);
                      setIsRoomModalOpen(true);
                    }}
                    onDelete={(r) => {
                      setRoomToDelete(r);
                      setIsDeleteModalOpen(true);
                    }}
                    onChangeStatus={handleChangeRoomStatus}
                  />
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="room-table-container">
              <div className="overflow-x-auto">
                <table className="room-table">
                  <thead>
                    <tr>
                      <th>Nomor Kamar</th>
                      <th>Lokasi Lantai</th>
                      <th>Tipe & Ukuran</th>
                      <th>Tarif Bulanan</th>
                      <th>Status Ketersediaan</th>
                      <th>Penghuni Aktif</th>
                      <th>Catatan</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map((room) => {
                      const roomType = roomTypes.find(t => t.id === room.typeId);
                      const tenant = tenants.find(t => t.id === room.tenantId);
                      const statusBadge = getRoomStatusBadge(room.status);

                      return (
                        <tr key={room.id}>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                                {room.number}
                              </div>
                              <span className="font-bold text-slate-900">Kamar {room.number}</span>
                            </div>
                          </td>
                          <td>
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-700">
                              Lantai {room.floor}
                            </span>
                          </td>
                          <td>
                            <div className="font-semibold text-slate-800">{roomType?.name || '-'}</div>
                            <div className="text-xs text-slate-500">{roomType?.size || '3 x 3.5 m'}</div>
                          </td>
                          <td>
                            <div className="font-extrabold text-primary-700">
                              {formatRupiah(roomType?.priceMonthly)}
                            </div>
                            <div className="text-xs text-slate-400">per bulan</div>
                          </td>
                          <td>
                            <span className={`status-badge ${statusBadge.className}`}>
                              <span className="status-dot" style={{ backgroundColor: statusBadge.dotColor }}></span>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td>
                            {room.status === 'occupied' && tenant ? (
                              <div>
                                <span className="font-bold text-slate-900 block">{tenant.name}</span>
                                <span className="text-xs text-slate-500">{tenant.phone}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">- Kosong -</span>
                            )}
                          </td>
                          <td style={{ maxWidth: '180px' }}>
                            <span className="text-xs text-slate-500 line-clamp-1">
                              {room.notes || '-'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="room-table-actions justify-end">
                              <button
                                type="button"
                                className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                                onClick={() => {
                                  setSelectedDetailRoom(room);
                                  setIsDetailModalOpen(true);
                                }}
                                title="Lihat Detail"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                type="button"
                                className="p-1.5 rounded hover:bg-slate-100 text-blue-600"
                                onClick={() => {
                                  setEditingRoom(room);
                                  setIsRoomModalOpen(true);
                                }}
                                title="Edit Kamar"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                className="p-1.5 rounded hover:bg-red-50 text-red-600"
                                onClick={() => {
                                  setRoomToDelete(room);
                                  setIsDeleteModalOpen(true);
                                }}
                                title="Hapus Kamar"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TIPE KAMAR & TARIF */}
      {activeTab === 'types' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Katalog Tipe Kamar & Fasilitas Standar</h3>
              <p className="text-xs text-slate-500">
                Setiap tipe kamar memiliki penetapan harga sewa bulanan dan paket fasilitas resmi Kos Srirahayu.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary text-xs"
              onClick={() => {
                setEditingType(null);
                setIsTypeModalOpen(true);
              }}
            >
              <Plus size={14} />
              <span>Tambah Tipe Baru</span>
            </button>
          </div>

          <div className="room-types-grid">
            {roomTypes.map((type) => {
              const roomsOfType = rooms.filter(r => r.typeId === type.id);
              const occCount = roomsOfType.filter(r => r.status === 'occupied').length;
              const availCount = roomsOfType.filter(r => r.status === 'available').length;

              return (
                <div key={type.id} className="room-type-card">
                  <div className="type-card-media">
                    <img
                      src={type.image || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"}
                      alt={type.name}
                      className="type-card-img"
                    />
                    <div className="type-badge-pill">
                      {type.badge || "Standar Srirahayu"}
                    </div>
                  </div>

                  <div className="type-card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{type.name}</h4>
                        <span className="text-xs text-slate-500 font-medium">Dimensi Ruangan: {type.size}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-icon text-slate-500 hover:text-blue-600"
                        onClick={() => {
                          setEditingType(type);
                          setIsTypeModalOpen(true);
                        }}
                        title="Edit Tipe Kamar"
                      >
                        <Edit3 size={15} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {type.description || "Kamar berkualitas dengan kelengkapan fasilitas standar Kos Srirahayu."}
                    </p>

                    {/* Price Banner */}
                    <div className="type-price-banner">
                      <div>
                        <div className="text-xs text-blue-700 font-semibold uppercase">Tarif Sewa Bulanan</div>
                        <div className="price-num">{formatRupiah(type.priceMonthly)}</div>
                      </div>
                      <span className="text-xs text-slate-500">per bulan</span>
                    </div>

                    {/* Occupancy Summary */}
                    <div className="type-occupancy-summary">
                      <div>
                        Total: <strong>{roomsOfType.length} kamar</strong>
                      </div>
                      <div>
                        Terisi: <strong className="text-blue-600">{occCount}</strong>
                      </div>
                      <div>
                        Tersedia: <strong className="text-emerald-600">{availCount}</strong>
                      </div>
                    </div>

                    {/* Amenities Checklist */}
                    <div className="mt-1 mb-2">
                      <div className="text-xs font-bold text-slate-700 mb-2">Fasilitas Termasuk:</div>
                      <div className="type-amenities-list">
                        {type.facilities?.map((f, i) => (
                          <div key={i} className="type-amenity-item">
                            <Check size={13} className="text-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      type="button"
                      className="btn btn-secondary w-full text-xs font-semibold mt-auto"
                      onClick={() => {
                        setEditingType(type);
                        setIsTypeModalOpen(true);
                      }}
                    >
                      <Edit3 size={13} />
                      <span>Ubah Spesifikasi & Fasilitas</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GALERI FOTO KAMAR */}
      {activeTab === 'gallery' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Galeri Dokumentasi Kamar Kos Srirahayu</h3>
                <p className="text-xs text-slate-500">
                  Dokumentasi visual foto kamar tidur, fasilitas kamar mandi, dan sudut hunian untuk transparansi calon penghuni.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer h-64"
                onClick={() => {
                  setGalleryInitialIndex(index);
                  setIsGalleryModalOpen(true);
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-extrabold text-base text-white group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                    {item.price && (
                      <span className="font-extrabold text-xs bg-blue-600 px-2.5 py-1 rounded-lg text-white shrink-0">
                        {formatRupiah(item.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-slate-950/60 backdrop-blur-md p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Form Tambah / Edit Kamar */}
      <RoomFormModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSave={handleSaveRoom}
        editingRoom={editingRoom}
        roomTypes={roomTypes}
        existingRooms={rooms}
      />

      {/* MODAL 2: Form Tambah / Edit Tipe Kamar */}
      <RoomTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSave={handleSaveRoomType}
        editingType={editingType}
      />

      {/* MODAL 3: Detail Kamar Deep Dive */}
      <RoomDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        room={selectedDetailRoom}
        roomType={roomTypes.find(t => t.id === selectedDetailRoom?.typeId)}
        tenant={tenants.find(t => t.id === selectedDetailRoom?.tenantId)}
        onEdit={(r) => {
          setIsDetailModalOpen(false);
          setEditingRoom(r);
          setIsRoomModalOpen(true);
        }}
        onDelete={(r) => {
          setIsDetailModalOpen(false);
          setRoomToDelete(r);
          setIsDeleteModalOpen(true);
        }}
        onChangeStatus={(id, status) => {
          handleChangeRoomStatus(id, status);
          if (selectedDetailRoom) {
            setSelectedDetailRoom({ ...selectedDetailRoom, status });
          }
        }}
      />

      {/* MODAL 4: Konfirmasi Hapus Kamar */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteRoom}
        room={roomToDelete}
        tenant={tenants.find(t => t.id === roomToDelete?.tenantId)}
      />

      {/* MODAL 5: Lightbox Galeri */}
      <RoomGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        initialIndex={galleryInitialIndex}
        galleryItems={galleryItems}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
    </div>
  );
}
