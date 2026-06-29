"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

export function VerifikasiAdvokat() {
  const users = useAppStore((s) => s.users);
  const verifyAdvokat = useAppStore((s) => s.verifyAdvokat);
  const pengadilan = useAppStore((s) => s.pengadilan);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"BELUM_VERIFIKASI" | "TERVERIFIKASI">("BELUM_VERIFIKASI");
  const [detilUser, setDetilUser] = useState<string | null>(null);

  const advokatList = users.filter((u) => u.role === "ADVOKAT");
  const filtered = advokatList.filter((u) => {
    if (u.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.nama.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.noBaSumpah ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const detil = detilUser ? users.find((u) => u.id === detilUser) : null;
  const ptBanding = detil?.pengadilanId
    ? pengadilan.find((p) => p.id === detil.pengadilanId)
    : null;

  const handleVerify = (id: string) => {
    verifyAdvokat(id);
    toast.success("Advokat berhasil diverifikasi");
    setDetilUser(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Verifikasi Data Advokat</h2>
        <p className="text-sm text-muted-foreground">
          Validasi data advokat yang mendaftar di e-Court. Cek Nomor Berita Acara
          Sumpah dan dokumen pendukung sebelum memverifikasi.
        </p>
      </div>

      <Alert>
        <AlertDescription className="text-xs">
          <strong>Langkah verifikasi:</strong>
          <ol className="mt-1 list-decimal pl-4 space-y-0.5">
            <li>Cek Nomor Berita Acara Sumpah advokat</li>
            <li>Cek tiap dokumen (KTP, BA Sumpah, KTA)</li>
            <li>Jika data sesuai, klik tombol "Validasi"</li>
            <li>Status berubah menjadi "Terverifikasi"</li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={filter === "BELUM_VERIFIKASI" ? "default" : "outline"}
          onClick={() => setFilter("BELUM_VERIFIKASI")}
        >
          Belum Verifikasi ({advokatList.filter((u) => u.status === "BELUM_VERIFIKASI").length})
        </Button>
        <Button
          size="sm"
          variant={filter === "TERVERIFIKASI" ? "default" : "outline"}
          onClick={() => setFilter("TERVERIFIKASI")}
        >
          Terverifikasi ({advokatList.filter((u) => u.status === "TERVERIFIKASI").length})
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama, email, atau No. BA Sumpah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Tidak ada advokat ditemukan.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {u.nama.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm truncate">{u.nama}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {u.email} · No. BA Sumpah: {u.noBaSumpah}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Tgl Sumpah: {u.tglSumpah ? new Date(u.tglSumpah).toLocaleDateString("id-ID") : "-"}
                        {u.noKta && ` · KTA: ${u.noKta}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => setDetilUser(u.id)}>
                      <Eye className="mr-1 h-4 w-4" />
                      Detil
                    </Button>
                    {u.status === "BELUM_VERIFIKASI" && (
                      <Button size="sm" onClick={() => handleVerify(u.id)}>
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Validasi
                      </Button>
                    )}
                    {u.status === "TERVERIFIKASI" && (
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Terverifikasi
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detil Dialog */}
      <Dialog open={!!detilUser} onOpenChange={(o) => !o && setDetilUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detil Advokat</DialogTitle>
            <DialogDescription>
              Periksa data advokat sebelum melakukan verifikasi
            </DialogDescription>
          </DialogHeader>
          {detil && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {detil.nama.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-heading font-bold text-lg">{detil.nama}</h3>
                  <p className="text-sm text-muted-foreground">{detil.email}</p>
                  <Badge
                    className={
                      detil.status === "TERVERIFIKASI"
                        ? "bg-emerald-100 text-emerald-800 mt-1"
                        : "bg-amber-100 text-amber-800 mt-1"
                    }
                  >
                    {detil.status === "TERVERIFIKASI" ? "Terverifikasi" : "Belum Terverifikasi"}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">No. BA Sumpah</div>
                  <div className="font-mono font-semibold">{detil.noBaSumpah}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tanggal Sumpah</div>
                  <div>{detil.tglSumpah ? new Date(detil.tglSumpah).toLocaleDateString("id-ID") : "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">No. KTA</div>
                  <div className="font-mono">{detil.noKta ?? "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Telepon</div>
                  <div>{detil.telepon ?? "-"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground">Pengadilan Tingkat Banding</div>
                  <div>{ptBanding?.nama ?? "-"}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">Dokumen Pendukung</div>
                <div className="space-y-2">
                  {["KTP", "Berita Acara Sumpah", "Kartu Tanda Anggota (KTA)"].map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 rounded-md border border-border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">{doc}.pdf</span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`Lihat ${doc}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {detil.status === "BELUM_VERIFIKASI" && (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDetilUser(null)}>
                    Tutup
                  </Button>
                  <Button onClick={() => handleVerify(detil.id)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Validasi Advokat
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============== DAFTAR ADVOKAT (CRUD by Admin Banding) ==============
export function DaftarAdvokat() {
  const users = useAppStore((s) => s.users);
  const addAdvokat = useAppStore((s) => s.addAdvokat);
  const pengadilan = useAppStore((s) => s.pengadilan);
  const currentUser = useAppStore((s) => s.currentUser);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ nama: "", noBaSumpah: "", tglSumpah: "", pengadilanId: "" });

  const ptBandingList = pengadilan.filter((p) => p.tingkat === "BANDING");
  const advokatList = users.filter((u) => u.role === "ADVOKAT");
  const filtered = advokatList.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.nama.toLowerCase().includes(q) ||
      (u.noBaSumpah ?? "").toLowerCase().includes(q)
    );
  });

  const handleAdd = () => {
    if (!form.nama || !form.noBaSumpah || !form.tglSumpah || !form.pengadilanId) {
      toast.error("Lengkapi semua field");
      return;
    }
    addAdvokat(form);
    toast.success("Data advokat berhasil ditambahkan", {
      description: "Advokat otomatis berstatus Terverifikasi",
    });
    setForm({ nama: "", noBaSumpah: "", tglSumpah: "", pengadilanId: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold">Daftar Advokat</h2>
          <p className="text-sm text-muted-foreground">
            Database advokat yang pernah disumpah di Pengadilan Tingkat Banding
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Data Advokat
        </Button>
      </div>

      <Alert>
        <AlertDescription className="text-xs">
          Pengadilan Tingkat Banding menginput data Advokat yang pernah disumpah.
          Tujuannya: jika ada pendaftar Advokat baru dengan Nomor BA Sumpah yang
          sudah sesuai dengan database, otomatis berstatus Terverifikasi tanpa
          perlu validasi manual.
        </AlertDescription>
      </Alert>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau No. BA Sumpah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Tidak ada advokat.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Nama</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">No. BA Sumpah</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Tgl Sumpah</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-secondary/20">
                      <td className="py-3 px-4">
                        <div className="font-medium">{u.nama}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">{u.noBaSumpah}</td>
                      <td className="py-3 px-4 text-xs">
                        {u.tglSumpah ? new Date(u.tglSumpah).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            u.status === "TERVERIFIKASI"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {u.status === "TERVERIFIKASI" ? "Terverifikasi" : "Belum Verifikasi"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Data Advokat</DialogTitle>
            <DialogDescription>
              Tambahkan advokat yang pernah disumpah ke database
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Nama Lengkap dan Gelar *</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="contoh: Rudi Iswahyudi, S.H., M.H."
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nomor Berita Acara Sumpah *</Label>
                <Input
                  value={form.noBaSumpah}
                  onChange={(e) => setForm({ ...form, noBaSumpah: e.target.value })}
                  placeholder="contoh: BAS-2018-001234"
                />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Disumpah *</Label>
                <Input
                  type="date"
                  value={form.tglSumpah}
                  onChange={(e) => setForm({ ...form, tglSumpah: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Pengadilan Tingkat Banding *</Label>
              <select
                value={form.pengadilanId}
                onChange={(e) => setForm({ ...form, pengadilanId: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Pilih PT</option>
                {ptBandingList.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
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
