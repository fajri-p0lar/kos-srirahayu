import React, { useState } from 'react';
import { 
  BedDouble, 
  Users, 
  Wallet, 
  Receipt, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2,
  RefreshCw,
  FileCheck2
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import OccupancyVisualizer from '../components/dashboard/OccupancyVisualizer';
import CashFlowSummary from '../components/dashboard/CashFlowSummary';
import RecentBillingsTable from '../components/dashboard/RecentBillingsTable';
import InvoiceDetailModal from '../components/dashboard/InvoiceDetailModal';
import WhatsAppSimModal from '../components/dashboard/WhatsAppSimModal';
import TenantDashboardView from '../components/dashboard/TenantDashboardView';
import { formatRupiah, formatMonthYear } from '../utils/formatters';

export default function DashboardPage({ 
  rooms, 
  roomTypes, 
  tenants, 
  billings, 
  expenses, 
  cashFlowHistory,
  onUpdateBillings
}) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [waSimTarget, setWaSimTarget] = useState(null);

  // Perhitungan Metrik Modul 1
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
  
  const activeTenants = tenants.filter(t => t.status === 'active').length;

  const totalCollected = billings.filter(b => b.status === 'paid').reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPending = billings.filter(b => b.status === 'pending').reduce((acc, b) => acc + b.totalAmount, 0);
  const totalOverdue = billings.filter(b => b.status === 'overdue').reduce((acc, b) => acc + b.totalAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Handler konfirmasi lunas (memperbarui state lokal agar live dan interaktif)
  const handleMarkAsPaid = (billingId) => {
    const updated = billings.map(b => {
      if (b.id === billingId) {
        return {
          ...b,
          status: 'paid',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'Transfer (Dikonfirmasi Admin)'
        };
      }
      return b;
    });
    onUpdateBillings(updated);
  };


  // Dashboard Utama Admin & Owner
  return (
    <div className="page-wrapper animate-fade-in">
      {/* Page Header */}
      <div className="page-header mt-4">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Ringkasan operasional Kos Srirahayu</p>
        </div>
      </div>

      {/* Stat Cards Grid (Metrik Inti Modul 1) */}
      <div className="stats-grid mt-4">
        <StatCard
          title="Tingkat Hunian Kamar"
          value={`${occupiedRooms} / ${totalRooms} Kamar`}
          subtext={`${availableRooms} Kamar Kosong • ${maintenanceRooms} Perawatan`}
          icon={BedDouble}
          color="blue"
          trend={{ 
            positive: true, 
            text: totalRooms > 0 ? `${Math.round((occupiedRooms / totalRooms) * 100)}% Terisi` : '0% (Kamar Kosong)' 
          }}
        />

        <StatCard
          title="Penghuni Aktif"
          value={`${activeTenants} Orang`}
          subtext="Terdaftar sewa bulanan resmi"
          icon={Users}
          color="indigo"
          trend={{ positive: true, text: `${occupiedRooms} Kamar Terisi` }}
        />

        <StatCard
          title="Pemasukan Sewa Terkumpul"
          value={formatRupiah(totalCollected)}
          subtext="Pembayaran lunas bulan berjalan"
          icon={Wallet}
          color="emerald"
          trend={{ positive: true, text: "Realisasi Kas Masuk" }}
        />

        <StatCard
          title="Tagihan Belum Lunas"
          value={formatRupiah(totalPending + totalOverdue)}
          subtext={`${billings.filter(b => b.status !== 'paid').length} tagihan (${formatRupiah(totalOverdue)} terlambat)`}
          icon={AlertTriangle}
          color={totalOverdue > 0 ? "rose" : "amber"}
          trend={{ positive: false, text: "Piutang Berjalan" }}
        />

        <StatCard
          title="Biaya Operasional"
          value={formatRupiah(totalExpenses)}
          subtext="Listrik, WiFi, sampah, servis AC"
          icon={Receipt}
          color="amber"
          trend={{ positive: true, text: "Beban Operasional" }}
        />
      </div>

      {/* Grid: Occupancy Visualizer & Cash Flow Summary */}
      <div className="dashboard-grid-2col mt-6">
        <OccupancyVisualizer
          rooms={rooms}
          roomTypes={roomTypes}
          tenants={tenants}
          onSelectRoom={(room) => {
            const tenant = tenants.find(t => t.id === room.tenantId);
            const bill = billings.find(b => b.roomNumber === room.number);
            if (bill) setSelectedInvoice(bill);
          }}
        />

        <CashFlowSummary
          billings={billings}
          expenses={expenses}
          history={cashFlowHistory}
        />
      </div>

      {/* Tabel Tagihan Bulanan (Status Lunas, Menunggu, Terlambat) */}
      <div className="mt-6">
        <RecentBillingsTable
          billings={billings}
          onSelectBilling={(b) => setSelectedInvoice(b)}
          onOpenWaSim={(b) => setWaSimTarget(b)}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>

      {/* Modals */}
      {selectedInvoice && (
        <InvoiceDetailModal
          billing={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onOpenWaSim={(b) => setWaSimTarget(b)}
          onMarkAsPaid={handleMarkAsPaid}
        />
      )}

      {waSimTarget && (
        <WhatsAppSimModal
          billing={waSimTarget}
          tenant={tenants.find(t => t.id === waSimTarget.tenantId)}
          onClose={() => setWaSimTarget(null)}
        />
      )}
    </div>
  );
}
