/**
 * DATABASE AWAL KOS SRIRAHAYU — DATA ASLI PENGELOLA
 * Data kamar dan tipe kamar diinput berdasarkan informasi asli dari pengelola Kos Srirahayu.
 * Bukan data dummy/fabricated — merupakan data operasional resmi Kos Srirahayu.
 *
 * Catatan pricing: Tarif dasar untuk 1 penghuni, tambahan Rp 100.000/bulan per penghuni ekstra.
 */

// Versi data — jika berubah, localStorage lama akan di-reset ke data awal terbaru
export const DATA_VERSION = 'kos-srirahayu-v4';

export const PROPERTY_INFO = {
  name: "Kos Srirahayu",
  tagline: "Hunian Kost Bulanan Bersih, Aman, dan Nyaman",
  address: "Sukabumi, Jawa Barat",
  phone: "085797359098",
  ownerName: "Ai Jamilah",
  bankAccount: {
    bank: "BCA",
    accountNumber: "8465123901",
    accountHolder: "Srirahayu"
  },
  rules: [
    "Pembayaran sewa dilakukan bulanan selambatnya tanggal 10.",
    "Tamu lawan jenis dilarang masuk ke dalam kamar.",
    "Jam bertamu maksimal pukul 22.00 WIB demi kenyamanan bersama.",
    "Menjaga kebersihan area bersama dan fasilitas kamar."
  ]
};

// 1. Tipe Kamar: 2 Tipe Asli Kos Srirahayu
export const ROOM_TYPES = [
  {
    id: 'type-standar',
    name: 'Kamar Standar',
    priceMonthly: 500000,
    size: '3 x 3,5 m (1-2 orang)',
    facilities: [
      'Kasur Springbed',
      'Lemari Pakaian',
      'Meja & Kursi Belajar',
      'Kamar Mandi Dalam',
      'Listrik Termasuk',
      'Air Bersih Termasuk'
    ],
    description:
      'Kamar ukuran standar di lantai 1, cocok untuk 1-2 orang. ' +
      'Tarif sudah termasuk perabotan (tempat tidur, lemari), listrik, air, dan kamar mandi dalam. ' +
      'Tambahan Rp 100.000/bulan untuk setiap penghuni tambahan.',
    badge: 'Hemat',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'type-deluxe',
    name: 'Kamar Deluxe',
    priceMonthly: 650000,
    size: '4 x 5 m (1-4 orang)',
    facilities: [
      'Kasur Springbed',
      'Lemari Pakaian',
      'Meja & Kursi Belajar',
      'Kamar Mandi Dalam',
      'Listrik Termasuk',
      'Air Bersih Termasuk'
    ],
    description:
      'Kamar ukuran besar di lantai 2, cocok untuk 1-4 orang. ' +
      'Ruangan lebih luas dengan fasilitas yang sama: perabotan, listrik, air, dan kamar mandi dalam. ' +
      'Tambahan Rp 100.000/bulan untuk setiap penghuni tambahan.',
    badge: 'Lebih Luas',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80'
  }
];

// 2. Inventaris Kamar: 9 Kamar Asli Kos Srirahayu
export const INITIAL_ROOMS = [
  // --- Lantai 1: 7 Kamar Standar ---
  { id: 'room-1', number: '1', floor: 1, typeId: 'type-standar', status: 'available', tenantId: null, notes: '' },
  { id: 'room-2', number: '2', floor: 1, typeId: 'type-standar', status: 'available', tenantId: null, notes: '' },
  { id: 'room-3', number: '3', floor: 1, typeId: 'type-standar', status: 'available', tenantId: null, notes: '' },
  { id: 'room-4', number: '4', floor: 1, typeId: 'type-standar', status: 'available', tenantId: null, notes: '' },
  { id: 'room-5', number: '5', floor: 1, typeId: 'type-standar', status: 'available', tenantId: null, notes: '' },
  { id: 'room-6', number: '6', floor: 1, typeId: 'type-standar', status: 'available', tenantId: null, notes: '' },
  { id: 'room-7', number: '7', floor: 1, typeId: 'type-standar', status: 'available', tenantId: null, notes: '' },
  // --- Lantai 2: 2 Kamar Deluxe ---
  { id: 'room-8', number: '8', floor: 2, typeId: 'type-deluxe', status: 'available', tenantId: null, notes: '' },
  { id: 'room-9', number: '9', floor: 2, typeId: 'type-deluxe', status: 'available', tenantId: null, notes: '' },
];

// 3. Data Penghuni: Dimulai Kosong (belum ada penghuni)
export const INITIAL_TENANTS = [];

// 4. Tagihan Bulanan: Dimulai Kosong
export const INITIAL_BILLINGS = [];

// 5. Biaya Operasional: Dimulai Kosong
export const INITIAL_EXPENSES = [];

// 6. Riwayat Arus Kas: Dimulai Kosong (Kalkulasi dinamis dari data riil)
export const CASH_FLOW_HISTORY = [];
