import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  Pengadilan,
  JenisBiaya,
  RadiusPanggilan,
  Perkara,
  PerkaraPihak,
  Dokumen,
  Sidang,
  BiayaDetail,
  RiwayatUser,
  Pengumuman,
  ViewName,
  JenisPerkara,
  PihakRole,
  DokumenJenis,
  SidangAgenda,
} from "./types";
import {
  INITIAL_PENGADILAN,
  INITIAL_USERS,
  INITIAL_JENIS_BIAYA,
  INITIAL_RADIUS,
  INITIAL_PENGUMUMAN,
  INITIAL_PERKARA,
  INITIAL_PIHAK,
  INITIAL_DOKUMEN,
  INITIAL_SIDANG,
  INITIAL_BIAYA_DETAIL,
  INITIAL_RIWAYAT,
} from "./mock-data";

interface AppState {
  // Auth
  currentUser: User | null;
  // View routing
  currentView: ViewName;
  selectedPerkaraId: string | null;
  // Master data
  users: User[];
  pengadilan: Pengadilan[];
  jenisBiaya: JenisBiaya[];
  radiusPanggilan: RadiusPanggilan[];
  pengumuman: Pengumuman[];
  // Transactional data
  perkara: Perkara[];
  pihak: PerkaraPihak[];
  dokumen: Dokumen[];
  sidang: Sidang[];
  biayaDetail: BiayaDetail[];
  riwayat: RiwayatUser[];
  // Toast notifications (non-persistent)
  toasts: { id: string; type: "success" | "error" | "info"; message: string }[];

  // Actions: Auth
  login: (username: string, password: string) => boolean;
  logout: () => void;
  registerAdvokat: (data: Partial<User> & { username: string; email: string; password: string; nama: string }) => boolean;

  // Actions: Navigation
  setView: (view: ViewName) => void;
  selectPerkara: (perkaraId: string | null) => void;

  // Actions: Perkara (e-Filing)
  createPerkara: (data: {
    jenisPerkara: JenisPerkara;
    pengadilanId: string;
    gugatanRingkas: string;
    klasifikasiPerkara?: string;
    persetujuanPrinsipal: boolean;
    pihak: Array<Omit<PerkaraPihak, "id" | "perkaraId" | "persetujuanElektronik">>;
    dokumens: Array<Omit<Dokumen, "id" | "perkaraId" | "status" | "uploaderId" | "uploaderNama" | "createdAt">>;
  }) => string;

  payPerkara: (perkaraId: string) => void;
  verifyPerkara: (perkaraId: string, nomorPerkara: string) => void;

  // Actions: Dokumen
  uploadDokumenPersidangan: (perkaraId: string, jenis: DokumenJenis, nama: string, fileName: string, fileType: string) => void;
  verifyDokumen: (dokumenId: string) => void;
  uploadSalinanPutusan: (perkaraId: string, fileName: string) => void;

  // Actions: Sidang
  addSidang: (perkaraId: string, agenda: SidangAgenda, tanggal: string, keterangan?: string) => void;

  // Actions: Admin
  verifyAdvokat: (userId: string) => void;
  addAdvokat: (data: { nama: string; noBaSumpah: string; tglSumpah: string; pengadilanId: string }) => void;
  addPenggunaNonAdvokat: (data: { nama: string; email: string; telepon: string; jenis: "PERSEORANGAN" | "PEMERINTAHAN" | "BADAN_HUKUM"; alamat: string; ktp: string; pengadilanId: string }) => string;
  verifyPenggunaNonAdvokat: (userId: string) => void;
  updateUserStatus: (userId: string, status: "AKTIF" | "BLOK" | "PINDAH") => void;

  // Actions: Pengadilan Config
  updatePengadilanConfig: (pengadilanId: string, config: Partial<Pengadilan>) => void;
  addJenisBiaya: (data: Omit<JenisBiaya, "id">) => void;
  toggleJenisBiaya: (id: string) => void;
  deleteJenisBiaya: (id: string) => void;

  // Actions: Profile
  updateProfile: (data: Partial<User>) => void;

  // Actions: Toast
  addToast: (type: "success" | "error" | "info", message: string) => void;
  removeToast: (id: string) => void;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function generateNomorRegister(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 900000) + 100000);
  return `REG-${year}-${seq}`;
}

function generateBarcode(): string {
  return String(Math.floor(Math.random() * 9000000000000) + 1000000000000);
}

function generateVirtualAccount(): string {
  const part1 = String(Math.floor(Math.random() * 9000) + 1000);
  const part2 = String(Math.floor(Math.random() * 9000) + 1000);
  const part3 = String(Math.floor(Math.random() * 9000) + 1000);
  const part4 = String(Math.floor(Math.random() * 900) + 100);
  return `${part1}-${part2}-${part3}-${part4}`;
}

function generateNomorPerkara(jenisPerkara: JenisPerkara, pengadilan: Pengadilan): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 900) + 100);
  const kodeMap: Record<JenisPerkara, string> = {
    GUGATAN: "Pdt.G",
    BANTAHAN: "Pdt.B",
    GUGATAN_SEDERHANA: "Pdt.GS",
    PERMOHONAN: "Pdt.P",
  };
  const kodePengadilanMap: Record<string, string> = {
    "pgd-001": "PN.Jkt.Pst",
    "pgd-002": "PN.Mjk",
    "pgd-003": "PT.Smg",
    "pgd-004": "PA.Jkt.Pst",
  };
  return `${seq}/${kodeMap[jenisPerkara]}/${year}/${kodePengadilanMap[pengadilan.id] ?? "PN.X"}`;
}

function calculatePanjar(
  pengadilanId: string,
  jenisPerkara: JenisPerkara,
  pihak: Array<{ role: PihakRole; provinsi?: string; kabupaten?: string; kecamatan?: string }>,
  jenisBiayaList: JenisBiaya[],
  radiusList: RadiusPanggilan[]
): { total: number; details: Array<{ namaBiaya: string; nominal: number; kodePerkalian: number; subtotal: number }> } {
  const applicableBiaya = jenisBiayaList.filter(
    (b) => b.pengadilanId === pengadilanId && b.jenisPerkara === jenisPerkara && b.aktif
  ).sort((a, b) => a.urutan - b.urutan);

  const penggugat = pihak.find((p) => p.role === "PENGUGAT");
  const tergugat = pihak.find((p) => p.role === "TERGUGAT");

  function findRadius(p?: { provinsi?: string; kabupaten?: string; kecamatan?: string }): number {
    if (!p?.kecamatan) return 5000;
    const r = radiusList.find(
      (r) =>
        r.pengadilanId === pengadilanId &&
        r.kecamatan?.toLowerCase() === p.kecamatan?.toLowerCase()
    );
    if (r) return r.radius * r.biayaPerKm;
    return 5000;
  }

  const penggugatRadius = findRadius(penggugat);
  const tergugatRadius = findRadius(tergugat);
  const jumlahTergugat = pihak.filter((p) => p.role === "TERGUGAT" || p.role === "TURUT_TERGUGAT").length;

  let total = 0;
  const details: Array<{ namaBiaya: string; nominal: number; kodePerkalian: number; subtotal: number }> = [];

  for (const b of applicableBiaya) {
    let subtotal = b.nominal;
    if (b.kodePerkalian === 2) {
      subtotal = b.nominal === 0 ? penggugatRadius : penggugatRadius * 1;
    } else if (b.kodePerkalian === 3) {
      subtotal = b.nominal === 0 ? tergugatRadius * jumlahTergugat : b.nominal * jumlahTergugat;
    } else if (b.kodePerkalian === 100) {
      subtotal = b.nominal * Math.max(jumlahTergugat, 1);
    } else {
      subtotal = b.nominal;
    }
    total += subtotal;
    details.push({
      namaBiaya: b.namaBiaya,
      nominal: b.nominal,
      kodePerkalian: b.kodePerkalian,
      subtotal,
    });
  }

  return { total, details };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      currentView: "landing",
      selectedPerkaraId: null,
      users: INITIAL_USERS,
      pengadilan: INITIAL_PENGADILAN,
      jenisBiaya: INITIAL_JENIS_BIAYA,
      radiusPanggilan: INITIAL_RADIUS,
      pengumuman: INITIAL_PENGUMUMAN,
      perkara: INITIAL_PERKARA,
      pihak: INITIAL_PIHAK,
      dokumen: INITIAL_DOKUMEN,
      sidang: INITIAL_SIDANG,
      biayaDetail: INITIAL_BIAYA_DETAIL,
      riwayat: INITIAL_RIWAYAT,
      toasts: [],

      login: (username, password) => {
        const user = get().users.find(
          (u) =>
            (u.username === username || u.email === username) &&
            u.password === password
        );
        if (user) {
          if (user.status === "BELUM_VERIFIKASI" && user.role === "ADVOKAT") {
            // Allow login but they can only see dashboard, not register perkara
          }
          set({
            currentUser: user,
            currentView: "dashboard",
          });
          // Add to riwayat
          const newRiwayat: RiwayatUser = {
            id: generateId("rw"),
            userId: user.id,
            aksi: "LOGIN",
            detail: "Login ke aplikasi e-Court",
            ip: "192.168.1.100",
            waktu: new Date().toISOString(),
          };
          set((state) => ({ riwayat: [newRiwayat, ...state.riwayat] }));
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null, currentView: "landing", selectedPerkaraId: null });
      },

      registerAdvokat: (data) => {
        const existing = get().users.find((u) => u.email === data.email || u.username === data.username);
        if (existing) return false;
        const newUser: User = {
          id: generateId("usr"),
          username: data.username,
          email: data.email,
          password: data.password,
          role: "ADVOKAT",
          status: "BELUM_VERIFIKASI",
          nama: data.nama,
          telepon: data.telepon,
          noBaSumpah: data.noBaSumpah,
          tglSumpah: data.tglSumpah,
          noKta: data.noKta,
          pengadilanId: data.pengadilanId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
        return true;
      },

      setView: (view) => {
        set({ currentView: view });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      selectPerkara: (perkaraId) => {
        set({ selectedPerkaraId: perkaraId, currentView: "detil-perkara" });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      createPerkara: (data) => {
        const user = get().currentUser;
        if (!user) return "";
        const pengadilan = get().pengadilan.find((p) => p.id === data.pengadilanId);
        if (!pengadilan) return "";

        const newPerkaraId = generateId("prk");
        const nomorRegister = generateNomorRegister();
        const barcode = generateBarcode();

        // Calculate panjar
        const { total, details } = calculatePanjar(
          data.pengadilanId,
          data.jenisPerkara,
          data.pihak,
          get().jenisBiaya,
          get().radiusPanggilan
        );

        const newPerkara: Perkara = {
          id: newPerkaraId,
          nomorRegisterOnline: nomorRegister,
          barcode,
          jenisPerkara: data.jenisPerkara,
          pendaftarId: user.id,
          pendaftarNama: user.nama,
          pengadilanId: pengadilan.id,
          pengadilanNama: pengadilan.nama,
          status: "MENUNGGU_PEMBAYARAN",
          klasifikasiPerkara: data.klasifikasiPerkara,
          gugatanRingkas: data.gugatanRingkas,
          persetujuanPrinsipal: data.persetujuanPrinsipal,
          totalPanjar: total,
          virtualAccount: generateVirtualAccount(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newPihak: PerkaraPihak[] = data.pihak.map((p) => ({
          ...p,
          id: generateId("ph"),
          perkaraId: newPerkaraId,
          persetujuanElektronik: true,
        }));

        const newDokumen: Dokumen[] = data.dokumens.map((d) => ({
          ...d,
          id: generateId("dok"),
          perkaraId: newPerkaraId,
          status: "TERKUNCI",
          uploaderId: user.id,
          uploaderNama: user.nama,
          createdAt: new Date().toISOString(),
        }));

        const newBiayaDetail: BiayaDetail[] = details.map((d, idx) => ({
          id: generateId("bd"),
          perkaraId: newPerkaraId,
          urutan: idx + 1,
          namaBiaya: d.namaBiaya,
          nominal: d.nominal,
          kodePerkalian: d.kodePerkalian,
          subtotal: d.subtotal,
        }));

        const newRiwayat: RiwayatUser = {
          id: generateId("rw"),
          userId: user.id,
          aksi: "DAFTAR_PERKARA",
          detail: `Mendaftarkan perkara baru ${nomorRegister}`,
          ip: "192.168.1.100",
          waktu: new Date().toISOString(),
        };

        set((state) => ({
          perkara: [newPerkara, ...state.perkara],
          pihak: [...state.pihak, ...newPihak],
          dokumen: [...state.dokumen, ...newDokumen],
          biayaDetail: [...state.biayaDetail, ...newBiayaDetail],
          riwayat: [newRiwayat, ...state.riwayat],
        }));

        return newPerkaraId;
      },

      payPerkara: (perkaraId) => {
        set((state) => ({
          perkara: state.perkara.map((p) =>
            p.id === perkaraId
              ? { ...p, status: "DIBAYAR", tglPembayaran: new Date().toISOString(), updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      verifyPerkara: (perkaraId, nomorPerkara) => {
        set((state) => ({
          perkara: state.perkara.map((p) =>
            p.id === perkaraId
              ? {
                  ...p,
                  status: "TERDAFTAR",
                  nomorPerkara,
                  tglSidangPertama: new Date(Date.now() + 7 * 86400000).toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      uploadDokumenPersidangan: (perkaraId, jenis, nama, fileName, fileType) => {
        const user = get().currentUser;
        if (!user) return;
        const newDok: Dokumen = {
          id: generateId("dok"),
          perkaraId,
          jenis,
          nama,
          fileName,
          fileType,
          fileUrl: `/uploads/${fileName}`,
          fileSize: Math.floor(Math.random() * 500000) + 100000,
          uploaderId: user.id,
          uploaderNama: user.nama,
          status: "TERKUNCI",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ dokumen: [...state.dokumen, newDok] }));
      },

      verifyDokumen: (dokumenId) => {
        const user = get().currentUser;
        if (!user) return;
        set((state) => ({
          dokumen: state.dokumen.map((d) =>
            d.id === dokumenId
              ? { ...d, status: "TERBUKA", verifiedBy: user.id, verifiedAt: new Date().toISOString() }
              : d
          ),
        }));
      },

      uploadSalinanPutusan: (perkaraId, fileName) => {
        set((state) => ({
          perkara: state.perkara.map((p) =>
            p.id === perkaraId
              ? {
                  ...p,
                  status: "PUTUS",
                  tglPutusan: new Date().toISOString(),
                  salinanPutusanUrl: `/uploads/${fileName}`,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
        // Also add as a dokumen
        const user = get().currentUser;
        if (user) {
          const newDok: Dokumen = {
            id: generateId("dok"),
            perkaraId,
            jenis: "SALINAN_PUTUSAN",
            nama: "Salinan Putusan",
            fileName,
            fileType: "pdf",
            fileUrl: `/uploads/${fileName}`,
            fileSize: Math.floor(Math.random() * 800000) + 200000,
            uploaderId: user.id,
            uploaderNama: user.nama,
            status: "TERBUKA",
            verifiedBy: user.id,
            verifiedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };
          set((state) => ({ dokumen: [...state.dokumen, newDok] }));
        }
      },

      addSidang: (perkaraId, agenda, tanggal, keterangan) => {
        const existing = get().sidang.filter((s) => s.perkaraId === perkaraId);
        const newSidang: Sidang = {
          id: generateId("sdg"),
          perkaraId,
          urutan: existing.length + 1,
          tanggal,
          agenda,
          status: "DIJADWALKAN",
          keterangan,
        };
        set((state) => ({ sidang: [...state.sidang, newSidang] }));
      },

      verifyAdvokat: (userId) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: "TERVERIFIKASI", updatedAt: new Date().toISOString() } : u
          ),
        }));
        const user = get().users.find((u) => u.id === userId);
        if (user) {
          const admin = get().currentUser;
          const newRiwayat: RiwayatUser = {
            id: generateId("rw"),
            userId: admin?.id ?? "",
            aksi: "VERIFIKASI_ADVOKAT",
            detail: `Memverifikasi advokat ${user.nama}`,
            ip: "192.168.1.50",
            waktu: new Date().toISOString(),
          };
          set((state) => ({ riwayat: [newRiwayat, ...state.riwayat] }));
        }
      },

      addAdvokat: (data) => {
        const newUser: User = {
          id: generateId("usr"),
          username: `advokat.${Date.now()}`,
          email: `advokat.${Date.now()}@placeholder.com`,
          password: "advokat123",
          role: "ADVOKAT",
          status: "TERVERIFIKASI",
          nama: data.nama,
          noBaSumpah: data.noBaSumpah,
          tglSumpah: data.tglSumpah,
          pengadilanId: data.pengadilanId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },

      addPenggunaNonAdvokat: (data) => {
        const username = `insidentil.${Date.now()}`;
        const password = Math.random().toString(36).slice(2, 10);
        const newUser: User = {
          id: generateId("usr"),
          username,
          email: data.email,
          password,
          role: "INSIDENTIL",
          status: "TERVERIFIKASI",
          nama: data.nama,
          telepon: data.telepon,
          jenisInsidentil: data.jenis,
          pengadilanId: data.pengadilanId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
        return password;
      },

      verifyPenggunaNonAdvokat: (userId) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: "TERVERIFIKASI", updatedAt: new Date().toISOString() } : u
          ),
        }));
      },

      updateUserStatus: (userId, status) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, status } : u)),
        }));
      },

      updatePengadilanConfig: (pengadilanId, config) => {
        set((state) => ({
          pengadilan: state.pengadilan.map((p) =>
            p.id === pengadilanId ? { ...p, ...config } : p
          ),
        }));
      },

      addJenisBiaya: (data) => {
        const newBiaya: JenisBiaya = {
          ...data,
          id: generateId("jb"),
        };
        set((state) => ({ jenisBiaya: [...state.jenisBiaya, newBiaya] }));
      },

      toggleJenisBiaya: (id) => {
        set((state) => ({
          jenisBiaya: state.jenisBiaya.map((b) =>
            b.id === id ? { ...b, aktif: !b.aktif } : b
          ),
        }));
      },

      deleteJenisBiaya: (id) => {
        set((state) => ({
          jenisBiaya: state.jenisBiaya.filter((b) => b.id !== id),
        }));
      },

      updateProfile: (data) => {
        const user = get().currentUser;
        if (!user) return;
        const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
        set((state) => ({
          currentUser: updated,
          users: state.users.map((u) => (u.id === user.id ? updated : u)),
        }));
      },

      addToast: (type, message) => {
        const id = generateId("toast");
        set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
        // Auto-remove after 4s
        if (typeof window !== "undefined") {
          setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
          }, 4000);
        }
      },

      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },
    }),
    {
      name: "ecourt-storage-v1",
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentView: state.currentView,
        selectedPerkaraId: state.selectedPerkaraId,
        users: state.users,
        pengadilan: state.pengadilan,
        jenisBiaya: state.jenisBiaya,
        radiusPanggilan: state.radiusPanggilan,
        pengumuman: state.pengumuman,
        perkara: state.perkara,
        pihak: state.pihak,
        dokumen: state.dokumen,
        sidang: state.sidang,
        biayaDetail: state.biayaDetail,
        riwayat: state.riwayat,
      }),
    }
  )
);
