"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CreditCard,
  Bell,
  Video,
  Scale,
  Clock,
  Wallet,
  Archive,
  Search,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export function LandingPage() {
  const setView = useAppStore((s) => s.setView);
  const pengumuman = useAppStore((s) => s.pengumuman);
  const perkaraCount = useAppStore((s) => s.perkara.length);
  const pengadilanCount = useAppStore((s) => s.pengadilan.length);

  const features = [
    {
      icon: FileText,
      title: "e-Filing",
      desc: "Pendaftaran Perkara Online",
      detail:
        "Daftarkan perkara gugatan, bantahan, gugatan sederhana, dan permohonan secara online tanpa harus datang ke pengadilan.",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: CreditCard,
      title: "e-Payment",
      desc: "Pembayaran Panjar Biaya Online",
      detail:
        "Pembayaran biaya panjar melalui Virtual Account dengan berbagai metode pembayaran dan bank yang tersedia.",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      icon: Bell,
      title: "e-Summons",
      desc: "Pemanggilan Elektronik",
      detail:
        "Pemanggilan para pihak dilakukan secara elektronik ke alamat domisili elektronik (email) pengguna.",
      color: "from-amber-500 to-amber-700",
    },
    {
      icon: Video,
      title: "e-Litigasi",
      desc: "Persidangan Elektronik",
      detail:
        "Pengiriman dokumen persidangan (Replik, Duplik, Kesimpulan, Jawaban) secara elektronik yang dapat diakses pengadilan dan para pihak.",
      color: "from-purple-500 to-purple-700",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Hemat Waktu & Biaya",
      desc: "Proses pendaftaran perkara menjadi lebih cepat tanpa perlu datang ke pengadilan.",
    },
    {
      icon: Wallet,
      title: "Multi Channel Payment",
      desc: "Pembayaran biaya panjar dapat dilakukan dari berbagai metode pembayaran dan bank.",
    },
    {
      icon: Archive,
      title: "Arsip Digital",
      desc: "Dokumen terarsip dengan baik dan dapat diakses dari berbagai lokasi dan media.",
    },
    {
      icon: Search,
      title: "Temu Kembali Cepat",
      desc: "Proses pencarian data perkara menjadi lebih cepat dan efisien.",
    },
    {
      icon: ShieldCheck,
      title: "Aman & Terverifikasi",
      desc: "Sesuai Perma No. 3 Tahun 2018 tentang Administrasi Perkara di Pengadilan secara Elektronik.",
    },
    {
      icon: Scale,
      title: "Peradilan Modern",
      desc: "Mendukung peradilan umum, peradilan agama, dan peradilan TUN di seluruh Indonesia.",
    },
  ];

  return (
    <main className="flex-1">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.28_0.09_250)] via-[oklch(0.32_0.10_250)] to-[oklch(0.22_0.08_250)] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-[oklch(0.82_0.13_85)] blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[oklch(0.82_0.13_85)] blur-3xl"></div>
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <Badge className="mb-4 border-[oklch(0.82_0.13_85)] bg-[oklch(0.82_0.13_85)]/20 text-[oklch(0.82_0.13_85)] hover:bg-[oklch(0.82_0.13_85)]/30">
                Perma No. 3 Tahun 2018
              </Badge>
              <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-6xl">
                Sistem Peradilan Elektronik{" "}
                <span className="text-[oklch(0.82_0.13_85)]">
                  Mahkamah Agung
                </span>{" "}
                Republik Indonesia
              </h1>
              <p className="mt-6 text-lg text-white/80 md:text-xl">
                e-Court adalah instrumen Pengadilan sebagai bentuk pelayanan
                terhadap masyarakat dalam hal Pendaftaran Perkara secara online,
                Taksiran Panjar Biaya secara elektronik, Pembayaran Panjar Biaya
                secara online, Pemanggilan secara online, dan Persidangan secara
                online.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => setView("register")}
                  className="bg-[oklch(0.82_0.13_85)] text-[oklch(0.22_0.04_250)] hover:bg-[oklch(0.72_0.13_85)]"
                >
                  Register Pengguna Terdaftar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setView("login")}
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Login e-Court
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                <div>
                  <div className="text-3xl font-bold text-[oklch(0.82_0.13_85)]">
                    {pengadilanCount}+
                  </div>
                  <div className="text-xs text-white/70">Pengadilan Aktif</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[oklch(0.82_0.13_85)]">
                    {perkaraCount}+
                  </div>
                  <div className="text-xs text-white/70">Perkara Terdaftar</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[oklch(0.82_0.13_85)]">
                    4
                  </div>
                  <div className="text-xs text-white/70">Layanan Elektronik</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold">
                    Pengumuman Terbaru
                  </h3>
                  <Bell className="h-5 w-5 text-[oklch(0.82_0.13_85)]" />
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {pengumuman.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-lg bg-white/5 p-3 border border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-[oklch(0.82_0.13_85)] text-[oklch(0.22_0.04_250)]">
                          {p.dari === "MAHKAMAH_AGUNG"
                            ? "Mahkamah Agung"
                            : "Pengadilan"}
                        </Badge>
                        <span className="text-xs text-white/60">
                          {new Date(p.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm">{p.judul}</h4>
                      <p className="text-xs text-white/70 mt-1 line-clamp-3">
                        {p.isi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 gold-line"></div>
      </section>

      {/* 4 PILLARS - e-Court Core Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">
            Empat Pilar e-Court
          </Badge>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold">
            Layanan Peradilan Elektronik Terpadu
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            e-Court menghadirkan empat pilar layanan peradilan elektronik yang
            terintegrasi untuk memudahkan masyarakat dalam proses beracara di
            pengadilan.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${f.color}`}
              ></div>
              <CardHeader>
                <div
                  className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${f.color} text-white shadow-md`}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <CardTitle className="font-heading text-xl">{f.title}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">
                  {f.desc}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold">
              Keuntungan Menggunakan e-Court
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Berbagai manfaat yang dapat diperoleh dari aplikasi e-Court untuk
              memudahkan masyarakat dalam proses peradilan.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-xl bg-card p-6 border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USER TYPES */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold">
            Pengguna e-Court
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            e-Court melayani berbagai jenis pengguna sesuai dengan peran dan
            kewenangannya.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Pengguna Terdaftar (Advokat)",
              desc: "Advokat yang telah disumpah dan terverifikasi oleh Pengadilan Tingkat Banding. Dapat mendaftarkan perkara untuk klien.",
              icon: Scale,
            },
            {
              title: "Pengguna Insidentil",
              desc: "Pengguna non-advokat (Perseorangan, Pemerintahan, atau Badan Hukum) yang beracara sendiri tanpa advokat.",
              icon: FileText,
            },
            {
              title: "Administrator Pengadilan",
              desc: "Petugas pengadilan yang mengelola konfigurasi, verifikasi, dan administrasi pendaftaran perkara online.",
              icon: ShieldCheck,
            },
            {
              title: "Hakim",
              desc: "Hakim yang memeriksa perkara, memverifikasi dokumen persidangan, dan mengunggah salinan putusan.",
              icon: Scale,
            },
            {
              title: "Pengadilan Tingkat Banding",
              desc: "Pengadilan tingkat banding yang memverifikasi data advokat di wilayahnya.",
              icon: ShieldCheck,
            },
            {
              title: "Pengadilan Tingkat Pertama",
              desc: "Pengadilan tingkat pertama yang menerima pendaftaran dan melakukan registrasi perkara di SIPP.",
              icon: FileText,
            },
          ].map((u) => (
            <Card key={u.title} className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/30 text-primary">
                  <u.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">
                  {u.title}
                </h3>
                <p className="text-sm text-muted-foreground">{u.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[oklch(0.28_0.09_250)] to-[oklch(0.22_0.08_250)] text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold">
            Mulai Beracara Secara Elektronik Hari Ini
          </h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Daftarkan akun Anda dan nikmati kemudahan beracara secara online
            dengan e-Court Mahkamah Agung.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => setView("register")}
              className="bg-[oklch(0.82_0.13_85)] text-[oklch(0.22_0.04_250)] hover:bg-[oklch(0.72_0.13_85)]"
            >
              Daftar Sekarang
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setView("login")}
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Sudah Punya Akun? Login
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
