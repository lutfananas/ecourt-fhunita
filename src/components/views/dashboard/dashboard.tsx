"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import {
  JENIS_PERKARA_LABEL,
  PERKARA_STATUS_LABEL,
  PERKARA_STATUS_COLOR,
  ROLE_LABEL,
  type JenisPerkara,
  type PerkaraStatus,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoPerkaraCard, StatCard } from "@/components/shared/stat-card";
import {
  FileText,
  FileCheck2,
  FileClock,
  FileX2,
  FolderOpen,
  UserCheck,
  Users,
  Inbox,
  Bell,
  Gavel,
  Scale,
  ScrollText,
  PlusCircle,
} from "lucide-react";

const JENIS_PERKARA_LIST: JenisPerkara[] = [
  "GUGATAN",
  "BANTAHAN",
  "GUGATAN_SEDERHANA",
  "PERMOHONAN",
];

export function Dashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const allPerkara = useAppStore((s) => s.perkara);
  const users = useAppStore((s) => s.users);
  const pengumuman = useAppStore((s) => s.pengumuman);
  const setView = useAppStore((s) => s.setView);
  const selectPerkara = useAppStore((s) => s.selectPerkara);

  // Filter perkara based on role - memoized
  const userPerkara = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "ADVOKAT" || currentUser.role === "INSIDENTIL") {
      return allPerkara.filter((p) => p.pendaftarId === currentUser.id);
    }
    if (currentUser.role === "ADMIN_PERTAMA" || currentUser.role === "HAKIM") {
      return allPerkara.filter((p) => p.pengadilanId === currentUser.pengadilanId);
    }
    if (currentUser.role === "ADMIN_BANDING") {
      return allPerkara;
    }
    return allPerkara;
  }, [allPerkara, currentUser]);

  if (!currentUser) return null;

  const getStatusCount = (status: PerkaraStatus) =>
    userPerkara.filter((p) => p.status === status).length;

  const getJenisStats = (jenis: JenisPerkara) => {
    const list = userPerkara.filter((p) => p.jenisPerkara === jenis);
    return {
      total: list.length,
      punyaNomor: list.filter(
        (p) => p.nomorPerkara || p.status === "TERDAFTAR" || p.status === "DALAM_SIDANG" || p.status === "PUTUS"
      ).length,
      sudahBayar: list.filter((p) =>
        ["DIBAYAR", "TERVERIFIKASI", "TERDAFTAR", "DALAM_SIDANG", "PUTUS"].includes(p.status)
      ).length,
      belumBayar: list.filter((p) =>
        ["DRAFT", "MENUNGGU_PEMBAYARAN"].includes(p.status)
      ).length,
    };
  };

  const pendingPerkaraForRegistration = userPerkara.filter(
    (p) => p.status === "DIBAYAR" && !p.nomorPerkara
  );
  const pendingAdvokatVerification = users.filter(
    (u) => u.role === "ADVOKAT" && u.status === "BELUM_VERIFIKASI"
  );
  const totalAdvokat = users.filter((u) => u.role === "ADVOKAT").length;
  const totalInsidentil = users.filter((u) => u.role === "INSIDENTIL").length;

  const isPublicUser = currentUser.role === "ADVOKAT" || currentUser.role === "INSIDENTIL";

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-xl bg-gradient-to-br from-[oklch(0.28_0.13_255)] to-[oklch(0.20_0.10_255)] p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-extrabold">
              Selamat Datang, {currentUser.nama}
            </h2>
            <p className="mt-1 text-white/80 text-sm">
              {ROLE_LABEL[currentUser.role]} · e-Court FH UNTA - Fakultas Hukum
              Universitas Tulungagung
            </p>
            {currentUser.role === "ADVOKAT" && currentUser.status === "BELUM_VERIFIKASI" && (
              <Badge className="mt-3 bg-amber-400 text-amber-950 hover:bg-amber-400">
                Akun Anda menunggu verifikasi Pengadilan Tingkat Banding
              </Badge>
            )}
            {isPublicUser && currentUser.status === "TERVERIFIKASI" && (
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={() => setView("pendaftaran-perkara")}
                  className="bg-[oklch(0.55_0.22_25)] text-white hover:bg-[oklch(0.50_0.22_25)]"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Daftar Perkara Baru
                </Button>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <Scale className="h-16 w-16 text-[oklch(0.65_0.22_25)] opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick stats - role based */}
      {isPublicUser && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Perkara"
            value={userPerkara.length}
            icon={FolderOpen}
            color="primary"
            onClick={() => setView("daftar-perkara")}
          />
          <StatCard
            title="Punya Nomor Perkara"
            value={
              userPerkara.filter((p) => p.nomorPerkara).length
            }
            icon={FileCheck2}
            color="success"
            onClick={() => setView("daftar-perkara")}
          />
          <StatCard
            title="Sudah Dibayar"
            value={getStatusCount("DIBAYAR") + getStatusCount("TERDAFTAR") + getStatusCount("DALAM_SIDANG") + getStatusCount("PUTUS")}
            icon={FileText}
            color="info"
          />
          <StatCard
            title="Belum Dibayar"
            value={getStatusCount("MENUNGGU_PEMBAYARAN") + getStatusCount("DRAFT")}
            icon={FileClock}
            color="warning"
          />
        </div>
      )}

      {currentUser.role === "ADMIN_BANDING" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Advokat"
            value={totalAdvokat}
            icon={Users}
            color="primary"
            onClick={() => setView("daftar-advokat")}
          />
          <StatCard
            title="Menunggu Verifikasi"
            value={pendingAdvokatVerification.length}
            icon={UserCheck}
            color="warning"
            onClick={() => setView("verifikasi-advokat")}
          />
          <StatCard
            title="Advokat Terverifikasi"
            value={users.filter((u) => u.role === "ADVOKAT" && u.status === "TERVERIFIKASI").length}
            icon={FileCheck2}
            color="success"
          />
          <StatCard
            title="Total Perkara"
            value={userPerkara.length}
            icon={FolderOpen}
            color="info"
          />
        </div>
      )}

      {currentUser.role === "ADMIN_PERTAMA" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pendaftaran Online Masuk"
            value={pendingPerkaraForRegistration.length}
            icon={Inbox}
            color="warning"
            onClick={() => setView("daftar-pendaftaran-online")}
          />
          <StatCard
            title="Total Perkara"
            value={userPerkara.length}
            icon={FolderOpen}
            color="primary"
            onClick={() => setView("daftar-perkara")}
          />
          <StatCard
            title="Pengguna Insidentil"
            value={totalInsidentil}
            icon={Users}
            color="info"
            onClick={() => setView("pengguna-non-advokat")}
          />
          <StatCard
            title="Sudah Terdaftar"
            value={userPerkara.filter((p) => p.nomorPerkara).length}
            icon={FileCheck2}
            color="success"
          />
        </div>
      )}

      {currentUser.role === "HAKIM" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Perkara Ditangani"
            value={userPerkara.length}
            icon={Gavel}
            color="primary"
            onClick={() => setView("daftar-perkara")}
          />
          <StatCard
            title="Dalam Persidangan"
            value={getStatusCount("DALAM_SIDANG")}
            icon={ScrollText}
            color="purple"
          />
          <StatCard
            title="Sudah Putus"
            value={getStatusCount("PUTUS")}
            icon={FileCheck2}
            color="success"
          />
          <StatCard
            title="Baru Terdaftar"
            value={getStatusCount("TERDAFTAR")}
            icon={FileText}
            color="info"
          />
        </div>
      )}

      {/* Info Perkara Cards - untuk Pengguna Terdaftar & Insidentil */}
      {isPublicUser && (
        <div>
          <h3 className="font-heading text-lg font-bold mb-3">
            Info Perkara Saya
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {JENIS_PERKARA_LIST.map((jenis) => {
              const stats = getJenisStats(jenis);
              return (
                <InfoPerkaraCard
                  key={jenis}
                  title={JENIS_PERKARA_LABEL[jenis]}
                  total={stats.total}
                  stats={[
                    { label: "Punya Nomor", value: stats.punyaNomor, color: "success" },
                    { label: "Sudah Dibayar", value: stats.sudahBayar, color: "info" },
                    { label: "Belum Dibayar", value: stats.belumBayar, color: "warning" },
                    { label: "Total", value: stats.total },
                  ]}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Info Pendaftaran Perkara - untuk Admin Pengadilan */}
      {(currentUser.role === "ADMIN_BANDING" ||
        currentUser.role === "ADMIN_PERTAMA" ||
        currentUser.role === "HAKIM") && (
        <div>
          <h3 className="font-heading text-lg font-bold mb-3">
            Info Pendaftaran Perkara
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {JENIS_PERKARA_LIST.map((jenis) => {
              const stats = getJenisStats(jenis);
              return (
                <InfoPerkaraCard
                  key={jenis}
                  title={`Info ${JENIS_PERKARA_LABEL[jenis]}`}
                  total={stats.total}
                  stats={[
                    { label: "Berhasil & Bayar", value: stats.punyaNomor, color: "success" },
                    { label: "Belum Nomor", value: stats.total - stats.punyaNomor, color: "warning" },
                    { label: "Belum Bayar", value: stats.belumBayar, color: "danger" },
                    { label: "Total", value: stats.total },
                  ]}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Perkara & Pengumuman */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Perkara */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-heading text-base">
                Perkara Terbaru
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("daftar-perkara")}
              >
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent>
              {userPerkara.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {isPublicUser
                    ? "Belum ada perkara yang didaftarkan. Klik 'Daftar Perkara Baru' untuk memulai."
                    : "Belum ada perkara masuk."}
                </div>
              ) : (
                <div className="space-y-2">
                  {userPerkara.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectPerkara(p.id)}
                      className="w-full text-left rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs font-semibold text-primary">
                              {p.nomorPerkara ?? p.nomorRegisterOnline}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {JENIS_PERKARA_LABEL[p.jenisPerkara]}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {p.gugatanRingkas || p.klasifikasiPerkara || "Tidak ada ringkasan"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {p.pengadilanNama} ·{" "}
                            {new Date(p.createdAt).toLocaleDateString("id-ID")}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-[10px] ${PERKARA_STATUS_COLOR[p.status]}`}
                        >
                          {PERKARA_STATUS_LABEL[p.status]}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pengumuman */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Pengumuman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {pengumuman.map((pgm) => (
                <div
                  key={pgm.id}
                  className="rounded-lg border border-border p-3 bg-secondary/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="text-[10px] bg-primary text-primary-foreground">
                      {pgm.dari === "MAHKAMAH_AGUNG" ? "FH UNTA" : "Pengadilan"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(pgm.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm">{pgm.judul}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-4">
                    {pgm.isi}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
