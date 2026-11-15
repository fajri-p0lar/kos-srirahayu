# LAPORAN TUGAS PROYEK UJIAN TENGAH SEMESTER (UTS)
## MATA KULIAH: PEMROGRAMAN VISUAL

**STIKOM EL RAHMA**  
**Program Studi / Angkatan:** IT 8  
**Dosen Pengampu:** Muhammad Akbar Firdaus, S.Kom  

---

## 1. IDENTITAS PROYEK

- **Judul Proyek:** Sistem Informasi Manajemen dan Pembayaran Kos Berbasis Website pada Kos Srirahayu (*Front-End Web Application*)
- **Nama Mahasiswa:** Rahmattuloh Fajri Rahmattulloh
- **Nomor Induk Mahasiswa (NIM):** 2511080019
- **Mata Kuliah:** Pemrograman Visual
- **Tingkat / Semester:** Ujian Tengah Semester (UTS) — Angkatan IT 8
- **Tahun Akademik:** 2026 / 2027

---

## 2. LATAR BELAKANG DAN TUJUAN

### 2.1 Latar Belakang Masalah
Pengelolaan operasional rumah kos, khususnya pada Kos Srirahayu, selama ini masih mengandalkan pencatatan manual, buku kas fisik, atau pencatatan spreadsheet sederhana yang rentan terhadap kehilangan data dan inkonsistensi rekonsiliasi. Permasalahan utama yang sering dihadapi pemilik kos meliputi:
1. **Ketidakjelasan Status Hunian Kamar:** Kesulitan dalam memantau secara cepat dan *real-time* kamar mana yang berstatus terisi, kosong (tersedia), atau sedang dalam masa perbaikan/perawatan fisik gedung.
2. **Keterlambatan Pembayaran & Rekonsiliasi Tagihan:** Proses penagihan sewa bulanan masih dilakukan secara manual satu per satu tanpa pengelompokan jatuh tempo yang jelas, sehingga tagihan tertunda sering terlewatkan.
3. **Penyampaian Informasi ke Calon Penyewa:** Calon penghuni kos kesulitan mendapatkan informasi visual mengenai ketersediaan kamar, tipe kamar, fasilitas yang disediakan, serta tarif sewa bulanan secara transparan.

Untuk menjawab permasalahan tersebut, dirancanglah sebuah aplikasi web front-end yang interaktif, visual, dan responsif guna mempermudah pemilik/pengelola kos dalam memonitor operasional harian sekaligus menjadi etalase digital bagi calon penyewa.

### 2.2 Tujuan Pembuatan Aplikasi
1. Membangun antarmuka visual terpadu (*Dashboard*) untuk memonitor tingkat okupansi hunian, metrik keuangan, serta denah lantai kamar secara cepat.
2. Mengembangkan modul manajemen inventaris kamar (*Room Management*) dan katalog tipe kamar yang dilengkapi galeri foto fasilitas dan proteksi integritas data.
3. Mengembangkan sistem administrasi penghuni dan penagihan sewa bulanan (*Tenant & Billing Management*) dengan kalkulasi otomatis dan riwayat pembayaran lunas.
4. Menyediakan fitur simulasi pengingat tagihan dan konfirmasi pembayaran via WhatsApp (*WhatsApp Direct Link wa.me*).
5. Menyediakan halaman publik (*Landing Page*) bertema modern yang memvisualisasikan profil kamar, fasilitas, dan kontak resmi bagi calon penyewa.

---

## 3. DESKRIPSI DAN FITUR APLIKASI

### 3.1 Gambaran Umum Aplikasi
Aplikasi **Sistem Informasi Kos Srirahayu** merupakan aplikasi berbasis web sisi klien (*Front-End Only*) yang dirancang dengan pendekatan visual interaktif. Aplikasi ini memiliki dua sudut pandang penggunaan:
1. **Halaman Publik (Calon Penyewa):** Antarmuka ramah pengguna bergaya katalog properti modern untuk mengecek tipe kamar, harga sewa bulanan, spesifikasi fasilitas, galeri foto, denah kamar, dan nomor kontak pengelola.
2. **Halaman Pengelola / Admin:** Antarmuka pusat kendali (*Admin Dashboard*) untuk mengelola operasional kamar, penghuni, pembuatan kuitansi invoice tagihan bulanan, pencatatan konfirmasi pembayaran, serta monitoring arus kas.

### 3.2 Rincian Fitur Utama yang Telah Diimplementasikan

#### A. Halaman Publik & Landing Page Profil Kos
- **Hero & Profil Kos:** Menampilkan sambutan, profil lokasi Kos Srirahayu, dan tombol aksi langsung (*CTA*) untuk melihat kamar atau menghubungi pengelola via WhatsApp.
- **Katalog Tipe Kamar & Tarif:** Kartu interaktif rincian tipe kamar (Standar Non-AC, Standar AC, dan Deluxe AC Balkon) lengkap dengan spesifikasi ukuran, daftar fasilitas lengkap (WiFi, AC, Kasur, Lemari, Smart TV, dsb.), serta harga bulanan.
- **Visualisasi Denah Kamar Publik:** Menampilkan ketersediaan kamar per lantai (Lantai 1 dan Lantai 2) dengan indikator visual warna hijau (Tersedia) dan merah (Terisi).
- **Fasilitas Umum & Kebijakan Kos:** Informasi transparansi mengenai aturan jam malam, keamanan CCTV, area parkir, dapur bersama, dan kebersihan.

#### B. Dashboard Analitik & Pusat Kontrol Pengelola (Modul 1)
- **Metrik Analitik KPI:** Menampilkan ringkasan kartu statistik utama: Kamar Terisi (dengan persentase okupansi hunian), Jumlah Penghuni Aktif, Total Pemasukan Sewa Terkumpul, Piutang Tagihan Berjalan, dan Estimasi Biaya Operasional.
- **Visualisasi Denah Kamar Interaktif:** Denah interaktif Lantai 1 dan Lantai 2 dengan filter lantai dan status kamar (Terisi, Tersedia, Perawatan).
- **Grafik Tren Arus Kas (Cash Flow Chart):** Visualisasi grafik batang dinamis tren pemasukan vs pengeluaran selama 6 bulan terakhir dengan estimasi laba bersih.
- **Tabel Tagihan Bulanan Cepat:** Menampilkan daftar invoice tagihan dengan live search, filter status (Semua, Menunggu, Terlambat, Lunas), dan modal pratinjau kuitansi pembayaran resmi Kos Srirahayu.

#### C. Modul Manajemen Kamar & Tipe Kamar (Modul 2)
- **Katalog Inventaris Kamar:** Tampilan fleksibel dengan dua mode: *Grid View* (kartu kamar visual bergambar) dan *Table View* (tabel data terstruktur).
- **Penyaringan & Pencarian Kamar:** Live search berdasarkan nomor kamar atau nama penghuni, serta filter lantai dan filter status ketersediaan.
- **CRUD Data Kamar:** Form tambah dan edit nomor kamar, penentuan lantai gedung, tipe kamar, serta status kamar.
- **Proteksi Integritas Data:** Dilengkapi sistem proteksi keamanan di mana kamar yang masih berpenghuni aktif dicegah agar tidak dapat dihapus secara tidak sengaja.
- **Galeri Foto Kamar (Lightbox Interaktif):** Fitur pratinjau foto kamar dalam ukuran besar dengan tombol navigasi slide (*Next/Prev*) dan deretan thumbnail foto.

#### D. Modul Manajemen Penghuni & Tagihan Sewa (Modul 3)
- **Administrasi Data Penghuni:** Form pendaftaran penghuni baru mencakup Nama Lengkap, Nomor WhatsApp, No. KTP/KTM, Kontak Darurat, Tanggal Mulai Sewa, dan Jumlah Penghuni per kamar.
- **Sinkronisasi Otomatis Status Kamar:** Saat penghuni baru ditempatkan di suatu kamar, status kamar otomatis berubah menjadi "Terisi". Ketika penghuni dihapus, kamar otomatis kembali menjadi "Tersedia".
- **Pembuatan Invoice Tagihan Bulanan:** Sistem penagihan otomatis menghitung komponen tarif sewa dasar + biaya tambahan penghuni ekstra (Rp 100.000/orang) dengan nomor invoice unik (misal: `INV-202611-001`).
- **Konfirmasi Pembayaran:** Pencatatan pelunasan tagihan dengan pilihan metode pembayaran (Transfer BCA, Transfer Bank Lain, Tunai, QRIS) yang otomatis mengarsipkan tagihan ke tab Riwayat Pembayaran.
- **Deteksi Otomatis Tagihan Terlambat:** Tagihan yang melewati tanggal jatuh tempo otomatis ditandai dengan badge merah "Terlambat".

#### E. Modul WhatsApp Gateway & Notifikasi Tagihan (Modul 4)
- **Pengingat Tagihan Jatuh Tempo:** Pengelompokan tagihan yang mendekati jatuh tempo dan yang terlambat agar pengelola dapat mengirimkan pesan pengingat secara tepat waktu.
- **Format Template Pesan Otomatis:** Template pesan penagihan dan konfirmasi pembayaran terformat rapi memuat nama penghuni, nomor kamar, nominal tagihan, periode sewa, batas jatuh tempo, dan nomor rekening BCA pemilik kos.
- **Direct Link wa.me:** Tombol "Kirim WhatsApp" membuka aplikasi WhatsApp secara otomatis ke nomor kontak penghuni dengan isi pesan yang telah dipersiapkan, tanpa perlu mengetik ulang.
- **Log Riwayat Pengiriman & Label Simulasi:** Pencatatan aktivitas pengiriman pesan ke dalam riwayat notifikasi lokal dengan label transparan *"Mode Simulasi"* sesuai batasan proyek front-end.

---

## 4. TEKNOLOGI YANG DIGUNAKAN

Aplikasi ini dikembangkan sepenuhnya menggunakan teknologi web modern pada sisi *front end*:

1. **Bahasa Pemrograman:** 
   - **JavaScript (ES6+):** Menggunakan fitur modern seperti *Arrow Functions*, *Destructuring*, *Array Methods* (`map`, `filter`, `reduce`), *Async Handling*, dan *Template Literals*.
   - **HTML5 & CSS3:** Struktur dokumen semantik dan perancangan antarmuka visual modern menggunakan variabel CSS kustom (*CSS Custom Properties*), *Flexbox*, *CSS Grid*, dan estetika *Glassmorphism*.

2. **Framework & Build Tool:**
   - **React (v19):** Pustaka front-end utama berbasis komponen (*Component-Based Architecture*), menggunakan React Hooks (`useState`, `useEffect`, `useMemo`) untuk manajemen *state* dan siklus hidup komponen.
   - **Vite (v8):** *Next-generation frontend tooling* sebagai bundler dan *development server* dengan fitur *Hot Module Replacement (HMR)* super cepat dan hasil build produksi yang teroptimasi.

3. **Pustaka Pendukung (Libraries):**
   - **Lucide React (v1.66):** Kumpulan ikon vektor modern yang ringan dan konsisten untuk memperkuat estetika visual antarmuka pengguna.

4. **Pengelolaan Data (Front-End Only & Data Dummy):**
   - **Sumber Data Dummy Awal (`mockData.js`):** Sesuai ketentuan tugas bahwa materi perkuliahan belum mencakup basis data backend, seluruh data operasional (kamar, tipe kamar, penghuni, tagihan, dan mutasi arus kas) bersumber dari struktur data objek dan array JavaScript lokal pada file `src/data/mockData.js`.
   - **Penyimpanan Lokal Sisi Klien (`localStorage API`):** Untuk menjaga persistensi data saat pengguna melakukan simulasi CRUD (menambah kamar, mengubah status, mendaftarkan penghuni, membayar tagihan, atau mereset data), state aplikasi disinkronkan ke `localStorage` peramban web (*browser*). Dengan demikian, data tidak hilang saat halaman di-refresh, meskipun aplikasi belum terhubung ke database server atau REST API eksternal.

---

## 5. REPOSITORI GITHUB

Source code lengkap dari proyek aplikasi ini telah diunggah dan dikelola melalui version control Git pada platform GitHub:

- **Tautan Repositori GitHub:**  
  [https://github.com/fajri-p0lar/kos-srirahayu](https://github.com/fajri-p0lar/kos-srirahayu)
- **Branch Utama:** `main`
- **Akses Repositori:** Bersifat **Publik** (*Public Repository*), sehingga dapat diakses, dikloning, dan ditinjau oleh dosen pengampu tanpa kendala izin akses.

---

## 6. TAUTAN HOSTING

Aplikasi web React Vite ini telah berhasil di-deploy ke layanan cloud hosting modern (Vercel) sehingga dapat langsung diakses dan diuji secara online melalui peramban:

- **Tautan Website Online (Hosting):**  
  [https://kos-srirahayu.vercel.app](https://kos-srirahayu.vercel.app)  
  *(Catatan: Tautan ini adalah tautan deployment proyek di platform Vercel. Pastikan telah ter-deploy aktif dari repositori GitHub).*

---

## 7. TAUTAN VIDEO DEMO APLIKASI

Untuk mendemonstrasikan cara kerja, fitur-fitur utama, dan implementasi kode front-end aplikasi secara visual, telah disiapkan video demonstrasi rekaman layar:

- **Tautan Video Demo (YouTube / Google Drive):**  
  [https://youtu.be/xxxxxxxxxxx ATAU https://drive.google.com/file/d/xxxxxxxxxxx/view?usp=sharing]  
  *(Catatan: Ganti tautan ini dengan link video rekaman Anda. Pastikan hak akses video disetel ke "Anyone with the link / Siapa saja yang memiliki tautan dapat melihat").*

---

## 8. KESIMPULAN

Proyek Ujian Tengah Semester (UTS) mata kuliah Pemrograman Visual ini berhasil mengimplementasikan rancangan antarmuka pengguna berbasis web untuk sistem pengelolaan Kos Srirahayu. Dengan memanfaatkan ekosistem **React + Vite**, aplikasi menyajikan antarmuka visual yang intuitif, responsif, dan kaya fitur tanpa memerlukan infrastruktur back-end yang rumit. 

Melalui implementasi modul Dashboard KPI, Manajemen Kamar & Tipe Kamar, Administrasi Penghuni & Penagihan Sewa Bulanan, serta Notifikasi WhatsApp Direct Link yang berbasis data dummy dan `localStorage`, seluruh instruksi dan kriteria tugas proyek UTS Pemrograman Visual STIKOM EL RAHMA telah dipenuhi secara menyeluruh.

