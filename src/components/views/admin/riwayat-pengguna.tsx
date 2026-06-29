"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, History, Clock, Globe, Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AKSI_COLOR: Record<string, string> = {
  LOGIN: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  LOGOUT: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  DAFTAR_PERKARA: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  VERIFIKASI_PERKARA: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  VERIFIKASI_ADVOKAT: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  PEMBAYARAN: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  UPLOAD_DOKUMEN: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
};

export function RiwayatPengguna() {
  const riwayat = useAppStore((s) => s.riwayat);
  const users = useAppStore((s) => s.users);
  const [search, setSearch] = useState("");
  const [detilId, setDetilId] = useState<string | null>(null);

  const filtered = riwayat.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const user = users.find((u) => u.id === r.userId);
    return (
      r.aksi.toLowerCase().includes(q) ||
      (r.detail ?? "").toLowerCase().includes(q) ||
      (user?.nama ?? "").toLowerCase().includes(q)
    );
  });

  const detil = detilId ? riwayat.find((r) => r.id === detilId) : null;
  const detilUser = detil ? users.find((u) => u.id === detil.userId) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Riwayat Pengguna</h2>
        <p className="text-sm text-muted-foreground">
          Track record perubahan dan aktivitas yang terjadi di sistem e-Court.
          Menampilkan IP dan waktu perubahan.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari aksi, detail, atau nama pengguna..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <History className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                Tidak ada riwayat ditemukan.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((r) => {
                const user = users.find((u) => u.id === r.userId);
                return (
                  <button
                    key={r.id}
                    onClick={() => setDetilId(r.id)}
                    className="w-full text-left p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge
                              variant="outline"
                              className={AKSI_COLOR[r.aksi] ?? ""}
                            >
                              {r.aksi.replace(/_/g, " ")}
                            </Badge>
                            <span className="font-semibold text-sm">{user?.nama ?? "Unknown"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {r.detail}
                          </p>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(r.waktu).toLocaleString("id-ID")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              IP: {r.ip}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!detilId} onOpenChange={(o) => !o && setDetilId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detil Riwayat</DialogTitle>
          </DialogHeader>
          {detil && (
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Pengguna</div>
                <div className="font-semibold">{detilUser?.nama ?? "Unknown"}</div>
                <div className="text-xs text-muted-foreground">{detilUser?.email}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Aksi</div>
                <Badge variant="outline" className={AKSI_COLOR[detil.aksi] ?? ""}>
                  {detil.aksi.replace(/_/g, " ")}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Detail</div>
                <div>{detil.detail}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Waktu</div>
                <div>{new Date(detil.waktu).toLocaleString("id-ID")}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">IP Address</div>
                <div className="font-mono">{detil.ip}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
