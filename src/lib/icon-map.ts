import {
  BarChart3, Cpu, Globe, LayoutDashboard, Smartphone, Monitor,
  ClipboardList, Activity, Link2, Building2, Heart, Landmark, Sprout, Leaf,
  GraduationCap, Users, Briefcase, Database, HardDrive, Brain, Box,
  TrendingUp, ShoppingBag,
  type LucideIcon,
} from "lucide-react";

/** Maps the `icon` string stored on a CMS row (set by an admin from a fixed list) to its component. */
export const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3, Cpu, Globe, LayoutDashboard, Smartphone, Monitor,
  ClipboardList, Activity, Link2, Building2, Heart, Landmark, Sprout, Leaf,
  GraduationCap, Users, Briefcase, Database, HardDrive, Brain,
  TrendingUp, ShoppingBag,
};

export function getIcon(name: string | null | undefined): LucideIcon {
  return (name && ICON_MAP[name]) || Box;
}

/** Accent colors aren't part of the CMS schema (a presentation choice, not content) — this keyed
 * lookup preserves each entity's original brand color; unrecognized slugs fall back to a default. */
const DEFAULT_ACCENT = "#2E234F";

export const SERVICE_ACCENT: Record<string, string> = {
  "data-analytics": "#E31E24",
  "data-engineering": "#E31E24",
  "saas-platforms": "#2E234F",
  "dashboard-development": "#6B5B95",
  "web-development": "#2E234F",
  "mobile-applications": "#2E234F",
  "desktop-systems": "#6B5B95",
  "questionnaire-digitization": "#6B5B95",
  "monitoring-evaluation": "#E31E24",
  "dhis2-integrations": "#E31E24",
};

export function getServiceAccent(slug: string): string {
  return SERVICE_ACCENT[slug] ?? DEFAULT_ACCENT;
}

export const INDUSTRY_ACCENT: Record<string, string> = {
  healthcare: "#E31E24",
  ngos: "#6B5B95",
  government: "#2E234F",
  education: "#f59e0b",
  agriculture: "#22c55e",
  "financial-services": "#f59e0b",
  retail: "#06b6d4",
};

export function getIndustryAccent(slug: string): string {
  return INDUSTRY_ACCENT[slug] ?? DEFAULT_ACCENT;
}
