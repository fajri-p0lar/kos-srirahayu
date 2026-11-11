import React, { useState, useMemo, useRef } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Wifi,
  ShieldCheck,
  Sparkles,
  BedDouble,
  CheckCircle2,
  MessageCircle,
  ChevronRight,
  X,
  Bath,
  Wind,
  Zap,
  Droplets,
  Car,
  Camera,
  Eye,
  Search,
  Filter,
  Home,
  ShieldAlert,
  ArrowRight,
  Navigation,
} from 'lucide-react';
import { PROPERTY_INFO } from '../../data/mockData';
import { formatRupiah, getRoomStatusBadge } from '../../utils/formatters';

/* -------------------------------------------------------------------------- */
/*  Ikon fasilitas helper                                                     */
/* -------------------------------------------------------------------------- */
const FACILITY_ICON_MAP = {
  'Air Conditioner (AC)': Wind,
  'Kamar Mandi Dalam': Bath,
  'Kamar Mandi Luar': Bath,
  'Water Heater': Droplets,
  'Balkon Pribadi': Camera,
  'Kasur Springbed': BedDouble,
  'Kasur Ukuran Queen': BedDouble,
  'Lemari Pakaian': Building2,
  'Meja & Kursi Belajar': Building2,
  'WiFi 50 Mbps': Wifi,
  'Smart TV': Zap,
  'Shower': Droplets,
  'Exhaust Fan': Wind,
  'Dapur Mini': Building2,
};

function getFacilityIcon(facility) {
  return FACILITY_ICON_MAP[facility] || CheckCircle2;
}

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80';

/* -------------------------------------------------------------------------- */
/*  Modal Detail Kamar (Public / Pelanggan)                                    */
/* -------------------------------------------------------------------------- */
function PublicRoomDetailModal({ roomType, rooms, onClose, onContact }) {
  if (!roomType) return null;

  const roomsOfType = rooms.filter((r) => r.typeId === roomType.id);
  const availableCount = roomsOfType.filter((r) => r.status === 'available').length;
  const totalOfType = roomsOfType.length;

  return (
    <div className="pub-modal-overlay" onClick={onClose}>
      <div className="pub-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header dengan foto */}
        <div className="pub-modal-hero">
          <img
            src={roomType.image || FALLBACK_IMG}
            alt={roomType.name}
            className="pub-modal-hero-img"
          />
          <div className="pub-modal-hero-overlay" />
          <button type="button" className="pub-modal-close" onClick={onClose}>
            <X size={22} />
          </button>
          {roomType.badge && (
            <span className="pub-modal-badge">{roomType.badge}</span>
          )}
          <div className="pub-modal-hero-text">
            <h2 className="pub-modal-title">{roomType.name}</h2>
            <p className="pub-modal-size">{roomType.size}</p>
          </div>
        </div>

        {/* Body */}
        <div className="pub-modal-body">
          {/* Harga & Ketersediaan */}
          <div className="pub-modal-price-row">
            <div>
              <span className="pub-modal-price">
                {formatRupiah(roomType.priceMonthly)}
              </span>
              <span className="pub-modal-price-unit">/ bulan</span>
            </div>
            <div className="pub-modal-availability">
              {totalOfType > 0 ? (
                availableCount > 0 ? (
                  <span className="badge badge-success">
                    <span className="badge-dot" />
                    {availableCount} Kamar Tersedia
                  </span>
                ) : (
                  <span className="badge badge-neutral">
                    <span className="badge-dot" />
                    Penuh
                  </span>
                )
              ) : (
                <span className="badge badge-neutral">
                  <span className="badge-dot" />
                  Belum ada kamar
                </span>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          {roomType.description && (
            <p className="pub-modal-desc">{roomType.description}</p>
          )}

          {/* Fasilitas */}
          <div className="pub-modal-section">
            <h3 className="pub-modal-section-title">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Fasilitas Kamar
            </h3>
            <div className="pub-modal-fac-grid">
              {roomType.facilities?.map((fac, i) => {
                const Icon = getFacilityIcon(fac);
                return (
                  <div key={i} className="pub-modal-fac-item">
                    <Icon size={18} className="text-emerald-600" />
                    <span>{fac}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daftar Kamar Tersedia */}
          {totalOfType > 0 && (
            <div className="pub-modal-section">
              <h3 className="pub-modal-section-title">
                <BedDouble size={16} className="text-emerald-600" />
                Daftar Kamar ({totalOfType})
              </h3>
              <div className="pub-modal-room-list">
                {roomsOfType.map((room) => {
                  const sb = getRoomStatusBadge(room.status);
                  return (
                    <div key={room.id} className="pub-modal-room-row">
                      <div className="pub-modal-room-info">
                        <span className="pub-modal-room-num">Kamar {room.number}</span>
                        <span className="pub-modal-room-floor">Lantai {room.floor}</span>
                      </div>
                      <span className={`badge ${sb.className}`}>
                        <span className="badge-dot" style={{ backgroundColor: sb.dotColor }} />
                        {sb.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info penting SOT */}
          <div className="pub-modal-note">
            <ShieldAlert size={15} className="text-amber-500 shrink-0" />
            <span>
              Pendaftaran sewa dilakukan langsung melalui pengelola. Sistem ini
              bukan layanan pemesanan online harian.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pub-modal-footer">
          <button
            type="button"
            className="btn btn-secondary pub-modal-btn"
            onClick={onClose}
          >
            Tutup
          </button>
          <button
            type="button"
            className="btn btn-emerald pub-modal-btn"
            onClick={() => onContact(roomType)}
          >
            <MessageCircle size={18} />
            Hubungi via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Komponen Utama LandingPage (Gaya Mamikos)                                  */
/* -------------------------------------------------------------------------- */
export default function LandingPage({ rooms = [], roomTypes = [], onGoToDashboard }) {
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | available
  const [filterType, setFilterType] = useState('all');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const roomsRef = useRef(null);
  const facilitiesRef = useRef(null);
  const locationRef = useRef(null);

  // Statistik ringkas
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const minPrice =
    roomTypes.length > 0
      ? Math.min(...roomTypes.map((t) => t.priceMonthly || 0))
      : 0;

  // Daftar tipe yang ter-filter
  const filteredTypes = useMemo(() => {
    let result = [...roomTypes];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.facilities?.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((t) => t.id === filterType);
    }

    // Filter by availability
    if (filterStatus === 'available') {
      result = result.filter((t) => {
        const roomsOfT = rooms.filter((r) => r.typeId === t.id);
        return roomsOfT.some((r) => r.status === 'available');
      });
    }

    return result;
  }, [roomTypes, rooms, searchQuery, filterType, filterStatus]);

  // Scroll helper
  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileNavOpen(false);
  };

  // WhatsApp contact
  const buildWaUrl = (roomType) => {
    const msg = roomType
      ? `Halo Pengelola Kos Srirahayu, saya tertarik dengan ${roomType.name} (${formatRupiah(
          roomType.priceMonthly
        )}/bulan). Apakah masih tersedia?`
      : `Halo Pengelola Kos Srirahayu, saya tertarik untuk menanyakan ketersediaan kamar sewa bulanan.`;
    return `https://wa.me/${PROPERTY_INFO.phone.replace(/^0/, '62')}?text=${encodeURIComponent(
      msg
    )}`;
  };

  const handleContact = (roomType) => {
    window.open(buildWaUrl(roomType), '_blank', 'noopener,noreferrer');
  };

  // Fasilitas bersama
  const sharedFacilities = [
    { title: 'WiFi Cepat 50 Mbps', desc: 'Internet stabil untuk belajar & bekerja.', icon: Wifi },
    { title: 'Keamanan 24 Jam', desc: 'CCTV, kunci gerbang, lingkungan aman.', icon: ShieldCheck },
    { title: 'Dapur Bersama', desc: 'Area masak bersama yang bersih.', icon: Sparkles },
    { title: 'Tempat Jemur', desc: 'Area jemur pakaian yang luas.', icon: Droplets },
    { title: 'Parkir Aman', desc: 'Area parkir motor yang memadai.', icon: Car },
    { title: 'Kebersihan Rutin', desc: 'Pemeliharaan kebersihan area bersama.', icon: CheckCircle2 },
  ];

  return (
    <div className="pub-page">
      {/* ====================== HEADER (Sticky) ====================== */}
      <header className="pub-header">
        <div className="pub-header-inner">
          <div className="pub-header-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="pub-header-logo">
              <Building2 size={22} />
            </div>
            <div className="pub-header-brand-text">
              <span className="pub-header-name">Kos Srirahayu</span>
              <span className="pub-header-tag">Sukabumi, Jawa Barat</span>
            </div>
          </div>

          {/* Nav desktop */}
          <nav className="pub-header-nav">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Home size={15} /> Beranda
            </button>
            <button type="button" onClick={() => scrollToRef(roomsRef)}>
              <BedDouble size={15} /> Kamar
            </button>
            <button type="button" onClick={() => scrollToRef(facilitiesRef)}>
              <Sparkles size={15} /> Fasilitas
            </button>
            <button type="button" onClick={() => scrollToRef(locationRef)}>
              <MapPin size={15} /> Lokasi
            </button>
          </nav>

          <div className="pub-header-actions">
            <button
              type="button"
              className="btn btn-emerald-outline pub-header-login"
              onClick={onGoToDashboard}
            >
              <ShieldCheck size={16} />
              <span>Masuk Pengelola</span>
            </button>
            <button
              type="button"
              className="btn btn-emerald pub-header-cta"
              onClick={() => handleContact(null)}
            >
              <MessageCircle size={16} />
              <span>Hubungi</span>
            </button>
          </div>

          {/* Mobile nav toggle */}
          <button
            type="button"
            className="pub-mobile-toggle"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X size={22} /> : <BedDouble size={22} />}
          </button>
        </div>

        {/* Nav mobile */}
        {mobileNavOpen && (
          <div className="pub-mobile-nav">
            <button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileNavOpen(false); }}>
              <Home size={16} /> Beranda
            </button>
            <button type="button" onClick={() => scrollToRef(roomsRef)}>
              <BedDouble size={16} /> Kamar
            </button>
            <button type="button" onClick={() => scrollToRef(facilitiesRef)}>
              <Sparkles size={16} /> Fasilitas
            </button>
            <button type="button" onClick={() => scrollToRef(locationRef)}>
              <MapPin size={16} /> Lokasi
            </button>
            <button type="button" onClick={onGoToDashboard}>
              <ShieldCheck size={16} /> Masuk Pengelola
            </button>
          </div>
        )}
      </header>

      {/* ====================== HERO ====================== */}
      <section className="pub-hero">
        <div className="pub-hero-bg" />
        <div className="pub-hero-inner">
          <span className="pub-hero-pill">
            <Sparkles size={13} />
            Sewa Bulanan • Single Property • Sukabumi
          </span>
          <h1 className="pub-hero-title">
            Kos Srirahayu
            <span className="pub-hero-title-sub">
              Hunian kost bulanan bersih, aman &amp; strategis
            </span>
          </h1>
          <p className="pub-hero-desc">
            {PROPERTY_INFO.tagline}. Terletak di {PROPERTY_INFO.address.split(',').slice(0, 2).join(',')} —
            akses mudah ke kampus dan area perkantoran.
          </p>

          {/* Stats strip */}
          <div className="pub-hero-stats">
            <div className="pub-hero-stat">
              <span className="pub-hero-stat-num">{availableRooms}</span>
              <span className="pub-hero-stat-label">Kamar Tersedia</span>
            </div>
            <div className="pub-hero-stat-divider" />
            <div className="pub-hero-stat">
              <span className="pub-hero-stat-num">
                {minPrice > 0 ? `mulai ${formatRupiah(minPrice)}` : '-'}
              </span>
              <span className="pub-hero-stat-label">Per Bulan</span>
            </div>
            <div className="pub-hero-stat-divider" />
            <div className="pub-hero-stat">
              <span className="pub-hero-stat-num">{roomTypes.length}</span>
              <span className="pub-hero-stat-label">Tipe Kamar</span>
            </div>
          </div>

          <div className="pub-hero-cta">
            <button
              type="button"
              className="btn btn-emerald btn-lg pub-hero-cta-main"
              onClick={() => scrollToRef(roomsRef)}
            >
              <BedDouble size={18} />
              Lihat Kamar Tersedia
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              className="btn btn-emerald-outline btn-lg"
              onClick={() => handleContact(null)}
            >
              <MessageCircle size={18} />
              Tanya Pengelola
            </button>
          </div>
        </div>
      </section>

      {/* ====================== DAFTAR KAMAR ====================== */}
      <section className="pub-section" ref={roomsRef}>
        <div className="pub-section-inner">
          <div className="pub-section-head">
            <span className="pub-section-kicker">PILIHAN KAMAR</span>
            <h2 className="pub-section-title">Tipe Kamar &amp; Harga Sewa Bulanan</h2>
            <p className="pub-section-sub">
              Transparan tanpa biaya tersembunyi. Pilih kamar sesuai kebutuhan dan
              hubungi pengelola untuk pendaftaran.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="pub-filter-bar">
            <div className="pub-search-box">
              <Search size={18} className="pub-search-icon" />
              <input
                type="text"
                placeholder="Cari tipe kamar atau fasilitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pub-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="pub-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="pub-filter-group">
              <Filter size={16} className="pub-filter-icon" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pub-filter-select"
              >
                <option value="all">Semua Tipe</option>
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <div className="pub-filter-tabs">
                <button
                  type="button"
                  className={`pub-filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  Semua
                </button>
                <button
                  type="button"
                  className={`pub-filter-tab ${filterStatus === 'available' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('available')}
                >
                  Tersedia
                </button>
              </div>
            </div>
          </div>

          {/* Kamar Cards / Empty State */}
          {filteredTypes.length === 0 ? (
            <div className="pub-empty-state">
              <BedDouble size={48} />
              <h3>
                {roomTypes.length === 0
                  ? 'Katalog Kamar Sedang Disiapkan'
                  : 'Tidak ada kamar yang cocok dengan filter'}
              </h3>
              <p>
                {roomTypes.length === 0
                  ? 'Daftar tipe kamar dan tarif resmi Kos Srirahayu sedang diperbarui oleh pengelola. Silakan hubungi langsung pengelola untuk informasi ketersediaan kamar.'
                  : 'Coba ubah kata kunci pencarian atau filter Anda.'}
              </p>
              <button
                type="button"
                className="btn btn-emerald"
                onClick={() => handleContact(null)}
              >
                <MessageCircle size={16} />
                Hubungi Pengelola
              </button>
            </div>
          ) : (
            <>
              <div className="pub-room-grid">
                {filteredTypes.map((type) => {
                  const roomsOfT = rooms.filter((r) => r.typeId === type.id);
                  const avail = roomsOfT.filter((r) => r.status === 'available').length;
                  const total = roomsOfT.length;
                  const topFacs = (type.facilities || []).slice(0, 4);

                  return (
                    <div
                      key={type.id}
                      className="pub-room-card"
                      onClick={() => setSelectedType(type)}
                    >
                      <div className="pub-room-card-img-wrap">
                        <img
                          src={type.image || FALLBACK_IMG}
                          alt={type.name}
                          className="pub-room-card-img"
                          loading="lazy"
                        />
                        {type.badge && (
                          <span className="pub-room-card-badge">{type.badge}</span>
                        )}
                        <div className="pub-room-card-avail">
                          {total > 0 ? (
                            avail > 0 ? (
                              <span className="pub-avail-badge pub-avail-yes">
                                {avail} Tersedia
                              </span>
                            ) : (
                              <span className="pub-avail-badge pub-avail-no">
                                Penuh
                              </span>
                            )
                          ) : (
                            <span className="pub-avail-badge pub-avail-neutral">
                              Hubungi Pengelola
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pub-room-card-body">
                        <div className="pub-room-card-head">
                          <h3 className="pub-room-card-name">{type.name}</h3>
                          <span className="pub-room-card-size">{type.size}</span>
                        </div>

                        <div className="pub-room-card-price">
                          <span className="pub-room-card-price-val">
                            {formatRupiah(type.priceMonthly)}
                          </span>
                          <span className="pub-room-card-price-unit">/ bulan</span>
                        </div>

                        <div className="pub-room-card-facs">
                          {topFacs.map((fac, i) => {
                            const Icon = getFacilityIcon(fac);
                            return (
                              <span key={i} className="pub-room-card-fac-pill">
                                <Icon size={13} />
                                {fac}
                              </span>
                            );
                          })}
                          {type.facilities?.length > 4 && (
                            <span className="pub-room-card-fac-more">
                              +{type.facilities.length - 4}
                            </span>
                          )}
                        </div>

                        <div className="pub-room-card-actions">
                          <button
                            type="button"
                            className="btn btn-emerald-outline btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedType(type);
                            }}
                          >
                            <Eye size={15} />
                            Lihat Detail
                          </button>
                          <button
                            type="button"
                            className="btn btn-emerald btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContact(type);
                            }}
                          >
                            <MessageCircle size={15} />
                            Tanya
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredTypes.length < roomTypes.length && (
                <p className="pub-filter-count">
                  Menampilkan {filteredTypes.length} dari {roomTypes.length} tipe kamar
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* ====================== FASILITAS ====================== */}
      <section className="pub-section pub-section-alt" ref={facilitiesRef}>
        <div className="pub-section-inner">
          <div className="pub-section-head">
            <span className="pub-section-kicker">FASILITAS &amp; KENYAMANAN</span>
            <h2 className="pub-section-title">Fasilitas Pendukung Kos Srirahayu</h2>
            <p className="pub-section-sub">
              Semua yang kamu butuhkan untuk kenyamanan tinggal sehari-hari.
            </p>
          </div>

          <div className="pub-fac-grid">
            {sharedFacilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div key={idx} className="pub-fac-card">
                  <div className="pub-fac-icon-wrap">
                    <Icon size={26} />
                  </div>
                  <h4 className="pub-fac-title">{fac.title}</h4>
                  <p className="pub-fac-desc">{fac.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================== LOKASI & KONTAK ====================== */}
      <section className="pub-section" ref={locationRef}>
        <div className="pub-section-inner">
          <div className="pub-section-head">
            <span className="pub-section-kicker">LOKASI &amp; KONTAK</span>
            <h2 className="pub-section-title">Kunjungi &amp; Hubungi Kami</h2>
            <p className="pub-section-sub">
              Datang langsung untuk survei kamar atau hubungi pengelola via WhatsApp.
            </p>
          </div>

          <div className="pub-loc-grid">
            {/* Info kontak */}
            <div className="pub-loc-info">
              <div className="pub-loc-item">
                <div className="pub-loc-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="pub-loc-label">Alamat Lengkap</span>
                  <p className="pub-loc-val">{PROPERTY_INFO.address}</p>
                </div>
              </div>

              <div className="pub-loc-item">
                <div className="pub-loc-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="pub-loc-label">Kontak Pengelola</span>
                  <p className="pub-loc-val">
                    {PROPERTY_INFO.ownerName} — {PROPERTY_INFO.phone}
                  </p>
                </div>
              </div>

              <div className="pub-loc-item">
                <div className="pub-loc-icon">
                  <Building2 size={20} />
                </div>
                <div>
                  <span className="pub-loc-label">Pembayaran</span>
                  <p className="pub-loc-val">
                    {PROPERTY_INFO.bankAccount.bank} — {PROPERTY_INFO.bankAccount.accountNumber}
                    <br />
                    a.n. {PROPERTY_INFO.bankAccount.accountHolder}
                  </p>
                </div>
              </div>

              <a
                href={buildWaUrl(null)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-emerald pub-loc-cta"
              >
                <MessageCircle size={18} />
                Chat Pengelola via WhatsApp
              </a>
            </div>

            {/* Map placeholder */}
            <div className="pub-loc-map">
              <div className="pub-loc-map-inner">
                <Navigation size={40} className="pub-loc-map-icon" />
                <p className="pub-loc-map-text">
                  {PROPERTY_INFO.address.split(',').slice(0, 2).join(',')}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    PROPERTY_INFO.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-emerald-outline btn-sm"
                >
                  <MapPin size={14} />
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Aturan kos */}
          <div className="pub-rules">
            <h3 className="pub-rules-title">
              <ShieldCheck size={20} className="text-emerald-600" />
              Tata Tertib &amp; Ketentuan Kos
            </h3>
            <div className="pub-rules-list">
              {PROPERTY_INFO.rules.map((rule, idx) => (
                <div key={idx} className="pub-rule-item">
                  <span className="pub-rule-num">{idx + 1}</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div className="pub-footer-brand">
            <div className="pub-footer-logo">
              <Building2 size={20} />
            </div>
            <div>
              <span className="pub-footer-name">Kos Srirahayu</span>
              <span className="pub-footer-tag">
                Sistem Informasi Manajemen &amp; Pembayaran Kos
              </span>
            </div>
          </div>
          <p className="pub-footer-copy">
            &copy; {new Date().getFullYear()} Kos Srirahayu — React + Vite dengan
            Metode RAD. Dibuat untuk objek tunggal Kos Srirahayu.
          </p>
          <button
            type="button"
            className="btn btn-emerald-outline btn-sm pub-footer-admin"
            onClick={onGoToDashboard}
          >
            <ShieldCheck size={14} />
            Dashboard Pengelola
            <ArrowRight size={14} />
          </button>
        </div>
      </footer>

      {/* ====================== MODAL DETAIL ====================== */}
      {selectedType && (
        <PublicRoomDetailModal
          roomType={selectedType}
          rooms={rooms}
          onClose={() => setSelectedType(null)}
          onContact={handleContact}
        />
      )}
    </div>
  );
}
