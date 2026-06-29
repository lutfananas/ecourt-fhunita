"use client";

import { useAppStore } from "@/lib/store";
import { Logo, ThemeToggle } from "./public-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
} from "lucide-react";
import { ROLE_LABEL, type ViewName } from "@/lib/types";
import { Sidebar } from "./sidebar";

export function AppHeader() {
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);
  const setView = useAppStore((s) => s.setView);
  const currentView = useAppStore((s) => s.currentView);

  if (!currentUser) return null;

  const initials = currentUser.nama
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const titles: Partial<Record<ViewName, string>> = {
    dashboard: "Dashboard",
    "pendaftaran-perkara": "Pendaftaran Perkara",
    "detil-perkara": "Detil Perkara",
    "daftar-perkara": "Daftar Perkara",
    "verifikasi-advokat": "Verifikasi Data Advokat",
    "daftar-advokat": "Daftar Advokat",
    "konfigurasi-pengadilan": "Konfigurasi Pengadilan",
    "jenis-biaya": "Jenis Biaya (Komponen Biaya Panjar)",
    "radius-biaya": "Radius Biaya Panggilan",
    "pengguna-non-advokat": "Pengguna Non-Advokat (Insidentil)",
    "daftar-pendaftaran-online": "Daftar Pendaftaran Online (SIPP)",
    "riwayat-pengguna": "Riwayat Pengguna",
    profil: "Profil Pengguna",
    pengumuman: "Pengumuman",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-3 px-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <button onClick={() => setView("landing")}>
            <Logo size="sm" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-lg font-bold truncate">
            {titles[currentView] ?? "e-Court"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Badge variant="outline" className="hidden md:inline-flex">
            {ROLE_LABEL[currentUser.role]}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
                  {currentUser.nama}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-medium">{currentUser.nama}</div>
                <div className="text-xs text-muted-foreground font-normal truncate">
                  {currentUser.email}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setView("profil")}>
                <UserIcon className="mr-2 h-4 w-4" />
                Profil Pengguna
              </DropdownMenuItem>
              {(currentUser.role === "ADMIN_BANDING" ||
                currentUser.role === "ADMIN_PERTAMA") && (
                <DropdownMenuItem onClick={() => setView("konfigurasi-pengadilan")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Konfigurasi
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                }}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
