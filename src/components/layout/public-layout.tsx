"use client";

import { useAppStore } from "@/lib/store";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: { box: "h-10 w-10", text: "text-base", sub: "text-[10px]" },
    md: { box: "h-12 w-12", text: "text-lg", sub: "text-[11px]" },
    lg: { box: "h-16 w-16", text: "text-2xl", sub: "text-sm" },
  };
  const s = sizeMap[size];
  return (
    <div className="flex items-center gap-3">
      <div className={`${s.box} relative shrink-0`}>
        <Image
          src="/unita-logo.png"
          alt="Logo Universitas Tulungagung"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="leading-tight">
        <div className={`font-heading font-extrabold ${s.text} text-primary`}>
          e-Court FH UNTA
        </div>
        <div className={`${s.sub} text-muted-foreground font-medium`}>
          Fakultas Hukum Universitas Tulungagung
        </div>
      </div>
    </div>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
    </Button>
  );
}

export function PublicHeader() {
  const setView = useAppStore((s) => s.setView);
  const currentUser = useAppStore((s) => s.currentUser);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button onClick={() => setView("landing")} className="flex items-center">
          <Logo />
        </button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {currentUser ? (
            <Button onClick={() => setView("dashboard")}>Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setView("login")}>
                Login
              </Button>
              <Button onClick={() => setView("register")}>
                Register Pengguna Terdaftar
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 relative">
                <Image
                  src="/unita-logo.png"
                  alt="Logo UNTA"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="leading-tight">
                <div className="font-heading font-extrabold text-base text-white">
                  e-Court FH UNTA
                </div>
                <div className="text-[10px] text-[oklch(0.55_0.22_25)] font-medium">
                  Fakultas Hukum Universitas Tulungagung
                </div>
              </div>
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              Sistem peradilan elektronik Fakultas Hukum Universitas Tulungagung
              sebagai media pembelajaran dan simulasi pelayanan peradilan
              elektronik yang lebih cepat, transparan, dan akuntabel.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Layanan</h4>
            <ul className="space-y-1.5 text-sm text-sidebar-foreground/70">
              <li>e-Filing (Pendaftaran Perkara Online)</li>
              <li>e-Payment (Pembayaran Panjar Biaya)</li>
              <li>e-Summons (Pemanggilan Elektronik)</li>
              <li>e-Litigasi (Persidangan Elektronik)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Kontak</h4>
            <ul className="space-y-1.5 text-sm text-sidebar-foreground/70">
              <li>Fakultas Hukum Universitas Tulungagung</li>
              <li>Jl. Ki Mangunsarkoro No. 4, Beji</li>
              <li>Kec. Boyolangu, Kab. Tulungagung</li>
              <li>Jawa Timur 66223, Indonesia</li>
              <li>Telepon: (0355) 322145 / 320396</li>
              <li>Fax: (0355) 327068</li>
              <li>Email: fakultashukum@unita.ac.id</li>
              <li>Website: fh.unita.ac.id</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-sidebar-border text-center text-xs text-sidebar-foreground/60">
          &copy; {new Date().getFullYear()} Fakultas Hukum Universitas
          Tulungagung. e-Court v3.0. Media pembelajaran simulasi peradilan
          elektronik berdasarkan Manual Book e-Court Mahkamah Agung 2019.
        </div>
      </div>
    </footer>
  );
}
