"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import {
  JENIS_PERKARA_LABEL,
  type JenisPerkara,
  type PihakRole,
  type JenisInsidentil,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Building2,
  Upload,
  X,
  Plus,
  Trash2,
  Info,
  Receipt,
  CreditCard,
  CheckCircle2,
  Banknote,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";

// =================== STEP 0: JENIS PERKARA ===================
export function SelectJenisPerkara({
  value,
  onChange,
}: {
  value: JenisPerkara | null;
  onChange: (v: JenisPerkara) => void;
}) {
  const options: Array<{ value: JenisPerkara; desc: string; icon: string }> = [
    { value: "GUGATAN", desc: "Gugatan perdata umum (sengketa, wanprestasi, dll.)", icon: "⚖️" },
    { value: "BANTAHAN", desc: "Bantahan atas putusan atau penetapan", icon: "📝" },
    { value: "GUGATAN_SEDERHANA", desc: "Gugatan sederhana nilai sengketa kecil", icon: "📋" },
    { value: "PERMOHONAN", desc: "Permohonan (pengangkatan anak, warisan, dll.)", icon: "📨" },
  ];
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Pilih jenis perkara yang akan didaftarkan. Jenis perkara menentukan
          komponen biaya panjar yang akan diterapkan.
        </AlertDescription>
      </Alert>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              value === opt.value
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{opt.icon}</div>
              <div className="flex-1">
                <div className="font-heading font-bold">{JENIS_PERKARA_LABEL[opt.value]}</div>
                <div className="text-sm text-muted-foreground mt-1">{opt.desc}</div>
              </div>
              {value === opt.value && (
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =================== STEP 1: PILIH PENGADILAN ===================
export function PilihPengadilan({
  pengadilanId,
  setPengadilanId,
  setujuSyarat,
  setSetujuSyarat,
}: {
  pengadilanId: string;
  setPengadilanId: (v: string) => void;
  setujuSyarat: boolean;
  setSetujuSyarat: (v: boolean) => void;
}) {
  const pengadilan = useAppStore((s) => s.pengadilan);
  const selected = pengadilan.find((p) => p.id === pengadilanId);

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Pilih pengadilan tempat mendaftarkan perkara. Hanya pengadilan yang
          sudah membuka layanan e-Court yang ditampilkan.
        </AlertDescription>
      </Alert>
      <div className="space-y-2">
        <Label>Pengadilan Tujuan *</Label>
        <Select value={pengadilanId} onValueChange={setPengadilanId}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih pengadilan" />
          </SelectTrigger>
          <SelectContent>
            {pengadilan
              .filter((p) => p.aktif && p.tingkat === "PERTAMA")
              .map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex flex-col">
                    <span>{p.nama}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.kota} · {p.jenis}
                    </span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {selected && (
        <Card className="bg-secondary/30">
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Kode Pengadilan</div>
                <div className="font-mono font-semibold">{selected.kode}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Tingkat</div>
                <div className="font-semibold">{selected.tingkat}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Jenis</div>
                <div className="font-semibold">{selected.jenis}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Telepon</div>
                <div className="font-semibold">{selected.telepon}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Alamat</div>
              <div>{selected.alamat}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Bank</div>
              <div>
                {selected.bankNama} · {selected.bankNoRek} ({selected.bankAtasNama})
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="border-primary/30 bg-primary/5">
        <AlertDescription className="text-sm">
          <strong>Syarat & Ketentuan Pendaftaran Online:</strong>
          <ul className="mt-2 space-y-1 text-xs list-disc pl-4">
            <li>Saya menyatakan data yang saya isi adalah benar dan dapat dipertanggungjawabkan.</li>
            <li>Saya setuju untuk beracara secara elektronik melalui aplikasi e-Court.</li>
            <li>Saya menyetujui biaya panjar yang akan dihitung otomatis oleh sistem.</li>
            <li>Pendaftaran akan mendapatkan Nomor Register Online (bukan Nomor Perkara).</li>
            <li>Nomor Perkara akan diberikan setelah pembayaran dan verifikasi oleh Pengadilan.</li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className="flex items-start gap-2">
        <Checkbox
          id="setujuSyarat"
          checked={setujuSyarat}
          onCheckedChange={(c) => setSetujuSyarat(c === true)}
        />
        <Label htmlFor="setujuSyarat" className="text-sm font-normal">
          Saya telah membaca, memahami, dan menyetujui syarat & ketentuan
          pendaftaran perkara online melalui e-Court.
        </Label>
      </div>
    </div>
  );
}

// =================== STEP 2: SURAT KUASA ===================
interface DokumenFormData {
  jenis: string;
  nama: string;
  fileName: string;
  fileType: string;
}

export function SuratKuasaStep({
  suratKuasa,
  setSuratKuasa,
  isAdvokat,
}: {
  suratKuasa: DokumenFormData | null;
  setSuratKuasa: (d: DokumenFormData | null) => void;
  isAdvokat: boolean;
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
    setSuratKuasa({
      jenis: "SURAT_KUASA",
      nama: "Surat Kuasa",
      fileName: file.name,
      fileType: ext,
    });
    toast.success("Surat Kuasa berhasil diupload");
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Upload Surat Kuasa dari klien kepada Anda sebagai Advokat. Untuk
          Pengguna Insidentil yang beracara sendiri, upload surat pernyataan
          beracara sendiri.
        </AlertDescription>
      </Alert>
      {isAdvokat && (
        <Alert className="border-primary/30 bg-primary/5">
          <AlertDescription className="text-xs">
            <strong>Catatan:</strong> Dokumen lain seperti Berita Acara Sumpah,
            KTP, dan KTA Advokat tidak perlu dicantumkan lagi karena sudah
            terlampir otomatis setiap pendaftaran perkara (sudah didaftarkan
            saat registrasi akun).
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label>Upload Surat Kuasa (PDF/DOC/RTF) *</Label>
        <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
          <input
            type="file"
            id="suratKuasa"
            accept=".pdf,.doc,.docx,.rtf"
            onChange={handleFile}
            className="hidden"
          />
          {suratKuasa ? (
            <div className="flex items-center justify-between gap-3 bg-secondary/50 rounded-md p-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-8 w-8 text-primary shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-medium text-sm truncate">{suratKuasa.fileName}</div>
                  <div className="text-xs text-muted-foreground uppercase">{suratKuasa.fileType}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSuratKuasa(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label htmlFor="suratKuasa" className="cursor-pointer">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <div className="mt-2 text-sm font-medium">Klik untuk upload Surat Kuasa</div>
              <div className="text-xs text-muted-foreground">
                Format: PDF, DOC, RTF (Maks. 5MB)
              </div>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

// =================== STEP 3: DATA PIHAK ===================
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

const PROVINSI_LIST = ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten", "DI Yogyakarta"];
const KABUPATEN_MAP: Record<string, string[]> = {
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara"],
  "Jawa Barat": ["Bekasi", "Bandung", "Bogor", "Depok"],
  "Jawa Tengah": ["Semarang", "Solo", "Magelang"],
  "Jawa Timur": ["Surabaya", "Mojokerto", "Malang"],
  "Banten": ["Tangerang", "Serang"],
  "DI Yogyakarta": ["Yogyakarta", "Sleman", "Bantul"],
};
const KECAMATAN_DEMO = ["Menteng", "Cempaka Putih", "Senen", "Kemayoran", "Johar Baru", "Sawah Besar"];

export function DataPihakStep({
  pihakList,
  setPihakList,
}: {
  pihakList: PihakFormData[];
  setPihakList: (list: PihakFormData[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<PihakFormData>({
    role: "PENGUGAT",
    nama: "",
    ktp: "",
    alamat: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    email: "",
    telepon: "",
    jenis: "PERSEORANGAN",
  });

  const resetForm = () => {
    setForm({
      role: "PENGUGAT",
      nama: "",
      ktp: "",
      alamat: "",
      provinsi: "",
      kabupaten: "",
      kecamatan: "",
      email: "",
      telepon: "",
      jenis: "PERSEORANGAN",
    });
    setEditIdx(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.nama || !form.alamat || !form.ktp) {
      toast.error("Lengkapi data wajib (Nama, KTP, Alamat)");
      return;
    }
    if (editIdx !== null) {
      const newList = [...pihakList];
      newList[editIdx] = form;
      setPihakList(newList);
    } else {
      setPihakList([...pihakList, form]);
    }
    toast.success("Data pihak tersimpan");
    resetForm();
  };

  const handleEdit = (idx: number) => {
    setForm(pihakList[idx]);
    setEditIdx(idx);
    setShowForm(true);
  };

  const handleDelete = (idx: number) => {
    setPihakList(pihakList.filter((_, i) => i !== idx));
    toast.success("Pihak dihapus");
  };

  const roleLabel: Record<PihakRole, string> = {
    PENGUGAT: "Penggugat",
    TERGUGAT: "Tergugat",
    TURUT_TERGUGAT: "Turut Tergugat",
    PIHAK_INTERVENSI: "Pihak Intervensi",
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Tambahkan data para pihak yang berperkara. Minimal harus ada 1
          Penggugat dan 1 Tergugat. Alamat lengkap (Provinsi, Kabupaten,
          Kecamatan) diperlukan untuk perhitungan biaya panggilan berdasarkan
          radius.
        </AlertDescription>
      </Alert>

      {/* List existing pihak */}
      {pihakList.length > 0 && (
        <div className="space-y-2">
          {pihakList.map((p, idx) => (
            <Card key={idx}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline">{roleLabel[p.role]}</Badge>
                      {p.jenis && (
                        <Badge variant="secondary" className="text-[10px]">
                          {p.jenis}
                        </Badge>
                      )}
                    </div>
                    <div className="font-semibold text-sm">{p.nama}</div>
                    <div className="text-xs text-muted-foreground">
                      KTP: {p.ktp} · {p.alamat}, {p.kecamatan}, {p.kabupaten}, {p.provinsi}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.email} · {p.telepon}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(idx)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(idx)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm ? (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-semibold">
                {editIdx !== null ? "Edit" : "Tambah"} Pihak
              </h4>
              <Button size="sm" variant="ghost" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Peran *</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v as PihakRole })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENGUGAT">Penggugat</SelectItem>
                    <SelectItem value="TERGUGAT">Tergugat</SelectItem>
                    <SelectItem value="TURUT_TERGUGAT">Turut Tergugat</SelectItem>
                    <SelectItem value="PIHAK_INTERVENSI">Pihak Intervensi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jenis Pihak</Label>
                <Select
                  value={form.jenis}
                  onValueChange={(v) => setForm({ ...form, jenis: v as JenisInsidentil })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERSEORANGAN">Perseorangan</SelectItem>
                    <SelectItem value="PEMERINTAHAN">Pemerintahan</SelectItem>
                    <SelectItem value="BADAN_HUKUM">Badan Hukum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nama Lengkap *</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama lengkap pihak"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>No KTP / NIK / NPWP *</Label>
                <Input
                  value={form.ktp}
                  onChange={(e) => setForm({ ...form, ktp: e.target.value })}
                  placeholder="contoh: 01.234.567.8-901.0000"
                />
              </div>
              <div className="space-y-2">
                <Label>Telepon</Label>
                <Input
                  value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alamat Lengkap *</Label>
              <Textarea
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                placeholder="Jalan, nomor, RT/RW"
                rows={2}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Provinsi *</Label>
                <Select
                  value={form.provinsi}
                  onValueChange={(v) => setForm({ ...form, provinsi: v, kabupaten: "", kecamatan: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINSI_LIST.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kabupaten/Kota *</Label>
                <Select
                  value={form.kabupaten}
                  onValueChange={(v) => setForm({ ...form, kabupaten: v, kecamatan: "" })}
                  disabled={!form.provinsi}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kabupaten" />
                  </SelectTrigger>
                  <SelectContent>
                    {(KABUPATEN_MAP[form.provinsi] ?? []).map((k) => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kecamatan *</Label>
                <Select
                  value={form.kecamatan}
                  onValueChange={(v) => setForm({ ...form, kecamatan: v })}
                  disabled={!form.kabupaten}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {KECAMATAN_DEMO.map((k) => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email (Domisili Elektronik)</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@contoh.com"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Batal</Button>
              <Button onClick={handleSave}>Simpan Pihak</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pihak
        </Button>
      )}

      {pihakList.length < 2 && (
        <Alert variant="destructive">
          <AlertDescription>
            Minimal harus ada 1 Penggugat dan 1 Tergugat. Saat ini ada{" "}
            {pihakList.filter((p) => p.role === "PENGUGAT").length} Penggugat dan{" "}
            {pihakList.filter((p) => p.role === "TERGUGAT").length} Tergugat.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// =================== STEP 4: UPLOAD BERKAS ===================
export function UploadBerkasStep({
  gugatanRingkas,
  setGugatanRingkas,
  klasifikasiPerkara,
  setKlasifikasiPerkara,
  dokumenGugatan,
  setDokumenGugatan,
  persetujuanPrinsipal,
  setPersetujuanPrinsipal,
  persetujuanPrinsipalFile,
  setPersetujuanPrinsipalFile,
}: {
  gugatanRingkas: string;
  setGugatanRingkas: (v: string) => void;
  klasifikasiPerkara: string;
  setKlasifikasiPerkara: (v: string) => void;
  dokumenGugatan: DokumenFormData | null;
  setDokumenGugatan: (d: DokumenFormData | null) => void;
  persetujuanPrinsipal: boolean;
  setPersetujuanPrinsipal: (v: boolean) => void;
  persetujuanPrinsipalFile: DokumenFormData | null;
  setPersetujuanPrinsipalFile: (d: DokumenFormData | null) => void;
}) {
  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (d: DokumenFormData | null) => void,
    jenis: string,
    nama: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
    setter({ jenis, nama, fileName: file.name, fileType: ext });
    toast.success(`${nama} berhasil diupload`);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Lengkapi dokumen gugatan dan persetujuan prinsipal untuk beracara
          secara elektronik.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label>Klasifikasi Perkara (Posisi)</Label>
        <Input
          value={klasifikasiPerkara}
          onChange={(e) => setKlasifikasiPerkara(e.target.value)}
          placeholder="contoh: Perdata Umum - Wanprestasi"
        />
      </div>

      <div className="space-y-2">
        <Label>Ringkasan Gugatan/Permohonan *</Label>
        <Textarea
          value={gugatanRingkas}
          onChange={(e) => setGugatanRingkas(e.target.value)}
          placeholder="Jelaskan secara singkat posita dan petitum gugatan..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Berkas Gugatan (PDF/DOC/RTF) *</Label>
        <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
          <input
            type="file"
            id="dokumenGugatan"
            accept=".pdf,.doc,.docx,.rtf"
            onChange={(e) => handleFile(e, setDokumenGugatan, "GUGATAN", "Berkas Gugatan")}
            className="hidden"
          />
          {dokumenGugatan ? (
            <div className="flex items-center justify-between gap-3 bg-secondary/50 rounded-md p-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-8 w-8 text-primary shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-medium text-sm truncate">{dokumenGugatan.fileName}</div>
                  <div className="text-xs text-muted-foreground uppercase">{dokumenGugatan.fileType}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDokumenGugatan(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label htmlFor="dokumenGugatan" className="cursor-pointer">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <div className="mt-2 text-sm font-medium">Klik untuk upload Berkas Gugatan</div>
              <div className="text-xs text-muted-foreground">Format: PDF, DOC, RTF</div>
            </label>
          )}
        </div>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <Checkbox
              id="persetujuanPrinsipal"
              checked={persetujuanPrinsipal}
              onCheckedChange={(c) => setPersetujuanPrinsipal(c === true)}
            />
            <div className="flex-1">
              <Label htmlFor="persetujuanPrinsipal" className="text-sm font-semibold">
                Persetujuan Prinsipal Beracara Secara Elektronik *
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Saya menyatakan setuju dan bersedia beracara secara elektronik
                melalui aplikasi e-Court sesuai dengan Perma No. 3 Tahun 2018.
              </p>
            </div>
          </div>
          {persetujuanPrinsipal && (
            <div className="space-y-2">
              <Label>Upload Form Persetujuan Prinsipal (PDF) *</Label>
              <div className="rounded-lg border-2 border-dashed border-border p-4 text-center bg-background">
                <input
                  type="file"
                  id="persetujuanPrinsipalFile"
                  accept=".pdf"
                  onChange={(e) => handleFile(e, setPersetujuanPrinsipalFile, "PERSETUJUAN_PRINSIPAL", "Persetujuan Prinsipal")}
                  className="hidden"
                />
                {persetujuanPrinsipalFile ? (
                  <div className="flex items-center justify-between gap-3 bg-secondary/50 rounded-md p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-6 w-6 text-primary shrink-0" />
                      <div className="text-left min-w-0">
                        <div className="font-medium text-sm truncate">{persetujuanPrinsipalFile.fileName}</div>
                        <div className="text-xs text-muted-foreground">PDF</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setPersetujuanPrinsipalFile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="persetujuanPrinsipalFile" className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <div className="mt-1 text-sm">Klik untuk upload</div>
                  </label>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// =================== STEP 5: e-SKUM ===================
export function ESKUMStep({ perkaraId }: { perkaraId: string }) {
  const allPerkara = useAppStore((s) => s.perkara);
  const allBiayaDetail = useAppStore((s) => s.biayaDetail);
  const perkara = useMemo(
    () => allPerkara.find((p) => p.id === perkaraId),
    [allPerkara, perkaraId]
  );
  const biayaDetail = useMemo(
    () =>
      allBiayaDetail
        .filter((b) => b.perkaraId === perkaraId)
        .sort((a, b) => a.urutan - b.urutan),
    [allBiayaDetail, perkaraId]
  );

  if (!perkara) return null;

  return (
    <div className="space-y-4">
      <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          <strong>Pendaftaran berhasil dibuat!</strong> Berikut adalah
          elektronik SKUM (e-SKUM) yang di-generate otomatis oleh sistem
          berdasarkan komponen biaya panjar dan radius panggilan.
        </AlertDescription>
      </Alert>

      {/* e-SKUM Document */}
      <Card className="border-2 border-primary/30">
        <CardContent className="p-6 space-y-4">
          {/* Header SKUM */}
          <div className="text-center border-b-2 border-primary pb-3">
            <div className="text-xs text-muted-foreground uppercase">Fakultas Hukum Universitas Tulungagung</div>
            <h3 className="font-heading text-xl font-extrabold mt-1">
              {perkara.pengadilanNama}
            </h3>
            <div className="text-sm font-semibold mt-1">
              ELEKTRONIK SURAT KUASA UNTUK MENILAI (e-SKUM)
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Taksiran Biaya Panjar Perkara
            </div>
          </div>

          {/* Info Perkara */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Nomor Register Online</div>
              <div className="font-mono font-bold">{perkara.nomorRegisterOnline}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Barcode</div>
              <div className="font-mono">{perkara.barcode}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Jenis Perkara</div>
              <div className="font-semibold">{JENIS_PERKARA_LABEL[perkara.jenisPerkara]}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Tanggal</div>
              <div>{new Date(perkara.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Pendaftar</div>
              <div className="font-semibold">{perkara.pendaftarNama}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Pengadilan</div>
              <div className="font-semibold text-xs">{perkara.pengadilanNama}</div>
            </div>
          </div>

          {/* Detail Biaya */}
          <div>
            <div className="text-sm font-semibold mb-2">Komponen Biaya Panjar:</div>
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
                        <span className="text-xs text-muted-foreground italic">auto</span>
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
                    TOTAL PANJAR BIAYA PERKARA:
                  </td>
                  <td className="py-3 px-2 text-right font-bold font-mono text-primary text-base">
                    Rp {perkara.totalPanjar.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-xs text-muted-foreground italic">
            * Biaya panggilan dihitung otomatis berdasarkan radius domisili pihak
            (Penggugat x2, Tergugat x3) sesuai ketetapan Ketua Pengadilan.
            Apabila terdapat kekurangan/kelebihan biaya, akan diberikan tagihan
            tambahan atau pengembalian sesuai ketentuan.
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Receipt className="h-4 w-4" />
        <AlertDescription>
          <strong>Virtual Account:</strong> {perkara.virtualAccount}
          <br />
          Silakan lakukan pembayaran melalui Virtual Account di atas. Setelah
          pembayaran, status pendaftaran akan berubah menjadi "Sudah Dibayar"
          dan menunggu verifikasi Pengadilan untuk mendapatkan Nomor Perkara.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// =================== STEP 6: e-PAYMENT ===================
export function EPaymentStep({
  perkaraId,
  onPay,
}: {
  perkaraId: string;
  onPay: () => void;
}) {
  const allPerkara = useAppStore((s) => s.perkara);
  const perkara = useMemo(
    () => allPerkara.find((p) => p.id === perkaraId),
    [allPerkara, perkaraId]
  );
  const [method, setMethod] = useState<string>("va");

  if (!perkara) return null;

  const methods = [
    { id: "va", label: "Virtual Account (Bank)", icon: Banknote, desc: "Transfer via ATM/Internet Banking/Mobile Banking" },
    { id: "qr", label: "QRIS", icon: QrCode, desc: "Scan QR code dengan e-wallet apapun" },
    { id: "teller", label: "Teller Bank", icon: CreditCard, desc: "Bayar langsung di teller bank" },
  ];

  return (
    <div className="space-y-4">
      <Alert>
        <CreditCard className="h-4 w-4" />
        <AlertDescription>
          Lakukan pembayaran panjar biaya perkara untuk melanjutkan proses
          pendaftaran. Pembayaran dapat dilakukan melalui berbagai metode.
        </AlertDescription>
      </Alert>

      {/* VA Box */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase">Nomor Virtual Account</div>
            <div className="font-mono text-3xl font-bold text-primary mt-1 tracking-wider">
              {perkara.virtualAccount}
            </div>
            <div className="text-xs text-muted-foreground mt-2">a.n. {perkara.pengadilanNama}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm border-t border-border pt-3">
            <div>
              <div className="text-xs text-muted-foreground">Jumlah Dibayar</div>
              <div className="font-bold text-lg font-mono text-primary">
                Rp {perkara.totalPanjar.toLocaleString("id-ID")}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Berlaku Hingga</div>
              <div className="font-semibold">
                {new Date(Date.now() + 24 * 3600 * 1000).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })} WIB
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-2">
        <Label>Metode Pembayaran</Label>
        <div className="grid gap-2 md:grid-cols-3">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                method === m.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <m.icon className="h-6 w-6 text-primary mb-2" />
              <div className="font-semibold text-sm">{m.label}</div>
              <div className="text-xs text-muted-foreground">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <Alert className="border-amber-300 bg-amber-50 text-amber-900">
        <AlertDescription className="text-xs">
          <strong>Simulasi Pembayaran:</strong> Tombol di bawah ini akan
          mensimulasikan pembayaran berhasil. Pada implementasi nyata, ini
          terhubung dengan sistem perbankan untuk verifikasi otomatis.
        </AlertDescription>
      </Alert>

      <Button onClick={onPay} size="lg" className="w-full">
        <CheckCircle2 className="mr-2 h-5 w-5" />
        Bayar Sekarang (Simulasi)
      </Button>
    </div>
  );
}
