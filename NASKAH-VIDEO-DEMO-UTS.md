# NASKAH / PANDUAN REKAMAN VIDEO DEMO APLIKASI (UTS)
## MATA KULIAH: PEMROGRAMAN VISUAL — STIKOM EL RAHMA

> **Tips Rekaman:**
> - Durasi ideal: **5 – 8 menit**.
> - Tidak wajib menampilkan wajah (*on-camera*), cukup rekam layar (*screen record*) dengan suara yang jelas.
> - Tools rekam layar gratis: **OBS Studio**, **Xbox Game Bar (Windows + G)**, atau **Clipchamp / Loom**.

---

### SEGMENT 1: PEMBUKA & IDENTITAS DIRI (Durasi: ~45 Detik)
**Tampilan Layar:** Buka browser di halaman Landing Page publik Kos Srirahayu (`localhost:5173` atau link Vercel).

**Teks yang Dibaca / Dikatakan:**
> *"Assalamu’alaikum Warahmatullahi Wabarakatuh.*  
> *Selamat pagi/siang/malam kepada Bapak Muhammad Akbar Firdaus, S.Kom selaku dosen pengampu mata kuliah Pemrograman Visual di STIKOM EL RAHMA.*  
>  
> *Perkenalkan, nama saya **Rahmattuloh Fajri Rahmattulloh**, NIM **2511080019**, dari angkatan IT 8.*  
> *Pada video kali ini, saya akan mendemonstrasikan proyek Ujian Tengah Semester (UTS) yang telah saya kembangkan, yaitu **Sistem Informasi Manajemen dan Pembayaran Kos Berbasis Website pada Kos Srirahayu**.*

---

### SEGMENT 2: TUJUAN & GAMBARAN UMUM APLIKASI (Durasi: ~1 Menit)
**Tampilan Layar:** Tetap di Landing Page, scroll perlahan ke bawah memperlihatkan profil kos, katalog tipe kamar, dan denah lantai.

**Teks yang Dibaca / Dikatakan:**
> *"Tujuan dari pembuatan aplikasi ini adalah untuk memberikan solusi digital bagi pemilik dan pengelola Kos Srirahayu yang selama ini masih mencatat pembukuan sewa dan kamar secara manual.*  
> *Aplikasi ini memiliki dua sisi pengguna utama:*  
> 1. *Pertama, **Halaman Publik** untuk calon penghuni kos agar dapat melihat tipe kamar, harga sewa bulanan, fasilitas, ketersediaan kamar, dan kontak resmi.*  
> 2. *Kedua, **Dashboard Pengelola (Admin)** untuk memonitor okupansi kamar, mengelola inventaris kamar, mencatat penghuni, membuat invoice tagihan bulanan, serta memantau arus kas.*"

---

### SEGMENT 3: PENJELASAN TEKNOLOGI & DATA DUMMY (FRONT-END ONLY) (Durasi: ~1 Menit)
**Tampilan Layar:** Tunjukkan sekilas struktur folder di VS Code (terutama folder `src/` dan file `src/data/mockData.js`).

**Teks yang Dibaca / Dikatakan:**
> *"Sesuai dengan ketentuan instruksi tugas UTS, aplikasi ini dibangun secara **Front-End Only** karena materi perkuliahan sejauh ini berfokus pada antarmuka visual dan belum mencakup database backend.*  
>  
> *Teknologi yang saya gunakan meliputi:*  
> - *Framework **React versi 19** menggunakan bundler **Vite**.*  
> - *Pustaka icon modern **Lucide React**.*  
> - *Styling modern menggunakan **CSS Grid, Flexbox, dan Glassmorphism**.*  
>  
> *Untuk data yang ditampilkan dan diolah, aplikasi ini menggunakan **Data Dummy** yang terstruktur dalam bentuk array dan objek JavaScript pada file `mockData.js`. Agar perubahan data saat pengujian tidak hilang saat halaman di-refresh, saya menghubungkannya dengan **Web Storage API (localStorage)** peramban klien. Sehingga data belum terhubung ke database server maupun REST API eksternal.*"

---

### SEGMENT 4: DEMONSTRASI FITUR-FITUR UTAMA APLIKASI (Durasi: ~4 Menit)

#### 1. Halaman Publik (Landing Page)
**Aksi di Layar:**
- Klik filter kamar (Lantai 1, Lantai 2).
- Tunjukkan kartu tipe kamar: Standar Non-AC, Standar AC, dan Deluxe AC Balkon.
- Klik tombol **"Masuk Pengelola"** di navbar atas.

**Teks:**
> *"Pertama, kita melihat halaman publik. Di sini calon penyewa bisa melihat denah ketersediaan kamar di Lantai 1 dan Lantai 2 secara transparan, lengkap dengan fasilitas dan harganya. Sekarang kita masuk ke mode pengelola melalui tombol Masuk Pengelola di pojok kanan atas."*

#### 2. Dashboard Analitik Pengelola
**Aksi di Layar:**
- Arahkan kursor ke kartu KPI (Kamar Terisi 9/12, Okupansi 75%, Pemasukan, Piutang).
- Tunjukkan grafik batang arus kas (*Cash Flow History*).
- Tunjukkan denah visual kamar interaktif.
- Buka modal kuitansi salah satu tagihan pada tabel.

**Teks:**
> *"Di halaman Dashboard, pengelola langsung disuguhkan ringkasan KPI bisnis: jumlah kamar terisi, persentase okupansi, total uang sewa terkumpul, serta sisa piutang tagihan. Terdapat juga visualisasi grafik arus kas 6 bulan terakhir dan denah interaktif kamar. Pada tabel tagihan berjalan, kita bisa mengklik 'Lihat Kuitansi' untuk melihat rincian nota sewa resmi."*

#### 3. Modul Manajemen Kamar (Room Management)
**Aksi di Layar:**
- Klik menu **"Manajemen Kamar"** di sidebar.
- Tunjukkan peralihan dari **Mode Grid (Kartu)** ke **Mode Tabel**.
- Gunakan fitur pencarian (ketik "101" atau "Deluxe").
- Klik salah satu foto kamar untuk membuka **Lightbox Galeri Foto** interaktif.
- Tunjukkan tombol **"Tambah Kamar"** dan jelaskan validasinya.
- Tunjukkan fitur proteksi integritas: coba klik hapus pada kamar yang terisi, maka sistem akan menolak dengan dialog proteksi.

**Teks:**
> *"Selanjutnya adalah Modul Manajemen Kamar. Di sini pengelola dapat melihat inventaris kamar baik dalam bentuk Kartu Visual maupun Tabel. Kita bisa memfilter berdasarkan lantai maupun status kamar. Jika kita mengklik foto kamar, akan terbuka Galeri Foto Lightbox beresolusi tinggi. Di sini juga ada validasi keamanan: kamar yang sudah ada penghuninya tidak bisa dihapus sembarangan untuk menjaga integritas data penagihan."*

#### 4. Modul Manajemen Penghuni & Tagihan (Tenant & Billing)
**Aksi di Layar:**
- Klik menu **"Penghuni & Tagihan"** di sidebar.
- Buka tab **"Daftar Penghuni"**, tunjukkan data penghuni, kamar, dan kontak WhatsApp.
- Buka tab **"Tagihan Bulanan"**, tunjukkan badge status: "Lunas", "Menunggu", dan "Terlambat".
- Klik tombol **"Catat Pembayaran"** pada salah satu tagihan yang berstatus "Menunggu", pilih metode (misal: Transfer BCA), lalu klik konfirmasi. Tunjukkan statusnya langsung berubah menjadi Lunas dan masuk ke tab **"Riwayat Pembayaran"**.

**Teks:**
> *"Pada Modul Penghuni & Tagihan, pengelola dapat mendaftarkan penyewa baru. Status kamar akan otomatis tersinkronisasi menjadi 'Terisi'. Pada tab Tagihan Bulanan, sistem otomatis menghitung tarif dasar dan tambahan jika ada penghuni ekstra. Ketika penghuni mentransfer uang sewa, pengelola tinggal menekan 'Catat Pembayaran', memilih metode pembayaran, dan status tagihan langsung terupdate menjadi Lunas serta terarsip rapi di Riwayat Pembayaran."*

#### 5. Modul Notifikasi WhatsApp Gateway (Simulasi)
**Aksi di Layar:**
- Klik menu **"Notifikasi WhatsApp"** di sidebar.
- Tunjukkan label notice *"Mode Simulasi (SOT)"*.
- Tunjukkan tab tagihan yang perlu diingatkan.
- Klik tombol **"Preview Pesan"** dan tunjukkan tampilan format pesan WhatsApp yang rapi (memuat nomor invoice, nominal, jatuh tempo, dan rekening BCA).

**Teks:**
> *"Terakhir, terdapat Modul WhatsApp Gateway. Sesuai batasan proyek, modul ini beroperasi dalam mode simulasi transparan. Modul ini membantu pengelola menyusun format pesan pengingat jatuh tempo secara otomatis. Pengelola cukup mengklik tombol WhatsApp untuk membuka tautan wa.me sehingga pesan otomatis siap dikirim ke penghuni tanpa repot mengetik ulang."*

---

### SEGMENT 5: PENUTUP & KESIMPULAN (Durasi: ~45 Detik)
**Tampilan Layar:** Kembali ke tampilan Dashboard utama atau Landing Page.

**Teks yang Dibaca / Dikatakan:**
> *"Demikian demonstrasi dari aplikasi Sistem Informasi Kos Srirahayu yang saya kembangkan untuk Ujian Tengah Semester mata kuliah Pemrograman Visual.*  
>  
> *Seluruh source code telah saya upload ke repositori GitHub saya, dan aplikasi juga telah di-deploy ke Vercel agar dapat diakses secara langsung melalui link yang tercantum di dokumen laporan.*  
>  
> *Terima kasih banyak atas perhatian dan bimbingan Bapak Muhammad Akbar Firdaus, S.Kom. Mohon maaf apabila masih terdapat kekurangan. Wassalamu’alaikum Warahmatullahi Wabarakatuh."*

