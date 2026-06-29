"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { JENIS_PERKARA_LABEL, type JenisPerkara } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  Banknote,
  Mail,
  Coins,
  MapPin,
  PlusCircle,
  Trash2,
  Power,
  Save,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export function KonfigurasiPengadilan() {
  const currentUser = useAppStore((s) => s.currentUser);
  const pengadilan = useAppStore((s) => s.pengadilan);
  const updatePengadilanConfig = useAppStore((s) => s.updatePengadilanConfig);

  const myPengadilan = pengadilan.find((p) => p.id === currentUser?.pengadilanId);
  const [form, setForm] = useState(myPengadilan ?? null);

  if (!myPengadilan || !form) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Pengadilan tidak ditemukan untuk akun ini.
        </CardContent>
      </Card>
    );
  }

  const handleSave = () => {
    updatePengadilanConfig(myPengadilan.id, form);
    toast.success("Konfigurasi pengadilan berhasil disimpan");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Konfigurasi Pengadilan</h2>
        <p className="text-sm text-muted-foreground">
          Kelola data profil pengadilan, bank, dan Google Mail untuk integrasi
          e-Court.
        </p>
      </div>

      <Tabs defaultValue="profil">
        <TabsList>
          <TabsTrigger value="profil">
            <Building2 className="mr-2 h-4 w-4" />
            Profil Pengadilan
          </TabsTrigger>
          <TabsTrigger value="bank">
            <Banknote className="mr-2 h-4 w-4" />
            Konfigurasi Bank
          </TabsTrigger>
          <TabsTrigger value="mail">
            <Mail className="mr-2 h-4 w-4" />
            Konfigurasi Google Mail
          </TabsTrigger>
        </TabsList>

        {/* Profil */}
        <TabsContent value="profil">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Profil Pengadilan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama Pengadilan</Label>
                  <Input
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kode Pengadilan (sesuai Kode Perkara SIPP)</Label>
                  <Input
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value })}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tingkat Pengadilan</Label>
                  <Input value={form.tingkat} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Jenis Peradilan</Label>
                  <Input value={form.jenis} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Telepon</Label>
                  <Input
                    value={form.telepon ?? ""}
                    onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Pengadilan</Label>
                  <Input
                    type="email"
                    value={form.email ?? ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Alamat</Label>
                  <Input
                    value={form.alamat ?? ""}
                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kota</Label>
                  <Input
                    value={form.kota ?? ""}
                    onChange={(e) => setForm({ ...form, kota: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Provinsi</Label>
                  <Input
                    value={form.provinsi ?? ""}
                    onChange={(e) => setForm({ ...form, provinsi: e.target.value })}
                  />
                </div>
              </div>
              <Separator />
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Konfigurasi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank */}
        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Konfigurasi Bank</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertDescription className="text-xs">
                  Konfigurasi bank digunakan untuk generate Virtual Account dan
                  menampilkan informasi pembayaran pada e-SKUM dan e-Payment.
                </AlertDescription>
              </Alert>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Nama Bank</Label>
                  <Input
                    value={form.bankNama ?? ""}
                    onChange={(e) => setForm({ ...form, bankNama: e.target.value })}
                    placeholder="contoh: Bank BRI"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Rekening</Label>
                  <Input
                    value={form.bankNoRek ?? ""}
                    onChange={(e) => setForm({ ...form, bankNoRek: e.target.value })}
                    placeholder="contoh: 0100-01-012345-67-8"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Atas Nama</Label>
                  <Input
                    value={form.bankAtasNama ?? ""}
                    onChange={(e) => setForm({ ...form, bankAtasNama: e.target.value })}
                    placeholder="contoh: PN Jakarta Pusat"
                  />
                </div>
              </div>
              <Separator />
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Konfigurasi Bank
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Mail */}
        <TabsContent value="mail">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Konfigurasi Google Mail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertDescription className="text-xs">
                  Email Gmail digunakan untuk notifikasi otomatis kepada para
                  pihak (pendaftar, advokat, hakim) terkait status pendaftaran,
                  panggilan, dan dokumen persidangan. Disarankan menempelkan
                  akun Gmail di smartphone untuk notifikasi real-time.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Email Gmail Pengadilan</Label>
                <Input
                  type="email"
                  value={form.googleMail ?? ""}
                  onChange={(e) => setForm({ ...form, googleMail: e.target.value })}
                  placeholder="contoh: ecourt.pn.jakartapusat@gmail.com"
                />
              </div>
              <Separator />
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Konfigurasi Mail
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============== JENIS BIAYA ==============
export function JenisBiaya() {
  const currentUser = useAppStore((s) => s.currentUser);
  const jenisBiaya = useAppStore((s) => s.jenisBiaya);
  const addJenisBiaya = useAppStore((s) => s.addJenisBiaya);
  const toggleJenisBiaya = useAppStore((s) => s.toggleJenisBiaya);
  const deleteJenisBiaya = useAppStore((s) => s.deleteJenisBiaya);
  const [filterJenis, setFilterJenis] = useState<JenisPerkara>("GUGATAN");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    jenisPerkara: "GUGATAN" as JenisPerkara,
    urutan: 1,
    namaBiaya: "",
    nominal: 0,
    kodePerkalian: 1,
  });

  if (!currentUser?.pengadilanId) return null;

  const myBiaya = jenisBiaya
    .filter((b) => b.pengadilanId === currentUser.pengadilanId && b.jenisPerkara === filterJenis)
    .sort((a, b) => a.urutan - b.urutan);

  const handleAdd = () => {
    if (!form.namaBiaya) {
      toast.error("Isi nama biaya");
      return;
    }
    addJenisBiaya({
      pengadilanId: currentUser.pengadilanId,
      jenisPerkara: form.jenisPerkara,
      urutan: form.urutan,
      namaBiaya: form.namaBiaya,
      nominal: Number(form.nominal),
      kodePerkalian: Number(form.kodePerkalian),
      aktif: true,
    });
    toast.success("Komponen biaya panjar berhasil ditambahkan");
    setForm({ jenisPerkara: filterJenis, urutan: myBiaya.length + 1, namaBiaya: "", nominal: 0, kodePerkalian: 1 });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-heading text-2xl font-bold">Jenis Biaya (Komponen Biaya Panjar)</h2>
          <p className="text-sm text-muted-foreground">
            Komponen biaya panjar dibuat sesuai alur perkara. Item ini akan
            ditampilkan di Taksiran Biaya Panjar / e-SKUM.
          </p>
        </div>
        <Button onClick={() => { setForm({ ...form, jenisPerkara: filterJenis, urutan: myBiaya.length + 1 }); setShowAdd(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Biaya
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Petunjuk Kode Perkalian:</strong>
          <ul className="mt-1 list-disc pl-4 space-y-0.5">
            <li><code>1</code> = Langsung (nominal sesuai)</li>
            <li><code>2</code> = Panggilan Penggugat (otomatis dari radius)</li>
            <li><code>3</code> = Panggilan Tergugat (otomatis dari radius x jumlah tergugat)</li>
            <li><code>100</code> = PNBP Relaas Panggilan Pertama (Rp 5.000 x jumlah tergugat)</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Filter jenis perkara */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(JENIS_PERKARA_LABEL) as JenisPerkara[]).map((j) => (
          <Button
            key={j}
            size="sm"
            variant={filterJenis === j ? "default" : "outline"}
            onClick={() => setFilterJenis(j)}
          >
            {JENIS_PERKARA_LABEL[j]}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {myBiaya.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Belum ada komponen biaya untuk {JENIS_PERKARA_LABEL[filterJenis]}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs">Urutan</th>
                    <th className="text-left py-3 px-4 text-xs">Nama Biaya</th>
                    <th className="text-right py-3 px-4 text-xs">Nominal (Rp)</th>
                    <th className="text-center py-3 px-4 text-xs">Kode Perkalian</th>
                    <th className="text-center py-3 px-4 text-xs">Status</th>
                    <th className="text-center py-3 px-4 text-xs">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myBiaya.map((b) => (
                    <tr key={b.id} className="hover:bg-secondary/20">
                      <td className="py-3 px-4 font-mono">{b.urutan}</td>
                      <td className="py-3 px-4 font-medium">{b.namaBiaya}</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {b.nominal === 0 ? (
                          <span className="text-xs italic text-muted-foreground">auto</span>
                        ) : (
                          b.nominal.toLocaleString("id-ID")
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline">{b.kodePerkalian}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          className={
                            b.aktif
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                              : "bg-muted text-muted-foreground hover:bg-muted"
                          }
                        >
                          {b.aktif ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleJenisBiaya(b.id)}
                            title={b.aktif ? "Nonaktifkan" : "Aktifkan"}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { deleteJenisBiaya(b.id); toast.success("Dihapus"); }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Komponen Biaya Panjar</DialogTitle>
            <DialogDescription>
              Jenis Perkara: {JENIS_PERKARA_LABEL[filterJenis]}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Urutan</Label>
                <Input
                  type="number"
                  value={form.urutan}
                  onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Kode Perkalian</Label>
                <Select
                  value={String(form.kodePerkalian)}
                  onValueChange={(v) => setForm({ ...form, kodePerkalian: Number(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Langsung</SelectItem>
                    <SelectItem value="2">2 - Panggilan Penggugat</SelectItem>
                    <SelectItem value="3">3 - Panggilan Tergugat</SelectItem>
                    <SelectItem value="100">100 - PNBP Relaas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nama Biaya</Label>
              <Input
                value={form.namaBiaya}
                onChange={(e) => setForm({ ...form, namaBiaya: e.target.value })}
                placeholder="contoh: Pendaftaran, Panggilan, Meterai"
              />
            </div>
            <div className="space-y-2">
              <Label>Nominal (Rp) - isi 0 untuk panggilan otomatis</Label>
              <Input
                type="number"
                value={form.nominal}
                onChange={(e) => setForm({ ...form, nominal: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Batal</Button>
            <Button onClick={handleAdd}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============== RADIUS BIAYA PANGGILAN ==============
export function RadiusBiaya() {
  const currentUser = useAppStore((s) => s.currentUser);
  const radiusPanggilan = useAppStore((s) => s.radiusPanggilan);

  if (!currentUser?.pengadilanId) return null;

  const myRadius = radiusPanggilan.filter((r) => r.pengadilanId === currentUser.pengadilanId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-heading text-2xl font-bold">Radius Biaya Panggilan</h2>
          <p className="text-sm text-muted-foreground">
            Data radius panggilan sesuai ketetapan Ketua Pengadilan, digunakan
            sebagai acuan generate taksiran panjar biaya perkara (e-SKUM).
          </p>
        </div>
        <Button onClick={() => toast.info("Update data radius dari aplikasi Komdanas MA")}>
          <MapPin className="mr-2 h-4 w-4" />
          Update Data Radius dari Komdanas
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Update data radius panggilan tidak dilakukan dengan input manual, akan
          tetapi dilakukan dengan login di aplikasi Komdanas Mahkamah Agung dan
          memperbaharui Data Radius di Komdanas. Setelah itu, tekan tombol
          "Update Data Radius dari Komdanas" untuk sinkronisasi.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-0">
          {myRadius.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Belum ada data radius panggilan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs">Provinsi</th>
                    <th className="text-left py-3 px-4 text-xs">Kabupaten/Kota</th>
                    <th className="text-left py-3 px-4 text-xs">Kecamatan</th>
                    <th className="text-right py-3 px-4 text-xs">Radius (km)</th>
                    <th className="text-right py-3 px-4 text-xs">Biaya per KM (Rp)</th>
                    <th className="text-right py-3 px-4 text-xs">Min. Biaya (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myRadius.map((r) => (
                    <tr key={r.id} className="hover:bg-secondary/20">
                      <td className="py-3 px-4">{r.provinsi}</td>
                      <td className="py-3 px-4">{r.kabupaten}</td>
                      <td className="py-3 px-4">{r.kecamatan}</td>
                      <td className="py-3 px-4 text-right font-mono">{r.radius}</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {r.biayaPerKm.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        {(r.radius * r.biayaPerKm).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
