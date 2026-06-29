"use client";

import { useAppStore } from "@/lib/store";
import { AppHeader } from "./app-header";
import { Sidebar } from "./sidebar";
import { Footer } from "./public-layout";

export function AppShell({ children }: { children: React.ReactNode }) {
  const currentUser = useAppStore((s) => s.currentUser);

  if (!currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Sidebar />
        </aside>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-secondary/20">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
