# e-Court FH UNTA

> **Media Pembelajaran Sistem Peradilan Elektronik**
> Fakultas Hukum Universitas Tulungagung

Implementasi website e-Court berdasarkan **Manual Book e-Court Mahkamah Agung 2019**, dikembangkan sebagai media pembelajaran simulasi pelayanan peradilan elektronik di Fakultas Hukum Universitas Tulungagung (FH UNTA).

## Tentang Project

e-Court FH UNTA adalah aplikasi web simulasi yang mengadaptasi sistem peradilan elektronik Mahkamah Agung RI. Aplikasi ini dirancang untuk membantu mahasiswa Fakultas Hukum memahami alur peradilan elektronik modern secara interaktif.

### 4 Pilar Layanan e-Court

| Pilar | Deskripsi |
|-------|-----------|
| **e-Filing** | Pendaftaran Perkara Online (Gugatan, Bantahan, Gugatan Sederhana, Permohonan) |
| **e-Payment** | Pembayaran Panjar Biaya via Virtual Account (Bank/QRIS/Teller) |
| **e-Summons** | Pemanggilan Elektronik para pihak |
| **e-Litigasi** | Persidangan Elektronik (Replik, Duplik, Kesimpulan, Jawaban) |

### 5 Role Pengguna

1. **Pengguna Terdaftar (Advokat)** — Mendaftarkan perkara untuk klien
2. **Pengguna Insidentil** — Beracara sendiri (Perseorangan/Pemerintahan/Badan Hukum)
3. **Admin Pengadilan Tingkat Banding** — Verifikasi data advokat
4. **Admin Pengadilan Tingkat Pertama** — Register perkara di SIPP
5. **Hakim** — Periksa perkara, verifikasi dokumen, upload salinan putusan

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York)
- **State Management**: Zustand v5 dengan persist (localStorage)
- **Database**: Prisma ORM (SQLite dev, siap MySQL/PostgreSQL produksi)
- **Theme**: Biru Dongker + Merah (identitas FH UNTA)
- **Icons**: Lucide React
- **Fonts**: Inter + Plus Jakarta Sans

## Akun Demo

| Role | Username | Password |
|------|----------|----------|
| Admin Banding | `retno.sari` | `admin123` |
| Admin Pertama | `surjanti` | `admin123` |
| Hakim | `aulia.hakim` | `hakim123` |
| Advokat | `rudi.advokat` | `advokat123` |
| Insidentil | `khoirul.insidentil` | `user123` |

> **Catatan:** Nama-nama user adalah dosen FH UNTA (Dosen Tetap Fakultas Hukum Universitas Tulungagung).

## Cara Menjalankan Lokal

### Prasyarat
- Node.js 18+ atau Bun
- Git

### Langkah

```bash
# Clone repo
git clone https://github.com/lutfananas/ecourt-fhunita.git
cd ecourt-fhunita

# Install dependencies
bun install
# atau: npm install

# Jalankan dev server
bun run dev
# atau: npm run dev
```

Buka http://localhost:3000 di browser.

### Setup Database (Opsional)

Default menggunakan localStorage (data tersimpan di browser). Untuk produksi dengan DB nyata:

1. Edit `prisma/schema.prisma` — ganti `provider = "sqlite"` ke `"mysql"` atau `"postgresql"`
2. Set `DATABASE_URL` di file `.env`:
   ```
   DATABASE_URL="mysql://user:pass@host:3306/ecourt_fhunita"
   ```
3. Push schema ke database:
   ```bash
   bun run db:push
   ```

## Deploy ke Vercel

Project ini siap deploy ke Vercel. File `vercel.json` sudah disediakan.

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login (one-time)
vercel login

# Deploy (preview)
vercel

# Deploy ke production
vercel --prod
```

### Via Vercel Dashboard

1. Buka https://vercel.com/new
2. Import repo `lutfananas/ecourt-fhunita`
3. Vercel akan auto-detect Next.js
4. Klik **Deploy**

Project name yang disarankan: **ecourt-fhunita**

## Struktur Project

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout dengan ThemeProvider
│   ├── page.tsx                  # SPA router (view switcher)
│   └── globals.css               # Tema warna FH UNTA
├── components/
│   ├── layout/                   # Header, Sidebar, Footer
│   ├── views/
│   │   ├── public/               # Landing, Login, Register
│   │   ├── dashboard/            # Dashboard adaptif 5 role
│   │   ├── perkara/              # e-Filing wizard + Detil Perkara
│   │   ├── admin/                # Admin Banding & Pertama features
│   │   └── hakim/                # Hakim features
│   └── shared/                   # Reusable components
├── lib/
│   ├── types.ts                  # TypeScript types
│   ├── mock-data.ts              # Initial seed data (10 dosen FH UNTA)
│   ├── store.ts                  # Zustand store
│   └── db.ts                     # Prisma client
└── prisma/
    └── schema.prisma             # Database schema lengkap
```

## Fitur Utama

### Pendaftaran Perkara (7-Step Wizard)
1. Pilih Jenis Perkara (Gugatan/Bantahan/Gugatan Sederhana/Permohonan)
2. Pilih Pengadilan + Setujui Syarat & Ketentuan
3. Upload Surat Kuasa
4. Isi Data Pihak (Penggugat, Tergugat, Turut Tergugat)
5. Upload Berkas Gugatan + Persetujuan Prinsipal
6. Generate e-SKUM (otomatis hitung biaya berdasarkan radius)
7. e-Payment via Virtual Account (simulasi)

### Detil Perkara (3 Tab)
- **Pendaftaran**: Info perkara, pihak, pembayaran, e-SKUM, e-Summons
- **Persidangan**: History sidang, upload dokumen e-Litigasi, salinan putusan
- **Dokumen**: Status TERKUNCI/TERBUKA, verifikasi oleh Hakim

### Admin Features
- Verifikasi Advokat (oleh Admin Banding)
- Daftar Advokat (CRUD)
- Konfigurasi Pengadilan (Profil, Bank, Google Mail)
- Jenis Biaya (Komponen Biaya Panjar dengan kode perkalian)
- Radius Biaya Panggilan
- Pengguna Non-Advokat (Perseorangan/Pemerintahan/Badan Hukum)
- Daftar Pendaftaran Online (SIPP Register)
- Riwayat Pengguna (audit log)

## Atribusi

Project ini mengadaptasi **Manual Book e-Court Mahkamah Agung 2019** sebagai sumber referensi pembelajaran. e-Court FH UNTA adalah implementasi simulasi untuk tujuan edukasi di lingkungan akademik.

## Kontak

**Fakultas Hukum Universitas Tulungagung**
- Alamat: Jl. Ki Mangunsarkoro No. 4, Beji, Kec. Boyolangu, Kab. Tulungagung, Jawa Timur 66223
- Telepon: (0355) 322145 / 320396
- Fax: (0355) 327068
- Email: fakultashukum@unita.ac.id
- Website: [fh.unita.ac.id](https://fh.unita.ac.id)

## License

MIT License - bebas digunakan untuk tujuan pendidikan.

---

© Fakultas Hukum Universitas Tulungagung. e-Court v3.0.
