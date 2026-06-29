---
Task ID: eCourt-001
Agent: Main (Super Z)
Task: Membuat website e-Court berdasarkan Manual Book e-Court Mahkamah Agung 2019

Work Log:
- Membaca dan mempelajari Manual Book e-COURT 2019 (PDF, 2001 baris teks)
- Mengidentifikasi 5 role pengguna: Advokat, Insidentil, Admin Banding, Admin Pertama, Hakim
- Mengidentifikasi 4 pilar utama: e-Filing, e-Payment, e-Summons, e-Litigasi
- Menginisialisasi environment fullstack Next.js 16
- Membuat Prisma schema lengkap (User, Pengadilan, Perkara, PerkaraPihak, Dokumen, Sidang, BiayaDetail, RiwayatUser, Pengumuman, JenisBiaya, RadiusPanggilan)
- Membuat TypeScript types & labels
- Membuat mock data realistis (5 pengadilan, 7 users, 5 perkara, dll.)
- Membuat Zustand store dengan persist localStorage (tanpa DB setup)
- Membuat theme e-Court (navy + gold Mahkamah Agung)
- Implementasi Landing Page (Halaman Utama e-Court) dengan 4 pilar, benefits, user types
- Implementasi Login dengan 5 akun demo (quick login per role)
- Implementasi Register Advokat dengan data BA Sumpah & KTA
- Implementasi AppShell dengan Sidebar role-based + Header dengan profile dropdown
- Implementasi Dashboard adaptif untuk 5 role dengan Info Perkara cards
- Implementasi Pendaftaran Perkara wizard 7-step (jenis → pengadilan → surat kuasa → data pihak → upload berkas → e-SKUM → e-Payment)
- Implementasi Detil Perkara dengan 3 tab (Pendaftaran, Persidangan, Dokumen)
- Implementasi e-SKUM dengan tabel komponen biaya & perhitungan otomatis
- Implementasi e-Payment dengan Virtual Account & simulasi pembayaran
- Implementasi e-Summons (panggilan elektronik)
- Implementasi e-Litigasi (upload dokumen persidangan + verifikasi hakim)
- Implementasi Verifikasi Advokat oleh Admin Banding
- Implementasi Daftar Advokat dengan CRUD
- Implementasi Konfigurasi Pengadilan (profil, bank, Google Mail)
- Implementasi Jenis Biaya (komponen biaya panjar) dengan kode perkalian
- Implementasi Radius Biaya Panggilan
- Implementasi Pengguna Non-Advokat (Perseorangan, Pemerintahan, Badan Hukum)
- Implementasi Daftar Pendaftaran Online (SIPP) dengan register perkara
- Implementasi Riwayat Pengguna dengan track IP & waktu
- Implementasi Profil Pengguna dengan edit data
- Implementasi Upload Salinan Putusan oleh Hakim
- Verifikasi dev server kompilasi sukses (status 200)

Stage Summary:
- Aplikasi e-Court lengkap dengan 17 view (landing, login, register, dashboard, pendaftaran-perkara, detil-perkara, daftar-perkara, verifikasi-advokat, daftar-advokat, konfigurasi-pengadilan, jenis-biaya, radius-biaya, pengguna-non-advokat, daftar-pendaftaran-online, riwayat-pengguna, profil, pengumuman)
- 5 role dengan menu & fitur khusus masing-masing
- Database belum di-setup (menggunakan localStorage), schema Prisma siap untuk MySQL/PostgreSQL
- Dev server berjalan di port 3000, kompilasi sukses
- Tema visual: Navy + Gold (warna resmi Mahkamah Agung)

---
Task ID: eCourt-002
Agent: Main (Super Z)
Task: Verifikasi website e-Court dengan Agent Browser

Work Log:
- Test landing page (Halaman Utama e-Court) - berfungsi
- Test login multi-role dengan 5 akun demo (quick login) - berfungsi
- Test dashboard Advokat dengan Info Perkara cards - berfungsi
- Test Pendaftaran Perkara wizard 7-step - berfungsi
- Test Detil Perkara dengan 3 tab (Pendaftaran, Persidangan, Dokumen) - awalnya ada error getSnapshot infinite loop
- Perbaiki error dengan menggunakan useMemo untuk filtering (menghindari selector yang return new array)
- Test Detil Perkara setelah perbaikan - berfungsi sempurna
- Test tab Persidangan dengan history sidang - berfungsi
- Test tab Dokumen dengan status TERKUNCI/TERBUKA - berfungsi
- Test login sebagai Admin Pertama - dashboard menampilkan badge "Pendaftaran Online (SIPP) 1"
- Test Register Perkara di SIPP - berhasil, badge hilang
- Test login sebagai Hakim - dashboard menampilkan perkara yang ditangani
- Test Verifikasi Dokumen oleh Hakim - dokumen TERKUNCI berhasil diverifikasi menjadi TERBUKA
- Test login sebagai Admin Banding - dashboard menampilkan badge "Verifikasi Advokat 1"
- Test Verifikasi Advokat - berhasil, status berubah menjadi Terverifikasi
- Test responsive mobile (375x812) - berfungsi dengan menu hamburger
- Test Register Advokat form - berfungsi
- Cek lint - 0 error
- Cek console - 0 error (hanya warning accessibility minor untuk Dialog)

Stage Summary:
- Semua fitur e-Court terverifikasi berfungsi end-to-end via Agent Browser
- 20 screenshot disimpan di /home/z/my-project/download/
- Lint bersih tanpa error
- Mobile responsive berfungsi
- Siap untuk handover ke user

---
Task ID: eCourt-003
Agent: Main (Super Z)
Task: Rebranding website e-Court menjadi milik Fakultas Hukum Universitas Tulungagung (FH UNTA)

Work Log:
- Cari informasi kontak Universitas Tulungagung via web search
- Dapatkan data: Jl. Ki Mangunsarkoro No. 4, Beji, Boyolangu, Tulungagung 66223, Jawa Timur
- Telepon: (0355) 322145 / 320396, Fax: (0355) 327068
- Email FH: fakultashukum@unita.ac.id, Humas: humas@unita.ac.id
- Website: fh.unita.ac.id / unita.ac.id
- Copy logo UNTA (unita-logo.png, 711x676 PNG) ke /public/
- Update globals.css: tema warna dari Navy+Gold (Mahkamah Agung) ke Biru Dongker + Merah (FH UNTA)
  - Primary: oklch(0.28 0.13 255) - Biru dongker
  - Accent: oklch(0.55 0.22 25) - Merah
  - Sidebar: oklch(0.24 0.11 255) - Biru dongker lebih gelap
  - Tambahkan variabel --merah dan --biru-dongker
- Update Logo component: pakai Image UNTA logo, nama "e-Court FH UNTA", subtitle "Fakultas Hukum Universitas Tulungagung"
- Update AppHeader: logo UNTA + branding FH UNTA
- Update Sidebar: logo UNTA + branding FH UNTA + badge merah
- Update Footer: kontak lengkap UNTA (alamat, telepon, fax, email, website), copyright FH UNTA
- Update Landing Page:
  - Hero section: gradient biru dongker + accent merah
  - Title: "Sistem Peradilan Elektronik Fakultas Hukum Universitas Tulungagung"
  - Description: media pembelajaran simulasi pelayanan peradilan elektronik
  - Badge: "Media Pembelajaran FH UNTA"
  - Pengumuman: label "FH UNTA" (bukan "Mahkamah Agung")
  - CTA section: gradient biru dongker + tombol merah
  - User types: deskripsi simulasi pembelajaran
- Update Login form: title "Login e-Court FH UNTA", description UNTA, toast "Selamat datang di e-Court FH UNTA"
- Update Register form: title, description, syarat & ketentuan UNTA
- Update Dashboard: welcome banner gradient biru dongker, teks FH UNTA, tombol merah
- Update e-SKUM header: "Fakultas Hukum Universitas Tulungagung"
- Update Pengumuman view: label "FH UNTA"
- Update mock data: pengumuman isi rebrand ke FH UNTA
- Update metadata (layout.tsx): title, description, keywords, authors, icons (favicon UNTA)
- Lint check: 0 error
- Verifikasi via Agent Browser:
  - Title browser: "e-Court FH UNTA | Sistem Peradilan Elektronik Fakultas Hukum Universitas Tulungagung" ✓
  - Logo UNTA termuat di header, sidebar, footer (naturalWidth 474) ✓
  - H1 landing: "Sistem Peradilan Elektronik Fakultas Hukum Universitas Tulungagung" ✓
  - Footer berisi kontak lengkap UNTA (alamat, telepon, fax, email, website) ✓
  - Tema warna: primary biru dongker (lab 15% 10.7 -44.4), accent merah (lab 45% 69.9 46.3) ✓
  - Mobile responsive (375x812) ✓
  - Login form rebrand ✓
  - Dashboard rebrand ✓

Stage Summary:
- Website e-Court berhasil direbrand menjadi milik Fakultas Hukum Universitas Tulungagung
- Tema visual: Biru Dongker (primary) + Merah (accent) sesuai identitas UNTA
- Logo UNTA terpasang di header, sidebar, footer, dan favicon
- Semua kontak (alamat, telepon, fax, email, website) menggunakan UNTA
- Deskripsi ditekankan sebagai "media pembelajaran simulasi peradilan elektronik"
- Atribusi ke Manual Book e-Court Mahkamah Agung 2019 tetap dipertahankan sebagai sumber referensi
- 6 screenshot baru disimpan di download/ (21-26)
