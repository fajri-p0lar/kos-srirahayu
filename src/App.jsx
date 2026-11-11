import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import RoomManagementPage from './components/rooms/RoomManagementPage';
import TenantManagementPage from './components/tenants/TenantManagementPage';
import WhatsAppPage from './components/whatsapp/WhatsAppPage';
import UpcomingModulePlaceholder from './components/common/UpcomingModulePlaceholder';
import AdminSetupModal from './components/auth/AdminSetupModal';
import LandingPage from './components/landing/LandingPage';
import {
  INITIAL_ROOMS,
  ROOM_TYPES,
  INITIAL_TENANTS,
  INITIAL_BILLINGS,
  INITIAL_EXPENSES,
  CASH_FLOW_HISTORY,
  DATA_VERSION
} from './data/mockData';
import './App.css';

export default function App() {
  // ===== Mode Aplikasi: 'public' (pelanggan) | 'admin' (pengelola) =====
  const [appView, setAppView] = useState('public');
  const [activeModule, setActiveModule] = useState('dashboard');

  // Bersihkan sisa data dummy lawas jika ada di peramban
  useEffect(() => {
    const legacyKeys = ['srirahayu_rooms', 'srirahayu_room_types', 'srirahayu_billings', 'srirahayu_tenants', 'srirahayu_expenses'];
    legacyKeys.forEach(k => localStorage.removeItem(k));
    // Simpan versi data terbaru
    localStorage.setItem('srirahayu_db_version', DATA_VERSION);
  }, []);

  // Helper: cek versi data — jika tidak cocok, gunakan data awal terbaru
  const loadData = (key, initial) => {
    const version = localStorage.getItem('srirahayu_db_version');
    if (version !== DATA_VERSION) return initial;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  };

  // 1. Akun Administrator Utama (Mekanisme Setup Aman Pertama Kali)
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('srirahayu_db_admin');
    return saved ? JSON.parse(saved) : null;
  });

  // 2. Database Operasional Kos Srirahayu (Data Asli Pengelola)
  const [rooms, setRooms] = useState(() => loadData('srirahayu_db_rooms', INITIAL_ROOMS));

  const [roomTypes, setRoomTypes] = useState(() => loadData('srirahayu_db_room_types', ROOM_TYPES));

  const [billings, setBillings] = useState(() => loadData('srirahayu_db_billings', INITIAL_BILLINGS));

  const [tenants, setTenants] = useState(() => loadData('srirahayu_db_tenants', INITIAL_TENANTS));

  const [expenses, setExpenses] = useState(() => loadData('srirahayu_db_expenses', INITIAL_EXPENSES));

  // Sinkronisasi data operasional ke LocalStorage (Data Asli)
  useEffect(() => {
    localStorage.setItem('srirahayu_db_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('srirahayu_db_room_types', JSON.stringify(roomTypes));
  }, [roomTypes]);

  useEffect(() => {
    localStorage.setItem('srirahayu_db_billings', JSON.stringify(billings));
  }, [billings]);

  useEffect(() => {
    localStorage.setItem('srirahayu_db_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('srirahayu_db_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Handler Setup Admin Pertama Kali
  const handleCompleteAdminSetup = (account) => {
    setAdminUser(account);
    localStorage.setItem('srirahayu_db_admin', JSON.stringify(account));
  };

  // Handler beralih ke mode pengelola
  const handleGoToAdmin = () => {
    setAppView('admin');
  };

  // Handler beralih ke mode pelanggan (website publik)
  const handleGoToPublic = () => {
    setAppView('public');
  };

  // Handler Reset Database ke Zero-Data (Pengosongan Bersih)
  const handleResetDatabase = () => {
    const confirmed = window.confirm(
      "PERINGATAN: Apakah Anda yakin ingin mengosongkan seluruh database operasional? Seluruh data kamar, penghuni, tagihan, dan pengeluaran akan dikembalikan ke keadaan kosong (Zero-Data)."
    );
    if (confirmed) {
      setRooms([]);
      setRoomTypes([]);
      setTenants([]);
      setBillings([]);
      setExpenses([]);
      localStorage.setItem('srirahayu_db_rooms', JSON.stringify([]));
      localStorage.setItem('srirahayu_db_room_types', JSON.stringify([]));
      localStorage.setItem('srirahayu_db_tenants', JSON.stringify([]));
      localStorage.setItem('srirahayu_db_billings', JSON.stringify([]));
      localStorage.setItem('srirahayu_db_expenses', JSON.stringify([]));
    }
  };

  // ====== RENDER: MODE PELANGGAN (Website Publik Gaya Mamikos) ======
  if (appView === 'public') {
    return (
      <LandingPage
        rooms={rooms}
        roomTypes={roomTypes}
        onGoToDashboard={handleGoToAdmin}
      />
    );
  }

  // ====== RENDER: MODE ADMIN / PENGELOLA ======
  return (
    <div className="app-container">
      {/* Modal Wajib: Setup Akun Admin Pertama jika belum ada akun */}
      <AdminSetupModal
        isOpen={!adminUser}
        onCompleteSetup={handleCompleteAdminSetup}
      />

      <div className="flex w-full">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          onSelectModule={(id) => setActiveModule(id)}
          onGoToPublic={handleGoToPublic}
        />

        <div className="main-content">
          <Navbar adminUser={adminUser} onGoToPublic={handleGoToPublic} />

          {activeModule === 'dashboard' ? (
            <DashboardPage
              rooms={rooms}
              roomTypes={roomTypes}
              tenants={tenants}
              billings={billings}
              expenses={expenses}
              cashFlowHistory={CASH_FLOW_HISTORY}
              onUpdateBillings={(newBills) => setBillings(newBills)}
            />
          ) : activeModule === 'rooms' ? (
            <RoomManagementPage
              rooms={rooms}
              roomTypes={roomTypes}
              tenants={tenants}
              onUpdateRooms={(newRooms) => setRooms(newRooms)}
              onUpdateRoomTypes={(newTypes) => setRoomTypes(newTypes)}
            />
          ) : activeModule === 'tenants' ? (
            <TenantManagementPage
              rooms={rooms}
              roomTypes={roomTypes}
              tenants={tenants}
              billings={billings}
              onUpdateTenants={(newTenants) => setTenants(newTenants)}
              onUpdateBillings={(newBillings) => setBillings(newBillings)}
              onUpdateRooms={(newRooms) => setRooms(newRooms)}
            />
          ) : activeModule === 'whatsapp' ? (
            <WhatsAppPage
              billings={billings}
              tenants={tenants}
              rooms={rooms}
            />
          ) : (
            <UpcomingModulePlaceholder
              moduleId={activeModule}
              onBackToDashboard={() => setActiveModule('dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
