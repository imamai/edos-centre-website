"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, LogOut, User, Bell } from "lucide-react";
import { Toaster } from "sonner";
import Sidebar from "@/components/admin/Sidebar";
import { logoutAction } from "@/lib/admin/actions/auth-actions";
import type { AdminUserRow } from "@/types/database.types";

export default function AdminShell({
  adminUser,
  unreadCount = 0,
  children,
}: {
  adminUser: AdminUserRow;
  unreadCount?: number;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Toaster richColors position="top-right" />

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar unreadCount={unreadCount} />
      </div>

      {/* Mobile sidebar drawer */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Sidebar unreadCount={unreadCount} onNavigate={() => setMobileOpen(false)} />
            <Dialog.Close className="absolute right-3 top-3 text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-slate-500 hover:text-slate-800 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden text-sm text-slate-400 lg:block">EDOS Centre</div>

          <div className="flex items-center gap-4">
            <Link href="/admin/notifications" className="relative text-slate-500 hover:text-slate-800" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <div className="hidden items-center gap-2 text-sm text-slate-600 sm:flex">
              <User className="h-4 w-4" />
              <span>{adminUser.full_name ?? adminUser.email}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                {adminUser.role.replace("_", " ")}
              </span>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
