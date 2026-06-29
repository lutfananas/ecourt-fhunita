"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { JenisInsidentil } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserPlus,
  Search,
  CheckCircle2,
  User,
  Building2,
  Landmark,
  RotateCcw,
  Key,
  Info,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "sonner";

export function PenggunaNonAdvokat() {
  const users = useAppStore((s) => s.users);
  const addPenggunaNonAdvokat = useAppStore((s) => s.addPenggunaNonAdvokat);
  const verifyPenggunaNonAdvokat = useAppStore((s) => s.verifyPenggunaNonAdvokat);
  const currentUser = useAppStore((s) => s.currentUser);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [jenis, setJenis] = useState<JenisInsidentil>("PERSEORANGAN");
  const [form, setForm] = useState({
    nama: "",
    email: "",
    telepon: "",
    alamat: "",
    ktp: "",
  });
  const [generatedCreds, setGeneratedCreds] = useState<{ username: string; password: string } | null>(null);

  if (!currentUser?.pengadilanId) return null;

  const insidentilList = users.filter(
    (u) => u.role === "INSIDENTIL" && u.pengadilanId === currentUser.pengadilanId
  );
  const filtered = insidentilList.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.nama.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const handleAdd = () => {
    if (!form.nama || !form.email || !form.ktp) {
      toast.error("Lengkapi field wajib");
      return;
    }
    const password = addPenggunaNonAdvokat({
      ...form,
      jenis,
      pengadilanId: currentUser.pengadilanId,
    });
    const username = `insidentil.${Date.now()}`;
    setGeneratedCreds({ username, password });
    toast.success("Pengguna insidentil terdaftar & terverifikasi");
    setForm({ nama: "", email: "", telepon: "", alamat: "", ktp: "" });
    setShowAdd(false);
  };

  const handleActivate = (userId: string) => {
    verifyPenggunaNonAdvokat(userId);
    toast.success("Akun berhasil diaktivasi ulang", {
      description: "Pengguna insidentil dapat login kembali",
    });
  };

  const jenisIcon: Record<JenisInsidentil, React.ElementType> = {
    PERSEORANGAN: User,
    PEMERINTAHAN: Landmark,
    BADAN_HUKUM: Building2,
  };

  const jenisLabel: Record<JenisInsidentil, string> = {
    PERSEORANGAN: "Perseorangan",
    PEMERINTAHAN: "Pemerintahan",
    BADAN_HUKUM: "Badan Hukum",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-heading text-2xl font-bold">Pengguna Non-Advokat (Insidentil)</h2>
          <p className="text-sm text-muted-foreground">
            Pendaftaran pengguna insidentil (Perseorangan, Pemerintahan, Badan
            Hukum) yang beracara sendiri tanpa advokat.
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Catatan Pengguna Insidentil:</strong> Akun hanya berlaku untuk
          beracara elektronik satu kali dan 14 hari setelah tanggal putusan.
          Setelah itu, user tidak bisa mengakses data perkaranya. Untuk
          menggunakan kembali harus dilakukan aktivasi ulang oleh Pengadilan.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="terverifikasi">
        <TabsList>
          <TabsTrigger value="terverifikasi">
            Terverifikasi
          </TabsTrigger>
          <TabsTrigger value="aktivasi">
            Aktivasi Ulang
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terverifikasi" className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada pengguna insidentil terverifikasi.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filtered.map((u) => {
                    const Icon = jenisIcon[u.jenisInsidentil ?? "PERSEORANGAN"];
                    return (
                      <div key={u.id} className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm truncate">{u.nama}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {u.email} · {u.telepon}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className="text-[10px]">
                            {jenisLabel[u.jenisInsidentil ?? "PERSEORANGAN"]}
                          </Badge>
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Terverifikasi
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivate(u.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aktivasi" className="space-y-4">
          <Alert>
            <AlertDescription className="text-xs">
              <strong>Aktivasi Ulang:</strong> Untuk melakukan aktivasi ulang,
              cari nama pengguna pada field di bawah, lalu klik tombol
              "Aktivasi". Akun pengguna insidentil akan aktif kembali dan dapat
              digunakan.
            </AlertDescription>
          </Alert>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama pengguna insidentil..."
              className="pl-10"
            />
          </div>
          <Card>
            <CardContent className="p-0">
              {insidentilList.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Tidak ada pengguna insidentil untuk diaktivasi ulang.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {insidentilList.map((u) => (
                    <div key={u.id} className="p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm">{u.nama}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                      <Button size="sm" onClick={() => handleActivate(u.id)}>
                        <Key className="mr-1 h-4 w-4" />
                        Aktivasi
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Insidentil</DialogTitle>
            <DialogDescription>
              Pendaftaran pengguna non-advokat (Perseorangan, Pemerintahan, atau
              Badan Hukum)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Jenis Pengguna *</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["PERSEORANGAN", "PEMERINTAHAN", "BADAN_HUKUM"] as JenisInsidentil[]).map((j) => {
                  const Icon = jenisIcon[j];
                  return (
                    <button
                      key={j}
                      onClick={() => setJenis(j)}
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        jenis === j
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <Icon className="mx-auto h-6 w-6 mb-1" />
                      <div className="text-xs font-medium">{jenisLabel[j]}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nama Lengkap *</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama lengkap sesuai KTP/Akta"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@contoh.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telepon</Label>
                <Input
                  value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>No KTP / NIK / NPWP *</Label>
              <Input
                value={form.ktp}
                onChange={(e) => setForm({ ...form, ktp: e.target.value })}
                placeholder="contoh: 01.234.567.8-901.0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Alamat</Label>
              <Textarea
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                placeholder="Alamat lengkap"
                rows={2}
              />
            </div>
            <Alert>
              <AlertDescription className="text-xs">
                Setelah data dilengkapi dan diverifikasi, sistem akan
                menghasilkan username dan password sementara untuk pengguna
                insidentil.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Batal</Button>
            <Button onClick={handleAdd}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verifikasi & Daftar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generated Credentials Dialog */}
      <Dialog open={!!generatedCreds} onOpenChange={(o) => !o && setGeneratedCreds(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pendaftaran Berhasil</DialogTitle>
            <DialogDescription>
              Berikut adalah username dan password untuk pengguna insidentil.
              Mohon informasikan kepada pengguna.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Status pengguna: <strong>Terverifikasi</strong>. Pengguna dapat
                langsung login menggunakan kredensial di bawah.
              </AlertDescription>
            </Alert>
            <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Username</div>
                <div className="font-mono font-bold text-primary">{generatedCreds?.username}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Password (sementara)</div>
                <div className="font-mono font-bold text-primary">{generatedCreds?.password}</div>
              </div>
            </div>
            <Alert>
              <AlertDescription className="text-xs">
                <strong>Penting:</strong> Akun hanya berlaku untuk beracara
                elektronik satu kali dan 14 hari setelah tanggal putusan.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={() => setGeneratedCreds(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============== DAFTAR PENDAFTARAN ONLINE (SIPP) ==============
export function DaftarPendaftaranOnline() {
  const perkara = useAppStore((s) => s.perkara);
  const currentUser = useAppStore((s) => s.currentUser);
  const verifyPerkara = useAppStore((s) => s.verifyPerkara);
  const selectPerkara = useAppStore((s) => s.selectPerkara);
  const [showRegister, setShowRegister] = useState<string | null>(null);
  const [nomorPerkara, setNomorPerkara] = useState("");
  const [klasifikasi, setKlasifikasi] = useState("");

  if (!currentUser?.pengadilanId) return null;

  // Pendaftaran yang sudah dibayar tapi belum punya nomor perkara
  const pendingPerkara = perkara.filter(
    (p) =>
      p.pengadilanId === currentUser.pengadilanId &&
      p.status === "DIBAYAR" &&
      !p.nomorPerkara
  );

  const handleRegister = () => {
    if (!nomorPerkara || !showRegister) {
      toast.error("Masukkan nomor perkara");
      return;
    }
    verifyPerkara(showRegister, nomorPerkara);
    toast.success("Perkara berhasil diregister di SIPP", {
      description: `Nomor Perkara: ${nomorPerkara}`,
    });
    setShowRegister(null);
    setNomorPerkara("");
    setKlasifikasi("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Daftar Pendaftaran Online (SIPP)</h2>
        <p className="text-sm text-muted-foreground">
          Pendaftaran online yang masuk dari e-Court dan sudah berstatus
          "Dibayar". Register perkara di SIPP untuk mendapatkan Nomor Perkara.
        </p>
      </div>

      <Alert>
        <AlertDescription className="text-xs">
          <strong>Daftar kewenangan yang dapat register:</strong> Super
          Administrator, Administrator, Ketua/Wakil Ketua, Panitera/Wakil
          Panitera, Panmud Perdata, Admin Panitera, Meja I Perdata, dan
          kewenangan lainnya.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-0">
          {pendingPerkara.length === 0 ? (
            <div className="py-12 text-center">
              <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                Tidak ada pendaftaran online yang menunggu register.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pendingPerkara.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono font-bold text-sm text-primary">
                          {p.nomorRegisterOnline}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {p.jenisPerkara}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-[10px]">
                          Sudah Dibayar
                        </Badge>
                      </div>
                      <div className="text-sm">{p.gugatanRingkas || p.klasifikasiPerkara}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Pendaftar: {p.pendaftarNama} · Tgl Daftar:{" "}
                        {new Date(p.createdAt).toLocaleDateString("id-ID")} · Panjar: Rp{" "}
                        {p.totalPanjar.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => selectPerkara(p.id)}>
                        Lihat Detil
                      </Button>
                      <Button size="sm" onClick={() => { setShowRegister(p.id); setNomorPerkara(""); }}>
                        Register di SIPP
                      </Button>
                    </div>
                  </div>
                  {showRegister === p.id && (
                    <div className="mt-3 rounded-lg border-2 border-primary/30 bg-primary/5 p-3 space-y-3">
                      <div className="text-sm font-semibold">Formulir Pendaftaran Perkara di SIPP</div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Klasifikasi Perkara</Label>
                          <Input
                            value={klasifikasi}
                            onChange={(e) => setKlasifikasi(e.target.value)}
                            placeholder="contoh: Perdata Umum - Wanprestasi"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Nomor Perkara *</Label>
                          <Input
                            value={nomorPerkara}
                            onChange={(e) => setNomorPerkara(e.target.value)}
                            placeholder="contoh: 125/Pdt.G/2024/PN.Jkt.Pst"
                            className="font-mono"
                          />
                        </div>
                      </div>
                      <Alert>
                        <AlertDescription className="text-xs">
                          Panjar perkara akan terisi otomatis sesuai Taksiran
                          Panjar Biaya Perkara dari pendaftaran online (Rp{" "}
                          {p.totalPanjar.toLocaleString("id-ID")}).
                        </AlertDescription>
                      </Alert>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowRegister(null)}>
                          Batal
                        </Button>
                        <Button onClick={handleRegister}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Register & Kirim Notifikasi
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
