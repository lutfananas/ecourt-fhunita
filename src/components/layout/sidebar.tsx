"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Role, ViewName } from "@/lib/types";
import {
  LayoutDashboard,
  FilePlus2,
  FolderOpen,
  ScrollText,
  Users,
  UserCheck,
  Settings,
  Coins,
  MapPin,
  UserPlus,
  Inbox,
  History,
  Bell,
  Scale,
} from "lucide-react";

interface MenuItem {
  view: ViewName;
  label: string;
  icon: React.ElementType;
}

const MENU_BY_ROLE: Record<Role, MenuItem[]> = {
  ADVOKAT: [
    { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { view: "pendaftaran-perkara", label: "Pendaftaran Perkara", icon: FilePlus2 },
    { view: "daftar-perkara", label: "Daftar Perkara Saya", icon: FolderOpen },
    { view: "pengumuman", label: "Pengumuman", icon: Bell },
  ],
  INSIDENTIL: [
    { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { view: "pendaftaran-perkara", label: "Pendaftaran Perkara", icon: FilePlus2 },
    { view: "daftar-perkara", label: "Daftar Perkara Saya", icon: FolderOpen },
    { view: "pengumuman", label: "Pengumuman", icon: Bell },
  ],
  ADMIN_BANDING: [
    { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { view: "verifikasi-advokat", label: "Verifikasi Advokat", icon: UserCheck },
    { view: "daftar-advokat", label: "Daftar Advokat", icon: Users },
    { view: "daftar-perkara", label: "Daftar Perkara", icon: FolderOpen },
    { view: "riwayat-pengguna", label: "Riwayat Pengguna", icon: History },
    { view: "pengumuman", label: "Pengumuman", icon: Bell },
  ],
  ADMIN_PERTAMA: [
    { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { view: "daftar-pendaftaran-online", label: "Pendaftaran Online (SIPP)", icon: Inbox },
    { view: "daftar-perkara", label: "Daftar Perkara", icon: FolderOpen },
    { view: "pengguna-non-advokat", label: "Pengguna Non-Advokat", icon: UserPlus },
    { view: "jenis-biaya", label: "Jenis Biaya", icon: Coins },
    { view: "radius-biaya", label: "Radius Biaya Panggilan", icon: MapPin },
    { view: "konfigurasi-pengadilan", label: "Konfigurasi Pengadilan", icon: Settings },
    { view: "riwayat-pengguna", label: "Riwayat Pengguna", icon: History },
    { view: "pengumuman", label: "Pengumuman", icon: Bell },
  ],
  HAKIM: [
    { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { view: "daftar-perkara", label: "Daftar Perkara", icon: FolderOpen },
    { view: "pengumuman", label: "Pengumuman", icon: Bell },
  ],
  SUPER_ADMIN: [
    { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { view: "daftar-perkara", label: "Daftar Perkara", icon: FolderOpen },
    { view: "pengumuman", label: "Pengumuman", icon: Bell },
  ],
};

export function Sidebar() {
  const currentUser = useAppStore((s) => s.currentUser);
  const currentView = useAppStore((s) => s.currentView);
  const setView = useAppStore((s) => s.setView);
  const perkara = useAppStore((s) => s.perkara);
  const users = useAppStore((s) => s.users);

  if (!currentUser) return null;
  const menu = MENU_BY_ROLE[currentUser.role] ?? [];

  // Notification badges
  const pendingPerkara =
    currentUser.role === "ADMIN_PERTAMA" || currentUser.role === "HAKIM"
      ? perkara.filter((p) => p.status === "DIBAYAR" && !p.nomorPerkara).length
      : 0;
  const pendingAdvokat =
    currentUser.role === "ADMIN_BANDING"
      ? users.filter((u) => u.role === "ADVOKAT" && u.status === "BELUM_VERIFIKASI").length
      : 0;

  const getBadge = (view: ViewName): number => {
    if (view === "daftar-pendaftaran-online") return pendingPerkara;
    if (view === "verifikasi-advokat") return pendingAdvokat;
    return 0;
  };

  return (
    <aside className="flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-4 bg-[oklch(0.22_0.08_250)]">
        <button
          onClick={() => setView("landing")}
          className="flex items-center gap-3"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[oklch(0.32_0.10_250)] to-[oklch(0.22_0.08_250)] flex items-center justify-center border-2 border-[oklch(0.82_0.13_85)]">
            <div className="text-[oklch(0.82_0.13_85)] font-bold text-[9px] leading-none text-center">
              <div>MA</div>
              <div>RI</div>
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-heading font-extrabold text-base text-white">
              e-Court
            </div>
            <div className="text-[10px] text-[oklch(0.82_0.13_85)] font-medium">
              Mahkamah Agung RI
            </div>
          </div>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menu.map((item) => {
          const badge = getBadge(item.view);
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={cn(
                "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {badge > 0 && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                    isActive
                      ? "bg-sidebar-primary-foreground text-sidebar-primary"
                      : "bg-[oklch(0.82_0.13_85)] text-[oklch(0.22_0.04_250)]"
                  )}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-lg bg-sidebar-accent/50 p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="h-3.5 w-3.5 text-[oklch(0.82_0.13_85)]" />
            <span className="font-semibold">Status Akun</span>
          </div>
          <div className="text-sidebar-foreground/70">
            {currentUser.status === "TERVERIFIKASI" && "Terverifikasi"}
            {currentUser.status === "BELUM_VERIFIKASI" && "Menunggu Verifikasi"}
            {currentUser.status === "AKTIF" && "Aktif"}
            {currentUser.status === "BLOK" && "Terblokir"}
            {currentUser.status === "PINDAH" && "Pindah"}
            {currentUser.status === "KADALUWARSA" && "Kadaluwarsa"}
          </div>
        </div>
      </div>
    </aside>
  );
}
