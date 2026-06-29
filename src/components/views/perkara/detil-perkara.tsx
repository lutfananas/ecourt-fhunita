"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import {
  JENIS_PERKARA_LABEL,
  PERKARA_STATUS_LABEL,
  PERKARA_STATUS_COLOR,
  DOKUMEN_JENIS_LABEL,
  type DokumenJenis,
  type SidangAgenda,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  FileText,
  Calendar,
  CreditCard,
  Users,
  Banknote,
  Bell,
  Gavel,
  CheckCircle2,
  Lock,
  Unlock,
  Upload,
  Eye,
  Printer,
  Send,
  Download,
  UserPlus,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";

export function DetilPerkara() {
  const perkaraId = useAppStore((s) => s.selectedPerkaraId);
  const allPerkara = useAppStore((s) => s.perkara);
  const allPihak = useAppStore((s) => s.pihak);
  const allDokumen = useAppStore((s) => s.dokumen);
  const allSidang = useAppStore((s) => s.sidang);
  const allBiayaDetail = useAppStore((s) => s.biayaDetail);
  const currentUser = useAppStore((s) => s.currentUser);
  const setView = useAppStore((s) => s.setView);
  const verifyPerkara = useAppStore((s) => s.verifyPerkara);
  const uploadDokumenPersidangan = useAppStore((s) => s.uploadDokumenPersidangan);
  const verifyDokumen = useAppStore((s) => s.verifyDokumen);
  const uploadSalinanPutusan = useAppStore((s) => s.uploadSalinanPutusan);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [nomorPerkaraInput, setNomorPerkaraInput] = useState("");

  const perkara = useMemo(
    () => allPerkara.find((p) => p.id === perkaraId),
    [allPerkara, perkaraId]
  );
  const pihak = useMemo(
    () => allPihak.filter((p) => p.perkaraId === perkaraId),
    [allPihak, perkaraId]
  );
  const dokumen = useMemo(
    () => allDokumen.filter((d) => d.perkaraId === perkaraId),
    [allDokumen, perkaraId]
  );
  const sidang = useMemo(
    () =>
      allSidang
        .filter((s) => s.perkaraId === perkaraId)
        .sort((a, b) => a.urutan - b.urutan),
    [allSidang, perkaraId]
  );
  const biayaDetail = useMemo(
    () =>
      allBiayaDetail
        .filter((b) => b.perkaraId === perkaraId)
        .sort((a, b) => a.urutan - b.urutan),
    [allBiayaDetail, perkaraId]
  );
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [uploadJenis, setUploadJenis] = useState<DokumenJenis>("REPLIK");
  const [uploadFileName, setUploadFileName] = useState("");

  if (!perkara || !currentUser) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Perkara tidak ditemukan.</p>
          <Button onClick={() => setView("daftar-perkara")} className="mt-4">
            Kembali ke Daftar Perkara
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isAdmin = currentUser.role === "ADMIN_PERTAMA" || currentUser.role === "ADMIN_BANDING";
  const isHakim = currentUser.role === "HAKIM";
  const isPendaftar = currentUser.id === perkara.pendaftarId;
  const canVerifyDokumen = isHakim;
  const canVerifyPerkara = isAdmin && perkara.status === "DIBAYAR" && !perkara.nomorPerkara;
  const canRegister = isAdmin && perkara.status === "DIBAYAR" && !perkara.nomorPerkara;
  const canUploadPutusan = isHakim && perkara.status !== "PUTUS";

  // Determine which dokumen types this user can upload to e-Litigasi
  const litigasiJenis: DokumenJenis[] = ["JAWABAN", "REPLIK", "DUPLIK", "KESIMPULAN"];

  const handleUploadDokumen = () => {
    if (!uploadFileName) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }
    const ext = uploadFileName.split(".").pop()?.toLowerCase() ?? "doc";
    uploadDokumenPersidangan(perkara.id, uploadJenis, DOKUMEN_JENIS_LABEL[uploadJenis], uploadFileName, ext);
    toast.success("Dokumen persidangan berhasil diupload");
    setUploadFileName("");
    setShowUploadForm(false);
  };

  const handleVerifyDokumen = (dokId: string) => {
    verifyDokumen(dokId);
    toast.success("Dokumen berhasil diverifikasi");
  };

  const handleRegister = () => {
    if (!nomorPerkaraInput) {
      toast.error("Masukkan nomor perkara");
      return;
    }
    verifyPerkara(perkara.id, nomorPerkaraInput);
    toast.success("Perkara berhasil diregister di SIPP", {
      description: `Nomor Perkara: ${nomorPerkaraInput}`,
    });
    setShowRegisterDialog(false);
    setNomorPerkaraInput("");
  };

  const handleUploadPutusan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadSalinanPutusan(perkara.id, file.name);
    toast.success("Salinan putusan berhasil diupload");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("daftar-perkara")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Perkara
          </Button>
          <h2 className="font-heading text-2xl font-bold break-all">
            {perkara.nomorPerkara ?? perkara.nomorRegisterOnline}
          </h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline">{JENIS_PERKARA_LABEL[perkara.jenisPerkara]}</Badge>
            <Badge variant="outline" className={PERKARA_STATUS_COLOR[perkara.status]}>
              {PERKARA_STATUS_LABEL[perkara.status]}
            </Badge>
            {perkara.klasifikasiPerkara && (
              <Badge variant="secondary" className="text-xs">
                {perkara.klasifikasiPerkara}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {canRegister && (
            <Button onClick={() => setShowRegisterDialog(true)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Register di SIPP
            </Button>
          )}
          {canUploadPutusan && (
            <div>
              <input
                type="file"
                id="uploadPutusan"
                accept=".pdf"
                onChange={handleUploadPutusan}
                className="hidden"
              />
              <label htmlFor="uploadPutusan">
                <Button asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Salinan Putusan
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs defaultValue="pendaftaran">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pendaftaran">
            <FileText className="mr-2 h-4 w-4" />
            Pendaftaran
          </TabsTrigger>
          <TabsTrigger value="persidangan">
            <Gavel className="mr-2 h-4 w-4" />
            Persidangan
          </TabsTrigger>
          <TabsTrigger value="dokumen">
            <FolderOpen className="mr-2 h-4 w-4" />
            Dokumen
          </TabsTrigger>
        </TabsList>

        {/* ==================== TAB PENDAFTARAN ==================== */}
        <TabsContent value="pendaftaran" className="space-y-4 mt-4">
          {/* Pendaftaran Perkara */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Pendaftaran Perkara
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">Nomor Register Online</div>
                  <div className="font-mono font-semibold">{perkara.nomorRegisterOnline}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Nomor Perkara</div>
                  <div className="font-mono font-semibold">
                    {perkara.nomorPerkara ?? (
                      <span className="text-amber-600 italic">Belum memiliki nomor perkara</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Jenis Perkara</div>
                  <div>{JENIS_PERKARA_LABEL[perkara.jenisPerkara]} Online</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Klasifikasi</div>
                  <div>{perkara.klasifikasiPerkara ?? "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Pendaftar</div>
                  <div className="font-semibold">{perkara.pendaftarNama}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tanggal Daftar</div>
                  <div>{new Date(perkara.createdAt).toLocaleString("id-ID")}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Pengadilan</div>
                  <div>{perkara.pengadilanNama}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Barcode</div>
                  <div className="font-mono">{perkara.barcode}</div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Ringkasan Gugatan</div>
                <p className="text-sm">{perkara.gugatanRingkas ?? "-"}</p>
              </div>
              {isAdmin && (
                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>Pendaftar:</strong> {perkara.pendaftarNama}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Para Pihak */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Para Pihak
              </CardTitle>
              {isAdmin && (
                <Button size="sm" variant="outline" onClick={() => toast.info("Fitur Tambah Pihak Intervensi - demo")}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Tambah Pihak Intervensi
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pihak.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline">{p.role}</Badge>
                      {p.jenis && <Badge variant="secondary" className="text-[10px]">{p.jenis}</Badge>}
                      {p.persetujuanElektronik && (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Setuju Elektronik
                        </Badge>
                      )}
                    </div>
                    <div className="font-semibold">{p.nama}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      KTP: {p.ktp} · {p.alamat}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.kecamatan}, {p.kabupaten}, {p.provinsi}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.email} · {p.telepon}
                    </div>
                    {p.advokatNama && (
                      <div className="mt-1 text-xs">
                        <span className="text-muted-foreground">Kuasa Hukum:</span>{" "}
                        <span className="font-semibold">{p.advokatNama}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pembayaran (e-Payment) */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Pembayaran (e-Payment)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">Virtual Account</div>
                  <div className="font-mono font-bold text-primary">{perkara.virtualAccount}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Panjar</div>
                  <div className="font-bold font-mono">Rp {perkara.totalPanjar.toLocaleString("id-ID")}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status Pembayaran</div>
                  <Badge variant="outline" className={PERKARA_STATUS_COLOR[perkara.status]}>
                    {perkara.tglPembayaran ? "Sudah Dibayar" : "Belum Dibayar"}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tanggal Pembayaran</div>
                  <div>
                    {perkara.tglPembayaran
                      ? new Date(perkara.tglPembayaran).toLocaleString("id-ID")
                      : "-"}
                  </div>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" variant="outline" onClick={() => toast.info("Cetak bukti pembayaran")}>
                    <Printer className="mr-2 h-4 w-4" />
                    Cetak Bukti
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info("Cek status pembayaran ke bank")}>
                    <Banknote className="mr-2 h-4 w-4" />
                    Cek Pembayaran
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* e-SKUM / Biaya Perkara */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />
                Biaya Perkara (e-SKUM)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-xs">No.</th>
                      <th className="text-left py-2 px-2 text-xs">Nama Biaya</th>
                      <th className="text-right py-2 px-2 text-xs">Nominal</th>
                      <th className="text-center py-2 px-2 text-xs">Kode</th>
                      <th className="text-right py-2 px-2 text-xs">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biayaDetail.map((b) => (
                      <tr key={b.id} className="border-b border-border">
                        <td className="py-2 px-2">{b.urutan}</td>
                        <td className="py-2 px-2">{b.namaBiaya}</td>
                        <td className="py-2 px-2 text-right">
                          {b.nominal === 0 ? (
                            <span className="text-xs italic text-muted-foreground">auto</span>
                          ) : (
                            `Rp ${b.nominal.toLocaleString("id-ID")}`
                          )}
                        </td>
                        <td className="py-2 px-2 text-center text-xs">
                          {b.kodePerkalian === 1 ? "-" : `x${b.kodePerkalian}`}
                        </td>
                        <td className="py-2 px-2 text-right font-mono">
                          Rp {b.subtotal.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-primary bg-primary/5">
                      <td colSpan={4} className="py-3 px-2 text-right font-bold">
                        TOTAL:
                      </td>
                      <td className="py-3 px-2 text-right font-bold font-mono text-primary">
                        Rp {perkara.totalPanjar.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Persetujuan Prinsipal */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Persetujuan Pihak Menggunakan Saluran Elektronik
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {perkara.persetujuanPrinsipal ? (
                <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Para pihak telah menyetujui untuk beracara secara elektronik
                    melalui aplikasi e-Court sesuai dengan Perma No. 3 Tahun 2018.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    Persetujuan prinsipal belum diberikan.
                  </AlertDescription>
                </Alert>
              )}
              {isAdmin && (
                <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.info("Download formulir persetujuan")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Formulir Persetujuan
                </Button>
              )}
            </CardContent>
          </Card>

          {/* e-Summons */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Panggilan Elektronik (e-Summons)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {perkara.tglPanggilan ? (
                <div className="space-y-2">
                  <Alert className="border-blue-300 bg-blue-50 text-blue-900">
                    <Bell className="h-4 w-4" />
                    <AlertDescription>
                      Panggilan elektronik telah dikirim kepada para pihak pada{" "}
                      <strong>
                        {new Date(perkara.tglPanggilan).toLocaleString("id-ID")}
                      </strong>{" "}
                      melalui email domisili elektronik.
                    </AlertDescription>
                  </Alert>
                  {isAdmin && (
                    <Button size="sm" variant="outline" onClick={() => toast.info("Kirim ulang panggilan via email")}>
                      <Send className="mr-2 h-4 w-4" />
                      Kirim Panggilan / Pemberitahuan
                    </Button>
                  )}
                  {isAdmin && (
                    <Button size="sm" variant="outline" onClick={() => toast.info("Cetak panggilan")}>
                      <Printer className="mr-2 h-4 w-4" />
                      Cetak Panggilan
                    </Button>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    Belum ada panggilan elektronik. Panggilan akan dikirim
                    setelah perkara terdaftar dengan Nomor Perkara.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Register Dialog */}
          {showRegisterDialog && (
            <Card className="border-primary/40">
              <CardHeader>
                <CardTitle className="font-heading text-base">Register Perkara di SIPP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertDescription className="text-xs">
                    Pendaftaran perkara ini akan diregister di Sistem Informasi
                    Penelusuran Perkara (SIPP) dan akan mendapatkan Nomor Perkara
                    resmi. Panjar perkara akan terisi otomatis sesuai taksiran
                    panjar biaya perkara.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label>Nomor Perkara *</Label>
                  <Input
                    value={nomorPerkaraInput}
                    onChange={(e) => setNomorPerkaraInput(e.target.value)}
                    placeholder="contoh: 125/Pdt.G/2024/PN.Jkt.Pst"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: [No]/[Kode Jenis]/[Tahun]/[Kode Pengadilan]
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowRegisterDialog(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleRegister}>Register & Kirim Notifikasi</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ==================== TAB PERSIDANGAN ==================== */}
        <TabsContent value="persidangan" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Gavel className="h-4 w-4 text-primary" />
                History Persidangan (e-Litigasi)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {perkara.status === "MENUNGGU_PEMBAYARAN" || perkara.status === "DIBAYAR" || perkara.status === "DRAFT" ? (
                <Alert>
                  <AlertDescription>
                    Belum ada persidangan. Persidangan akan dijadwalkan setelah
                    perkara terdaftar dengan Nomor Perkara.
                  </AlertDescription>
                </Alert>
              ) : sidang.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Sidang pertama dijadwalkan pada{" "}
                    {perkara.tglSidangPertama
                      ? new Date(perkara.tglSidangPertama).toLocaleString("id-ID")
                      : "(belum ditentukan)"}
                    .
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {sidang.map((s, idx) => (
                    <div key={s.id} className="relative pl-6">
                      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                      {idx < sidang.length - 1 && (
                        <div className="absolute left-[5px] top-4 bottom-0 w-0.5 bg-border" />
                      )}
                      <div className="rounded-lg border border-border p-3">
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                          <Badge variant="outline">Sidang ke-{s.urutan}</Badge>
                          <Badge variant="secondary">{s.agenda}</Badge>
                          <Badge
                            className={
                              s.status === "SELESAI"
                                ? "bg-emerald-100 text-emerald-800"
                                : s.status === "DITUNDA"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {s.status}
                          </Badge>
                        </div>
                        <div className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(s.tanggal).toLocaleString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })} WIB
                        </div>
                        {s.keterangan && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {s.keterangan}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Dokumen Persidangan (e-Litigasi) */}
          {(isPendaftar || isHakim) && perkara.nomorPerkara && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-heading text-base flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  Upload Dokumen Persidangan (e-Litigasi)
                </CardTitle>
                {!showUploadForm && (
                  <Button size="sm" onClick={() => setShowUploadForm(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Dokumen
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertDescription className="text-xs">
                    Dokumen persidangan (Jawaban, Replik, Duplik, Kesimpulan)
                    dapat diupload oleh para pihak. Dokumen akan terkunci sampai
                    diverifikasi oleh Hakim.
                  </AlertDescription>
                </Alert>
                {showUploadForm && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Jenis Dokumen</Label>
                        <Select value={uploadJenis} onValueChange={(v) => setUploadJenis(v as DokumenJenis)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {litigasiJenis.map((j) => (
                              <SelectItem key={j} value={j}>{DOKUMEN_JENIS_LABEL[j]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>File (DOC/RTF/PDF)</Label>
                        <Input
                          type="file"
                          accept=".doc,.docx,.rtf,.pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setUploadFileName(f.name);
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowUploadForm(false)}>Batal</Button>
                      <Button onClick={handleUploadDokumen}>Upload</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Salinan Putusan */}
          {perkara.status === "PUTUS" && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Salinan Putusan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Tanggal Putusan</div>
                    <div className="font-semibold">
                      {perkara.tglPutusan
                        ? new Date(perkara.tglPutusan).toLocaleString("id-ID")
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">File Salinan Putusan</div>
                    {perkara.salinanPutusanUrl ? (
                      <Button size="sm" variant="outline" onClick={() => toast.info("Download salinan putusan")}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Putusan
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">Belum ada</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ==================== TAB DOKUMEN ==================== */}
        <TabsContent value="dokumen" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-primary" />
                Daftar Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-3">
                <AlertDescription className="text-xs">
                  Status dokumen dibagi menjadi dua: <strong>Terkunci</strong>{" "}
                  (belum diverifikasi Hakim, tidak bisa diakses pihak lawan) dan{" "}
                  <strong>Terbuka</strong> (sudah diverifikasi, dapat diakses
                  pihak lawan).
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                {dokumen.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-lg border border-border p-3 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <FileText className="h-8 w-8 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline">{DOKUMEN_JENIS_LABEL[d.jenis]}</Badge>
                          <Badge
                            className={
                              d.status === "TERBUKA"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            }
                          >
                            {d.status === "TERBUKA" ? (
                              <>
                                <Unlock className="mr-1 h-3 w-3" />
                                Terbuka
                              </>
                            ) : (
                              <>
                                <Lock className="mr-1 h-3 w-3" />
                                Terkunci
                              </>
                            )}
                          </Badge>
                        </div>
                        <div className="font-medium text-sm truncate">{d.nama}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {d.fileName} · {(d.fileSize / 1024).toFixed(0)} KB ·{" "}
                          {new Date(d.createdAt).toLocaleDateString("id-ID")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Diupload oleh: {d.uploaderNama}
                        </div>
                        {d.verifiedAt && (
                          <div className="text-xs text-emerald-600 mt-1">
                            Diverifikasi pada {new Date(d.verifiedAt).toLocaleString("id-ID")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      {d.status === "TERBUKA" ? (
                        <Button size="sm" variant="outline" onClick={() => toast.info(`Membuka ${d.fileName}`)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Lihat</span>
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled>
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                      {canVerifyDokumen && d.status === "TERKUNCI" && (
                        <Button size="sm" onClick={() => handleVerifyDokumen(d.id)}>
                          <CheckCircle2 className="h-4 w-4" />
                          Verifikasi
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
