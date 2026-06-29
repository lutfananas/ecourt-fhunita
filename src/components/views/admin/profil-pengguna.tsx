"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ROLE_LABEL } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Save, Key, User as UserIcon, Mail, Phone, Building2 } from "lucide-react";
import { toast } from "sonner";

export function ProfilPengguna() {
  const currentUser = useAppStore((s) => s.currentUser);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(currentUser ?? null);

  if (!currentUser || !form) return null;

  const initials = currentUser.nama
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSave = () => {
    updateProfile({
      nama: form.nama,
      email: form.email,
      telepon: form.telepon,
      noKta: form.noKta,
      noBaSumpah: form.noBaSumpah,
    });
    toast.success("Profil berhasil diperbarui");
    setEditing(false);
  };

  const handleChangePassword = () => {
    toast.info("Fitur ganti password - demo", {
      description: "Pada implementasi nyata, ini akan mengirim link reset ke email",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Profil Pengguna</h2>
        <p className="text-sm text-muted-foreground">
          Kelola data diri, email, dan password akun e-Court Anda.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => toast.info("Upload foto profil - demo")}
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h3 className="font-heading text-lg font-bold mt-3">{currentUser.nama}</h3>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            <Badge variant="outline" className="mt-2">
              {ROLE_LABEL[currentUser.role]}
            </Badge>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              {currentUser.telepon && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{currentUser.telepon}</span>
                </div>
              )}
              {currentUser.jabatan && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{currentUser.jabatan}</span>
                </div>
              )}
              {currentUser.nip && (
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xs">NIP: {currentUser.nip}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-heading text-base">Data Diri Pengguna</CardTitle>
            {!editing ? (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                Edit Profil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setForm(currentUser); setEditing(false); }}>
                  Batal
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="mr-1 h-4 w-4" />
                  Simpan
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription className="text-xs">
                <strong>Penting:</strong> Email yang didaftarkan akan menjadi
                alamat domisili elektronik Anda. Semua notifikasi e-Court
                (pendaftaran, panggilan, dokumen) akan dikirim ke email ini.
                Disarankan menggunakan Gmail untuk kemudahan sinkronisasi dengan
                smartphone.
              </AlertDescription>
            </Alert>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={form.username} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email (Domisili Elektronik)</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label>Telepon/HP</Label>
                <Input
                  value={form.telepon ?? ""}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                  disabled={!editing}
                />
              </div>
            </div>

            {/* Advokat specific */}
            {currentUser.role === "ADVOKAT" && (
              <>
                <Separator />
                <div className="text-sm font-semibold">Data Advokat</div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nomor Berita Acara Sumpah</Label>
                    <Input
                      value={form.noBaSumpah ?? ""}
                      onChange={(e) => setForm({ ...form, noBaSumpah: e.target.value })}
                      disabled={!editing}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor KTA</Label>
                    <Input
                      value={form.noKta ?? ""}
                      onChange={(e) => setForm({ ...form, noKta: e.target.value })}
                      disabled={!editing}
                      className="font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <Separator />
            <div>
              <Button variant="outline" onClick={handleChangePassword}>
                <Key className="mr-2 h-4 w-4" />
                Ganti Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
