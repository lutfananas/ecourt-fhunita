"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/layout/public-layout";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function RegisterForm() {
  const registerAdvokat = useAppStore((s) => s.registerAdvokat);
  const setView = useAppStore((s) => s.setView);
  const pengadilan = useAppStore((s) => s.pengadilan);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    telepon: "",
    noBaSumpah: "",
    tglSumpah: "",
    noKta: "",
    pengadilanId: "",
    setuju: false,
  });

  const bandingPengadilan = pengadilan.filter((p) => p.tingkat === "BANDING");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (!form.setuju) {
      setError("Anda harus menyetujui syarat dan ketentuan.");
      return;
    }
    const ok = registerAdvokat({
      nama: form.nama,
      username: form.username,
      email: form.email,
      password: form.password,
      telepon: form.telepon,
      noBaSumpah: form.noBaSumpah,
      tglSumpah: form.tglSumpah,
      noKta: form.noKta,
      pengadilanId: form.pengadilanId,
    });
    if (ok) {
      setSuccess(true);
      toast.success("Pendaftaran berhasil!", {
        description: "Akun Anda menunggu verifikasi Pengadilan Tingkat Banding.",
      });
    } else {
      setError("Username atau email sudah terdaftar.");
    }
  };

  if (success) {
    return (
      <main className="flex-1 bg-gradient-to-br from-secondary/40 to-background">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-xl mx-auto shadow-xl border-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <Logo size="md" />
              <CardTitle className="font-heading text-2xl mt-4">
                Pendaftaran Berhasil
              </CardTitle>
              <CardDescription>
                Akun Anda telah berhasil didaftarkan di e-Court FH UNTA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-amber-300 bg-amber-50 text-amber-900">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Menunggu Verifikasi:</strong> Akun Anda berstatus{" "}
                  <em>Belum Terverifikasi</em>. Pengadilan Tingkat Banding di
                  mana Anda disumpah akan melakukan verifikasi terhadap data
                  Anda (Nomor Berita Acara Sumpah, KTP, dan KTA). Setelah
                  terverifikasi, Anda dapat mulai beracara menggunakan e-Court
                  FH UNTA.
                </AlertDescription>
              </Alert>
              <Alert className="border-primary/30 bg-primary/5">
                <AlertDescription>
                  <strong>Email aktivasi</strong> telah dikirim ke{" "}
                  <em>{form.email}</em>. Silakan cek email Anda (termasuk folder
                  spam) untuk informasi lebih lanjut.
                </AlertDescription>
              </Alert>
              <div className="flex gap-3">
                <Button onClick={() => setView("login")} className="flex-1">
                  Login Sekarang
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setView("landing")}
                  className="flex-1"
                >
                  Kembali ke Beranda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-secondary/40 to-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-xl border-border">
          <CardHeader className="space-y-3">
            <Logo size="md" />
            <Separator />
            <CardTitle className="font-heading text-2xl">
              Register Pengguna Terdaftar (Advokat)
            </CardTitle>
            <CardDescription>
              Pendaftaran akun untuk Advokat yang telah disumpah di e-Court FH
              UNTA. Setelah pendaftaran, akun akan diverifikasi oleh Pengadilan
              Tingkat Banding tempat Anda disumpah.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap dan Gelar *</Label>
                <Input
                  id="nama"
                  placeholder="contoh: Rudi Iswahyudi, S.H., M.H."
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="contoh: rudi.advokat"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Domisili Elektronik) *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contoh: rudi.iswahyudi@unita.ac.id"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telepon">Nomor Telepon/HP *</Label>
                <Input
                  id="telepon"
                  placeholder="contoh: 081234567890"
                  value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                  required
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Data Advokat</h3>
                <p className="text-xs text-muted-foreground">
                  Sesuai Perma No. 3 Tahun 2018, data Advokat harus dilengkapi
                  dengan Berita Acara Sumpah dan Kartu Tanda Anggota (KTA).
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="noBaSumpah">Nomor Berita Acara Sumpah *</Label>
                  <Input
                    id="noBaSumpah"
                    placeholder="contoh: BAS-2018-001234"
                    value={form.noBaSumpah}
                    onChange={(e) =>
                      setForm({ ...form, noBaSumpah: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tglSumpah">Tanggal Disumpah *</Label>
                  <Input
                    id="tglSumpah"
                    type="date"
                    value={form.tglSumpah}
                    onChange={(e) =>
                      setForm({ ...form, tglSumpah: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="noKta">Nomor KTA (Kartu Tanda Anggota)</Label>
                  <Input
                    id="noKta"
                    placeholder="contoh: KTA-2024-005678"
                    value={form.noKta}
                    onChange={(e) => setForm({ ...form, noKta: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pengadilanId">
                    Pengadilan Tingkat Banding (Tempat Disumpah) *
                  </Label>
                  <Select
                    value={form.pengadilanId}
                    onValueChange={(v) =>
                      setForm({ ...form, pengadilanId: v })
                    }
                  >
                    <SelectTrigger id="pengadilanId">
                      <SelectValue placeholder="Pilih Pengadilan Tinggi" />
                    </SelectTrigger>
                    <SelectContent>
                      {bandingPengadilan.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Alert className="border-primary/30 bg-primary/5">
                <AlertDescription className="text-xs">
                  <strong>Catatan:</strong> Dokumen pendukung (KTP, Berita Acara
                  Sumpah, KTA) akan diminta saat verifikasi. Pastikan data yang
                  Anda masukkan sesuai dengan dokumen asli.
                </AlertDescription>
              </Alert>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="setuju"
                  checked={form.setuju}
                  onCheckedChange={(c) =>
                    setForm({ ...form, setuju: c === true })
                  }
                />
                <Label htmlFor="setuju" className="text-sm font-normal">
                  Saya menyetujui{" "}
                  <span className="text-primary font-medium">
                    syarat dan ketentuan
                  </span>{" "}
                  e-Court FH UNTA dan menyatakan data yang saya berikan
                  adalah benar.
                </Label>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" size="lg" className="w-full">
                Daftar
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-primary font-medium hover:underline"
                >
                  Login di sini
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
