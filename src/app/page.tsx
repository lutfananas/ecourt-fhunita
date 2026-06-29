"use client";

import { useAppStore } from "@/lib/store";
import { PublicHeader, Footer } from "@/components/layout/public-layout";
import { AppShell } from "@/components/layout/app-shell";
import { LandingPage } from "@/components/views/public/landing-page";
import { LoginForm } from "@/components/views/public/login-form";
import { RegisterForm } from "@/components/views/public/register-form";
import { Dashboard } from "@/components/views/dashboard/dashboard";
import { PendaftaranPerkara } from "@/components/views/perkara/pendaftaran-perkara";
import { DetilPerkara } from "@/components/views/perkara/detil-perkara";
import { DaftarPerkara } from "@/components/views/perkara/daftar-perkara";
import { VerifikasiAdvokat, DaftarAdvokat } from "@/components/views/admin/verifikasi-advokat";
import {
  KonfigurasiPengadilan,
  JenisBiaya,
  RadiusBiaya,
} from "@/components/views/admin/konfigurasi-pengadilan";
import {
  PenggunaNonAdvokat,
  DaftarPendaftaranOnline,
} from "@/components/views/admin/pengguna-non-advokat";
import { RiwayatPengguna } from "@/components/views/admin/riwayat-pengguna";
import { ProfilPengguna } from "@/components/views/admin/profil-pengguna";
import { PengumumanView } from "@/components/views/admin/pengumuman";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export default function Home() {
  const currentUser = useAppStore((s) => s.currentUser);
  const currentView = useAppStore((s) => s.currentView);

  // Public routes (not logged in)
  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        {currentView === "login" && <LoginForm />}
        {currentView === "register" && <RegisterForm />}
        {(currentView === "landing" ||
          !["login", "register"].includes(currentView)) && <LandingPage />}
        <Footer />
        <SonnerToaster richColors position="top-right" />
      </div>
    );
  }

  // Authenticated routes
  return (
    <>
      <AppShell>
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "pendaftaran-perkara" && <PendaftaranPerkara />}
        {currentView === "detil-perkara" && <DetilPerkara />}
        {currentView === "daftar-perkara" && <DaftarPerkara />}
        {currentView === "verifikasi-advokat" && <VerifikasiAdvokat />}
        {currentView === "daftar-advokat" && <DaftarAdvokat />}
        {currentView === "konfigurasi-pengadilan" && <KonfigurasiPengadilan />}
        {currentView === "jenis-biaya" && <JenisBiaya />}
        {currentView === "radius-biaya" && <RadiusBiaya />}
        {currentView === "pengguna-non-advokat" && <PenggunaNonAdvokat />}
        {currentView === "daftar-pendaftaran-online" && <DaftarPendaftaranOnline />}
        {currentView === "riwayat-pengguna" && <RiwayatPengguna />}
        {currentView === "profil" && <ProfilPengguna />}
        {currentView === "pengumuman" && <PengumumanView />}
        {/* Fallback */}
        {!["dashboard", "pendaftaran-perkara", "detil-perkara", "daftar-perkara",
          "verifikasi-advokat", "daftar-advokat", "konfigurasi-pengadilan",
          "jenis-biaya", "radius-biaya", "pengguna-non-advokat",
          "daftar-pendaftaran-online", "riwayat-pengguna", "profil", "pengumuman"
        ].includes(currentView) && <Dashboard />}
      </AppShell>
      <SonnerToaster richColors position="top-right" />
    </>
  );
}
