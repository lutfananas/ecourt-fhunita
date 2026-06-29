"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  JENIS_PERKARA_LABEL,
  type JenisPerkara,
  type PihakRole,
  type JenisInsidentil,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SelectJenisPerkara,
  PilihPengadilan,
  SuratKuasaStep,
  DataPihakStep,
  UploadBerkasStep,
  ESKUMStep,
  EPaymentStep,
} from "./wizard-steps";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  FileUp,
  Receipt,
  CreditCard,
  Check,
  Info,
} from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  { id: 0, title: "Jenis Perkara", icon: Info },
  { id: 1, title: "Pilih Pengadilan", icon: Building2 },
  { id: 2, title: "Surat Kuasa", icon: FileUp },
  { id: 3, title: "Data Pihak", icon: Users },
  { id: 4, title: "Upload Berkas", icon: FileUp },
  { id: 5, title: "e-SKUM", icon: Receipt },
  { id: 6, title: "e-Payment", icon: CreditCard },
];

interface PihakFormData {
  role: PihakRole;
  nama: string;
  ktp: string;
  alamat: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  email: string;
  telepon: string;
  jenis: JenisInsidentil;
}

interface DokumenFormData {
  jenis: string;
  nama: string;
  fileName: string;
  fileType: string;
}

export function PendaftaranPerkara() {
  const currentUser = useAppStore((s) => s.currentUser);
  const createPerkara = useAppStore((s) => s.createPerkara);
  const payPerkara = useAppStore((s) => s.payPerkara);
  const selectPerkara = useAppStore((s) => s.selectPerkara);
  const setView = useAppStore((s) => s.setView);

  const [step, setStep] = useState(0);
  const [jenisPerkara, setJenisPerkara] = useState<JenisPerkara | null>(null);
  const [pengadilanId, setPengadilanId] = useState("");
  const [setujuSyarat, setSetujuSyarat] = useState(false);
  const [suratKuasa, setSuratKuasa] = useState<DokumenFormData | null>(null);
  const [pihakList, setPihakList] = useState<PihakFormData[]>([]);
  const [gugatanRingkas, setGugatanRingkas] = useState("");
  const [klasifikasiPerkara, setKlasifikasiPerkara] = useState("");
  const [dokumenGugatan, setDokumenGugatan] = useState<DokumenFormData | null>(null);
  const [persetujuanPrinsipal, setPersetujuanPrinsipal] = useState(false);
  const [persetujuanPrinsipalFile, setPersetujuanPrinsipalFile] = useState<DokumenFormData | null>(null);
  const [createdPerkaraId, setCreatedPerkaraId] = useState<string | null>(null);

  if (!currentUser) return null;

  const canRegister =
    currentUser.role === "ADVOKAT" || currentUser.role === "INSIDENTIL";
  if (!canRegister) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Hanya Pengguna Terdaftar (Advokat) dan Pengguna Insidentil yang
            dapat mendaftarkan perkara.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (currentUser.role === "ADVOKAT" && currentUser.status === "BELUM_VERIFIKASI") {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Akun Advokat Anda belum terverifikasi. Hubungi Pengadilan Tingkat
              Banding tempat Anda disumpah untuk verifikasi.
            </AlertDescription>
          </Alert>
          <Button onClick={() => setView("dashboard")}>Kembali ke Dashboard</Button>
        </CardContent>
      </Card>
    );
  }

  const handleNext = () => {
    if (step === 0 && !jenisPerkara) {
      toast.error("Pilih jenis perkara terlebih dahulu");
      return;
    }
    if (step === 1 && (!pengadilanId || !setujuSyarat)) {
      toast.error("Pilih pengadilan dan setujui syarat & ketentuan");
      return;
    }
    if (step === 2 && !suratKuasa) {
      toast.error("Upload Surat Kuasa terlebih dahulu");
      return;
    }
    if (step === 3 && pihakList.length < 2) {
      toast.error("Minimal harus ada 1 Penggugat dan 1 Tergugat");
      return;
    }
    if (step === 4 && (!dokumenGugatan || !persetujuanPrinsipal || !persetujuanPrinsipalFile)) {
      toast.error("Lengkapi upload berkas gugatan dan persetujuan prinsipal");
      return;
    }

    if (step === 4) {
      // Create perkara and move to e-SKUM
      const newId = createPerkara({
        jenisPerkara: jenisPerkara!,
        pengadilanId,
        gugatanRingkas,
        klasifikasiPerkara,
        persetujuanPrinsipal,
        pihak: pihakList.map((p) => ({
          role: p.role,
          nama: p.nama,
          ktp: p.ktp,
          alamat: p.alamat,
          provinsi: p.provinsi,
          kabupaten: p.kabupaten,
          kecamatan: p.kecamatan,
          email: p.email,
          telepon: p.telepon,
          jenis: p.jenis,
          advokatId: currentUser.role === "ADVOKAT" ? currentUser.id : undefined,
          advokatNama: currentUser.role === "ADVOKAT" ? currentUser.nama : undefined,
        })),
        dokumens: [
          {
            jenis: "SURAT_KUASA",
            nama: "Surat Kuasa",
            fileName: suratKuasa!.fileName,
            fileType: suratKuasa!.fileType,
            fileUrl: `/uploads/${suratKuasa!.fileName}`,
            fileSize: 250000,
          },
          {
            jenis: "GUGATAN",
            nama: dokumenGugatan!.nama,
            fileName: dokumenGugatan!.fileName,
            fileType: dokumenGugatan!.fileType,
            fileUrl: `/uploads/${dokumenGugatan!.fileName}`,
            fileSize: 500000,
          },
          {
            jenis: "PERSETUJUAN_PRINSIPAL",
            nama: "Persetujuan Prinsipal",
            fileName: persetujuanPrinsipalFile!.fileName,
            fileType: persetujuanPrinsipalFile!.fileType,
            fileUrl: `/uploads/${persetujuanPrinsipalFile!.fileName}`,
            fileSize: 150000,
          },
        ],
      });
      setCreatedPerkaraId(newId);
      setStep(5);
      toast.success("Pendaftaran berhasil dibuat!", {
        description: "e-SKUM telah di-generate. Lanjutkan ke pembayaran.",
      });
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePay = () => {
    if (!createdPerkaraId) return;
    payPerkara(createdPerkaraId);
    toast.success("Pembayaran berhasil!", {
      description: "Status pendaftaran berubah menjadi 'Sudah Dibayar'. Menunggu verifikasi pengadilan.",
    });
    selectPerkara(createdPerkaraId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold">Pendaftaran Perkara</h2>
          <p className="text-sm text-muted-foreground">
            {currentUser.role === "ADVOKAT"
              ? "Daftarkan perkara baru sebagai Advokat"
              : "Daftarkan perkara baru sebagai Pengguna Insidentil"}
          </p>
        </div>
        <Button variant="outline" onClick={() => setView("daftar-perkara")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Daftar Perkara
        </Button>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 min-w-fit">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                      step > s.id
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : step === s.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {step > s.id ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <s.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium text-center hidden md:block ${
                      step === s.id ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      step > s.id ? "bg-emerald-500" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg flex items-center gap-2">
            <Badge variant="outline">Step {step + 1} / {STEPS.length}</Badge>
            {STEPS[step].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <SelectJenisPerkara
              value={jenisPerkara}
              onChange={setJenisPerkara}
            />
          )}
          {step === 1 && (
            <PilihPengadilan
              pengadilanId={pengadilanId}
              setPengadilanId={setPengadilanId}
              setujuSyarat={setujuSyarat}
              setSetujuSyarat={setSetujuSyarat}
            />
          )}
          {step === 2 && (
            <SuratKuasaStep
              suratKuasa={suratKuasa}
              setSuratKuasa={setSuratKuasa}
              isAdvokat={currentUser.role === "ADVOKAT"}
            />
          )}
          {step === 3 && (
            <DataPihakStep
              pihakList={pihakList}
              setPihakList={setPihakList}
            />
          )}
          {step === 4 && (
            <UploadBerkasStep
              gugatanRingkas={gugatanRingkas}
              setGugatanRingkas={setGugatanRingkas}
              klasifikasiPerkara={klasifikasiPerkara}
              setKlasifikasiPerkara={setKlasifikasiPerkara}
              dokumenGugatan={dokumenGugatan}
              setDokumenGugatan={setDokumenGugatan}
              persetujuanPrinsipal={persetujuanPrinsipal}
              setPersetujuanPrinsipal={setPersetujuanPrinsipal}
              persetujuanPrinsipalFile={persetujuanPrinsipalFile}
              setPersetujuanPrinsipalFile={setPersetujuanPrinsipalFile}
            />
          )}
          {step === 5 && createdPerkaraId && (
            <ESKUMStep perkaraId={createdPerkaraId} />
          )}
          {step === 6 && createdPerkaraId && (
            <EPaymentStep perkaraId={createdPerkaraId} onPay={handlePay} />
          )}
        </CardContent>
        {step < 6 && (
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Sebelumnya
            </Button>
            <Button onClick={handleNext}>
              {step === 4 ? "Buat Pendaftaran & Generate e-SKUM" : "Lanjut"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
