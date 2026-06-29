import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "e-Court Mahkamah Agung | Sistem Peradilan Elektronik",
  description:
    "e-Court adalah aplikasi pelayanan peradilan elektronik Mahkamah Agung RI untuk pendaftaran perkara online (e-Filing), pembayaran panjar biaya (e-Payment), pemanggilan elektronik (e-Summons), dan persidangan elektronik (e-Litigasi).",
  keywords: [
    "e-Court",
    "Mahkamah Agung",
    "Peradilan Elektronik",
    "e-Filing",
    "e-Payment",
    "e-Summons",
    "e-Litigasi",
    "Perkara Online",
  ],
  authors: [{ name: "Mahkamah Agung RI" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
