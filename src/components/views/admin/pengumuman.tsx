"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PengumumanView() {
  const pengumuman = useAppStore((s) => s.pengumuman);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Pengumuman</h2>
        <p className="text-sm text-muted-foreground">
          Informasi resmi dari Mahkamah Agung dan Pengadilan
        </p>
      </div>

      <div className="space-y-3">
        {pengumuman.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="font-heading text-base flex-1">
                  {p.judul}
                </CardTitle>
                <Badge
                  className={
                    p.dari === "MAHKAMAH_AGUNG"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }
                >
                  {p.dari === "MAHKAMAH_AGUNG" ? "Mahkamah Agung" : "Pengadilan"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(p.createdAt).toLocaleString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{p.isi}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
