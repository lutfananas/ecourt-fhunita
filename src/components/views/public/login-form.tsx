"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/layout/public-layout";
import { ROLE_LABEL } from "@/lib/types";
import { toast } from "sonner";
import {
  Scale,
  User as UserIcon,
  ShieldCheck,
  Gavel,
  Building2,
  Info,
} from "lucide-react";

const DEMO_USERS = [
  { label: "Admin Pengadilan Tingkat Banding", username: "admin.bandung", password: "admin123", icon: Building2, role: "ADMIN_BANDING" },
  { label: "Admin Pengadilan Tingkat Pertama", username: "admin.pnjktpusat", password: "admin123", icon: ShieldCheck, role: "ADMIN_PERTAMA" },
  { label: "Hakim", username: "hendra.hakim", password: "hakim123", icon: Gavel, role: "HAKIM" },
  { label: "Advokat (Terverifikasi)", username: "ahmad.advokat", password: "advokat123", icon: Scale, role: "ADVOKAT" },
  { label: "Pengguna Insidentil", username: "budi.insidentil", password: "user123", icon: UserIcon, role: "INSIDENTIL" },
];

export function LoginForm() {
  const login = useAppStore((s) => s.login);
  const setView = useAppStore((s) => s.setView);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(username, password);
    if (success) {
      toast.success("Login berhasil", {
        description: "Selamat datang di e-Court FH UNTA",
      });
    } else {
      setError("Username/email atau password salah. Silakan coba lagi.");
      toast.error("Login gagal", {
        description: "Username atau password salah",
      });
    }
  };

  const quickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    const success = login(u, p);
    if (success) {
      toast.success("Login berhasil sebagai demo user");
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-br from-secondary/40 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid items-center gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Login Form */}
          <Card className="shadow-xl border-border">
            <CardHeader className="space-y-3">
              <Logo size="lg" />
              <Separator />
              <CardTitle className="font-heading text-2xl">Login e-Court FH UNTA</CardTitle>
              <CardDescription>
                Masuk ke aplikasi e-Court Fakultas Hukum Universitas Tulungagung
                menggunakan akun yang telah terdaftar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username atau Email</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="contoh: ahmad.advokat atau ahmad.advokat@gmail.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" size="lg">
                  Login
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setView("register")}
                    className="text-primary font-medium hover:underline"
                  >
                    Register Pengguna Terdaftar
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <div className="space-y-4">
            <Alert className="border-primary/30 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription>
                <strong>Akun Demo:</strong> Klik salah satu peran di bawah untuk
                login cepat sebagai pengguna demo dan menjelajahi fitur e-Court.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              {DEMO_USERS.map((du) => (
                <button
                  key={du.username}
                  onClick={() => quickLogin(du.username, du.password)}
                  className="w-full text-left rounded-lg border border-border bg-card p-3 hover:bg-secondary/60 hover:border-primary/40 transition-all flex items-center gap-3 group"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <du.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{du.label}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {du.username} / {du.password}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {ROLE_LABEL[du.role as keyof typeof ROLE_LABEL].split(" ")[0]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
