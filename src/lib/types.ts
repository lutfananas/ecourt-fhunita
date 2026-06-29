// e-Court Type Definitions

export type Role =
  | "ADVOKAT"
  | "INSIDENTIL"
  | "ADMIN_BANDING"
  | "ADMIN_PERTAMA"
  | "HAKIM"
  | "SUPER_ADMIN";

export type UserStatus =
  | "AKTIF"
  | "BLOK"
  | "PINDAH"
  | "BELUM_VERIFIKASI"
  | "TERVERIFIKASI"
  | "KADALUWARSA";

export type JenisInsidentil = "PERSEORANGAN" | "PEMERINTAHAN" | "BADAN_HUKUM";

export type JenisPerkara =
  | "GUGATAN"
  | "BANTAHAN"
  | "GUGATAN_SEDERHANA"
  | "PERMOHONAN";

export type PerkaraStatus =
  | "DRAFT"
  | "MENUNGGU_PEMBAYARAN"
  | "DIBAYAR"
  | "TERVERIFIKASI"
  | "TERDAFTAR"
  | "DALAM_SIDANG"
  | "PUTUS";

export type PihakRole =
  | "PENGUGAT"
  | "TERGUGAT"
  | "TURUT_TERGUGAT"
  | "PIHAK_INTERVENSI";

export type DokumenJenis =
  | "SURAT_KUASA"
  | "GUGATAN"
  | "PERSETUJUAN_PRINSIPAL"
  | "KTP"
  | "BA_SUMPAH"
  | "KTA"
  | "JAWABAN"
  | "REPLIK"
  | "DUPLIK"
  | "KESIMPULAN"
  | "SALINAN_PUTUSAN"
  | "BUKTI"
  | "LAINNYA";

export type DokumenStatus = "TERKUNCI" | "TERBUKA";

export type SidangAgenda =
  | "JAWABAN"
  | "REPLIK"
  | "DUPLIK"
  | "KESIMPULAN"
  | "PUTUSAN"
  | "PENETAPAN";

export type SidangStatus = "DIJADWALKAN" | "SELESAI" | "DITUNDA";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  nama: string;
  fotoProfil?: string;
  telepon?: string;
  noBaSumpah?: string;
  tglSumpah?: string;
  noKta?: string;
  jenisInsidentil?: JenisInsidentil;
  nip?: string;
  jabatan?: string;
  pengadilanId?: string;
  nipHakim?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pengadilan {
  id: string;
  kode: string;
  nama: string;
  tingkat: "PERTAMA" | "BANDING";
  jenis: "UMUM" | "AGAMA" | "TUN";
  alamat?: string;
  kota?: string;
  provinsi?: string;
  email?: string;
  telepon?: string;
  bankNama?: string;
  bankNoRek?: string;
  bankAtasNama?: string;
  googleMail?: string;
  aktif: boolean;
}

export interface JenisBiaya {
  id: string;
  pengadilanId: string;
  jenisPerkara: JenisPerkara;
  urutan: number;
  namaBiaya: string;
  nominal: number;
  kodePerkalian: number;
  aktif: boolean;
}

export interface RadiusPanggilan {
  id: string;
  pengadilanId: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  radius: number;
  biayaPerKm: number;
}

export interface Perkara {
  id: string;
  nomorRegisterOnline: string;
  nomorPerkara?: string;
  barcode: string;
  jenisPerkara: JenisPerkara;
  pendaftarId: string;
  pendaftarNama: string;
  pengadilanId: string;
  pengadilanNama: string;
  status: PerkaraStatus;
  klasifikasiPerkara?: string;
  gugatanRingkas?: string;
  persetujuanPrinsipal: boolean;
  totalPanjar: number;
  virtualAccount?: string;
  tglPembayaran?: string;
  tglPanggilan?: string;
  tglSidangPertama?: string;
  tglPutusan?: string;
  salinanPutusanUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerkaraPihak {
  id: string;
  perkaraId: string;
  role: PihakRole;
  nama: string;
  ktp?: string;
  alamat?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  email?: string;
  telepon?: string;
  jenis?: JenisInsidentil;
  advokatId?: string;
  advokatNama?: string;
  persetujuanElektronik: boolean;
}

export interface Dokumen {
  id: string;
  perkaraId: string;
  jenis: DokumenJenis;
  nama: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  uploaderId: string;
  uploaderNama: string;
  status: DokumenStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface Sidang {
  id: string;
  perkaraId: string;
  urutan: number;
  tanggal: string;
  agenda: SidangAgenda;
  status: SidangStatus;
  keterangan?: string;
}

export interface BiayaDetail {
  id: string;
  perkaraId: string;
  urutan: number;
  namaBiaya: string;
  nominal: number;
  kodePerkalian: number;
  subtotal: number;
}

export interface RiwayatUser {
  id: string;
  userId: string;
  aksi: string;
  detail?: string;
  ip?: string;
  waktu: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  dari: string;
  status: string;
  createdAt: string;
}

// View routing types
export type ViewName =
  | "landing"
  | "login"
  | "register"
  | "dashboard"
  | "pendaftaran-perkara"
  | "detil-perkara"
  | "daftar-perkara"
  | "verifikasi-advokat"
  | "daftar-advokat"
  | "konfigurasi-pengadilan"
  | "jenis-biaya"
  | "radius-biaya"
  | "pengguna-non-advokat"
  | "daftar-pendaftaran-online"
  | "riwayat-pengguna"
  | "profil"
  | "pengumuman";

export const JENIS_PERKARA_LABEL: Record<JenisPerkara, string> = {
  GUGATAN: "Gugatan",
  BANTAHAN: "Bantahan",
  GUGATAN_SEDERHANA: "Gugatan Sederhana",
  PERMOHONAN: "Permohonan",
};

export const PERKARA_STATUS_LABEL: Record<PerkaraStatus, string> = {
  DRAFT: "Draft",
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  DIBAYAR: "Sudah Dibayar",
  TERVERIFIKASI: "Terverifikasi",
  TERDAFTAR: "Terdaftar (Punya Nomor Perkara)",
  DALAM_SIDANG: "Dalam Persidangan",
  PUTUS: "Putus",
};

export const PERKARA_STATUS_COLOR: Record<PerkaraStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  MENUNGGU_PEMBAYARAN: "bg-amber-100 text-amber-800 border-amber-200",
  DIBAYAR: "bg-blue-100 text-blue-800 border-blue-200",
  TERVERIFIKASI: "bg-cyan-100 text-cyan-800 border-cyan-200",
  TERDAFTAR: "bg-emerald-100 text-emerald-800 border-emerald-200",
  DALAM_SIDANG: "bg-purple-100 text-purple-800 border-purple-200",
  PUTUS: "bg-slate-200 text-slate-800 border-slate-300",
};

export const ROLE_LABEL: Record<Role, string> = {
  ADVOKAT: "Pengguna Terdaftar (Advokat)",
  INSIDENTIL: "Pengguna Insidentil (Non-Advokat)",
  ADMIN_BANDING: "Administrator Pengadilan Tingkat Banding",
  ADMIN_PERTAMA: "Administrator Pengadilan Tingkat Pertama",
  HAKIM: "Hakim",
  SUPER_ADMIN: "Super Administrator",
};

export const DOKUMEN_JENIS_LABEL: Record<DokumenJenis, string> = {
  SURAT_KUASA: "Surat Kuasa",
  GUGATAN: "Berkas Gugatan",
  PERSETUJUAN_PRINSIPAL: "Persetujuan Prinsipal",
  KTP: "KTP",
  BA_SUMPAH: "Berita Acara Sumpah",
  KTA: "Kartu Tanda Anggota (KTA)",
  JAWABAN: "Jawaban",
  REPLIK: "Replik",
  DUPLIK: "Duplik",
  KESIMPULAN: "Kesimpulan",
  SALINAN_PUTUSAN: "Salinan Putusan",
  BUKTI: "Bukti",
  LAINNYA: "Dokumen Lainnya",
};
