"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  color?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary",
  onClick,
}: StatCardProps) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
    danger: "bg-rose-100 text-rose-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <Card
      className={cn(
        "transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold font-heading">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                "ml-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                colorMap[color]
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoPerkaraCardProps {
  title: string;
  stats: Array<{
    label: string;
    value: number;
    color?: string;
    onClick?: () => void;
  }>;
  total: number;
}

export function InfoPerkaraCard({ title, stats, total }: InfoPerkaraCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-foreground">
            {title}
          </h3>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-lg font-bold text-primary">{total}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={s.onClick}
              disabled={!s.onClick}
              className={cn(
                "rounded-lg border border-border bg-secondary/30 p-2 text-left transition-colors",
                s.onClick && "hover:bg-secondary/60 hover:border-primary/30"
              )}
            >
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div
                className={cn(
                  "text-xl font-bold",
                  s.color === "success" && "text-emerald-600",
                  s.color === "warning" && "text-amber-600",
                  s.color === "info" && "text-blue-600",
                  s.color === "danger" && "text-rose-600",
                  (!s.color || s.color === "default") && "text-foreground"
                )}
              >
                {s.value}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
