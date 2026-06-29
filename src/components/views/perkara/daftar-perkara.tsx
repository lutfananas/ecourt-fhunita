"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import {
  JENIS_PERKARA_LABEL,
  PERKARA_STATUS_LABEL,
  PERKARA_STATUS_COLOR,
  type PerkaraStatus,
  type JenisPerkara,
} from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  PlusCircle,
  ChevronRight,
  FolderOpen,
  Filter,
} from "lucide-react";

export function DaftarPerkara() {
  const allPerkara = useAppStore((s) => s.perkara);
  const currentUser = useAppStore((s) => s.currentUser);
  const selectPerkara = useAppStore((s) => s.selectPerkara);
  const setView = useAppStore((s) => s.setView);
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterBayar, setFilterBayar] = useState<string>("ALL");

  // Filter by user role - memoized (must be before any early return)
  const visiblePerkara = useMemo(() => {
    if (!currentUser) return [];
    let result = allPerkara;
    if (currentUser.role === "ADVOKAT" || currentUser.role === "INSIDENTIL") {
      result = result.filter((p) => p.pendaftarId === currentUser.id);
    } else if (currentUser.role === "ADMIN_PERTAMA" || currentUser.role === "HAKIM") {
      result = result.filter((p) => p.pengadilanId === currentUser.pengadilanId);
    }
    return result;
  }, [allPerkara, currentUser]);

  // Apply filters - memoized
  const filteredPerkara = useMemo(() => {
    let result = visiblePerkara;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nomorRegisterOnline.toLowerCase().includes(q) ||
          (p.nomorPerkara ?? "").toLowerCase().includes(q) ||
          (p.gugatanRingkas ?? "").toLowerCase().includes(q) ||
          (p.klasifikasiPerkara ?? "").toLowerCase().includes(q) ||
          p.pendaftarNama.toLowerCase().includes(q)
      );
    }
    if (filterJenis !== "ALL") {
      result = result.filter((p) => p.jenisPerkara === filterJenis);
    }
    if (filterStatus !== "ALL") {
      result = result.filter((p) => p.status === filterStatus);
    }
    if (filterBayar !== "ALL") {
      if (filterBayar === "SUDAH") {
        result = result.filter((p) =>
          ["DIBAYAR", "TERVERIFIKASI", "TERDAFTAR", "DALAM_SIDANG", "PUTUS"].includes(p.status)
        );
      } else if (filterBayar === "BELUM") {
        result = result.filter((p) =>
          ["DRAFT", "MENUNGGU_PEMBAYARAN"].includes(p.status)
        );
      } else if (filterBayar === "KADALUWARSA") {
        result = result.filter((p) => p.status === "MENUNGGU_PEMBAYARAN");
      }
    }
    return result;
  }, [visiblePerkara, search, filterJenis, filterStatus, filterBayar]);

  if (!currentUser) return null;

  const isPublicUser = currentUser.role === "ADVOKAT" || currentUser.role === "INSIDENTIL";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold">Daftar Perkara</h2>
          <p className="text-sm text-muted-foreground">
            {isPublicUser
              ? "Daftar perkara yang Anda daftarkan melalui e-Court"
              : `Daftar perkara di ${currentUser.pengadilanId ?? "pengadilan"}`}
          </p>
        </div>
        {isPublicUser && (
          <Button onClick={() => setView("pendaftaran-perkara")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Daftar Perkara Baru
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nomor register, nomor perkara, ringkasan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterJenis} onValueChange={setFilterJenis}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jenis</SelectItem>
                <SelectItem value="GUGATAN">Gugatan</SelectItem>
                <SelectItem value="BANTAHAN">Bantahan</SelectItem>
                <SelectItem value="GUGATAN_SEDERHANA">Gugatan Sederhana</SelectItem>
                <SelectItem value="PERMOHONAN">Permohonan</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="MENUNGGU_PEMBAYARAN">Menunggu Pembayaran</SelectItem>
                <SelectItem value="DIBAYAR">Sudah Dibayar</SelectItem>
                <SelectItem value="TERDAFTAR">Terdaftar</SelectItem>
                <SelectItem value="DALAM_SIDANG">Dalam Persidangan</SelectItem>
                <SelectItem value="PUTUS">Putus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Status Pembayaran filter (visible only for public users) */}
          {isPublicUser && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button
                size="sm"
                variant={filterBayar === "ALL" ? "default" : "outline"}
                onClick={() => setFilterBayar("ALL")}
              >
                Semua
              </Button>
              <Button
                size="sm"
                variant={filterBayar === "SUDAH" ? "default" : "outline"}
                onClick={() => setFilterBayar("SUDAH")}
              >
                Sudah Dibayar
              </Button>
              <Button
                size="sm"
                variant={filterBayar === "BELUM" ? "default" : "outline"}
                onClick={() => setFilterBayar("BELUM")}
              >
                Belum Dibayar
              </Button>
              <Button
                size="sm"
                variant={filterBayar === "KADALUWARSA" ? "default" : "outline"}
                onClick={() => setFilterBayar("KADALUWARSA")}
              >
                Kadaluwarsa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {filteredPerkara.length === 0 ? (
            <div className="py-16 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                Tidak ada perkara ditemukan.
              </p>
              {isPublicUser && (
                <Button onClick={() => setView("pendaftaran-perkara")} className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Daftar Perkara Baru
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredPerkara.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPerkara(p.id)}
                  className="w-full text-left p-4 hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-sm font-bold text-primary">
                          {p.nomorPerkara ?? p.nomorRegisterOnline}
                        </span>
                        {!p.nomorPerkara && (
                          <Badge variant="outline" className="text-[10px]">
                            Belum Punya Nomor Perkara
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">
                          {JENIS_PERKARA_LABEL[p.jenisPerkara]}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${PERKARA_STATUS_COLOR[p.status]}`}>
                          {PERKARA_STATUS_LABEL[p.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {p.gugatanRingkas || p.klasifikasiPerkara || "Tidak ada ringkasan"}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {p.pengadilanNama} · Pendaftar: {p.pendaftarNama} ·{" "}
                        Didaftar: {new Date(p.createdAt).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Panjar</div>
                        <div className="font-bold text-sm font-mono">
                          Rp {p.totalPanjar.toLocaleString("id-ID")}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center">
        Menampilkan {filteredPerkara.length} dari {allPerkara.length} perkara
      </div>
    </div>
  );
}
