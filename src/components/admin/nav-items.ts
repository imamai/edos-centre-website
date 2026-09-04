import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Globe, ScrollText, Users, Repeat, Receipt, Server, LifeBuoy, Settings } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Websites", href: "/admin/websites", icon: Globe },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Repeat },
  { label: "Invoices", href: "/admin/invoices", icon: Receipt },
  { label: "Hosting & Domains", href: "/admin/hosting", icon: Server },
  { label: "Activity Logs", href: "/admin/activity-logs", icon: ScrollText },
];

/** Sections planned for later phases — shown so the platform's shape is visible, but not wired to real functionality yet. */
export const COMING_SOON_ITEMS: NavItem[] = [
  { label: "Support", href: "#", icon: LifeBuoy },
  { label: "Settings", href: "#", icon: Settings },
];
