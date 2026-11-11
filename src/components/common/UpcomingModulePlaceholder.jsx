import React from 'react';
import { Clock, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function UpcomingModulePlaceholder({ moduleId, onBackToDashboard }) {
  const moduleMap = {
    rooms: {
      title: "Modul 2 — Room & Room Type Management",
      desc: "Manajemen CRUD data kamar, tipe kamar, fasilitas kamar mandi dalam/luar/balkon, penetapan harga sewa bulanan, dan galeri foto kamar.",
      phase: "Konstruksi RAD Tahap Berikutnya (Estimasi 4–5 hari)",
      sotItems: [
        "CRUD data kamar dan tipe kamar (Standar Non-AC, Standar AC, Deluxe AC Balkon)",
        "Pengaturan harga sewa bulanan (bukan harian)",
        "Status ketersediaan kamar otomatis terhubung dengan penempatan tenant",
        "Foto dan galeri kamar tanpa booking harian"
      ]
    },
    tenants: {
      title: "Modul 3 — Tenant & Billing Management",
      desc: "Manajemen data identitas penghuni, relasi kamar, periode sewa bulanan, pembuatan invoice tagihan, dan riwayat pembayaran.",
      phase: "Konstruksi RAD Tahap Berikutnya (Estimasi 4–5 hari)",
      sotItems: [
        "Pencatatan data identitas dan kontak penghuni resmi",
        "Penetapan tanggal mulai sewa bulanan dan jatuh tempo tagihan",
        "Rincian tagihan komponen sewa, listrik, air, dan kebersihan",
        "Pencatatan pelunasan dan arsip riwayat transaksi bulanan"
      ]
    },
    whatsapp: {
      title: "Modul 4 — WhatsApp Gateway & Notifications",
      desc: "Pengingat otomatis jatuh tempo tagihan sewa bulanan, konfirmasi pembayaran lunas, dan log notifikasi.",
      phase: "Konstruksi RAD Tahap Berikutnya (Estimasi 4–6 hari)",
      sotItems: [
        "Template pesan pengingat tagihan bulanan",
        "Template konfirmasi pembayaran lunas",
        "Status simulasi resmi berlabel jelas (sesuai SOT)",
        "Direct link wa.me untuk pengiriman nyata melalui pengelola"
      ]
    },
    expenses: {
      title: "Modul 5 — Operational Expenses & Reports",
      desc: "Pencatatan pengeluaran operasional kos, filter periode bulanan/tahunan, dan rekapitulasi laba bersih.",
      phase: "Konstruksi RAD Tahap Berikutnya (Estimasi 4–5 hari)",
      sotItems: [
        "Pencatatan pengeluaran (WiFi, listrik induk, sampah, perawatan AC, renovasi)",
        "Kategori pengeluaran operasional Kos Srirahayu",
        "Laporan bulanan dan tahunan arus kas",
        "Perhitungan laba bersih (Pemasukan Sewa - Biaya Operasional)"
      ]
    },
    users: {
      title: "Modul 6 — User Management & Authentication",
      desc: "Autentikasi akun dan pembatasan hak akses berjenjang untuk Owner, Admin/Pengelola, dan Tenant.",
      phase: "Konstruksi RAD Tahap Berikutnya (Estimasi 3–4 hari)",
      sotItems: [
        "Hak akses Owner: Monitoring ringkasan, laporan keuangan, dan audit sistem",
        "Hak akses Admin: Operasional kamar, penghuni, tagihan, dan pengeluaran",
        "Hak akses Tenant: Portal pribadi tagihan dan kamar miliknya sendiri"
      ]
    },
    testing: {
      title: "Modul 7 — Integration, Testing & UAT",
      desc: "Pengujian menyeluruh integrasi antar modul, pengujian black-box, dan skenario User Acceptance Testing.",
      phase: "Fase Cutover RAD (Estimasi 4–6 hari)",
      sotItems: [
        "Pengujian black-box seluruh alur bisnis sewa bulanan",
        "Verifikasi validasi input, status tagihan, dan filter laporan",
        "Dokumentasi hasil UAT lulus (Pass/Fail)",
        "Penyusunan laporan akhir kesiapan sistem untuk Dosen Pembimbing"
      ]
    },
    presentation: {
      title: "Modul 8 — PPT Hasil Proyek",
      desc: "Penyusunan presentasi PowerPoint hasil proyek di luar aplikasi setelah testing/UAT selesai.",
      phase: "Deliverable Dokumen Presentasi (Estimasi 2–3 hari)",
      sotItems: [
        "Struktur slide presentasi berdasarkan PPT-OUTLINE.md",
        "Screenshot aktual sistem Kos Srirahayu yang telah berfungsi",
        "Penyajian hasil metode RAD, arsitektur React+Vite, dan kesimpulan proyek"
      ]
    }
  };

  const item = moduleMap[moduleId] || {
    title: "Modul SOT Kos Srirahayu",
    desc: "Modul ini akan dikerjakan pada tahap berikutnya setelah modul aktif disetujui.",
    phase: "RAD Next Phase",
    sotItems: []
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="card p-8 text-center max-w-2xl mx-auto my-8">
        <div className="inline-flex p-3 rounded-full bg-primary-50 text-primary mb-3">
          <Clock size={36} />
        </div>
        <span className="proto-badge badge-warning">{item.phase}</span>
        <h2 className="text-xl font-bold text-slate-800 mt-3">{item.title}</h2>
        <p className="text-slate-600 text-sm mt-2 max-w-lg mx-auto">{item.desc}</p>

        <div className="sot-box text-left mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Rencana Kerja SOT:
          </span>
          <ul className="mt-2 space-y-2 text-xs text-slate-600">
            {item.sotItems.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary flex-shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={onBackToDashboard}
          >
            <ArrowLeft size={14} />
            Kembali ke Modul 1 (Dashboard Aktif)
          </button>
        </div>
      </div>
    </div>
  );
}
