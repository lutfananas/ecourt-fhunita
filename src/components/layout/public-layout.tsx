"use client";

import { useAppStore } from "@/lib/store";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: { box: "h-9 w-9", text: "text-base", sub: "text-[10px]" },
    md: { box: "h-11 w-11", text: "text-lg", sub: "text-[11px]" },
    lg: { box: "h-16 w-16", text: "text-2xl", sub: "text-sm" },
  };
  const s = sizeMap[size];
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${s.box} relative rounded-full bg-gradient-to-br from-[oklch(0.32_0.10_250)] to-[oklch(0.22_0.08_250)] flex items-center justify-center border-2 border-[oklch(0.82_0.13_85)] shadow-md`}
      >
        <div className="text-[oklch(0.82_0.13_85)] font-bold text-center leading-none">
          <div className="text-[10px]">MA</div>
          <div className="text-[10px]">RI</div>
        </div>
      </div>
      <div className="leading-tight">
        <div className={`font-heading font-extrabold ${s.text} text-primary`}>
          e-Court
        </div>
        <div className={`${s.sub} text-muted-foreground font-medium`}>
          Mahkamah Agung RI
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
            <Logo size="sm" />
            <p className="mt-3 text-sm text-sidebar-foreground/70">
              Sistem peradilan elektronik Mahkamah Agung Republik Indonesia
              untuk pelayanan peradilan yang lebih cepat, transparan, dan
              akuntabel.
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
              <li>Mahkamah Agung Republik Indonesia</li>
              <li>Jl. Medan Merdeka Utara No. 9-13</li>
              <li>Jakarta Pusat 10110</li>
              <li>Telepon: (021) 3843348</li>
              <li>Email: info@mahkamahagung.go.id</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-sidebar-border text-center text-xs text-sidebar-foreground/60">
          &copy; {new Date().getFullYear()} Mahkamah Agung Republik Indonesia.
          e-Court v3.0. Demo implementasi berdasarkan Manual Book e-Court 2019.
        </div>
      </div>
    </footer>
  );
}
