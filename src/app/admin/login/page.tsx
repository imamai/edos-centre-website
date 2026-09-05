import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import LoginForm from "@/components/admin/LoginForm";
import EdosLogoMark from "@/components/ui/EdosLogoMark";

export const metadata = { title: "Sign in — EDOS Control Centre", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const adminUser = await getAdminUser();
  if (adminUser?.is_active) {
    redirect(adminUser.must_change_password ? "/admin/change-password" : "/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1733] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <EdosLogoMark dark={false} />
          <h1 className="mt-6 text-2xl font-bold text-white">EDOS Control Centre</h1>
          <p className="mt-2 text-sm text-slate-300">Secure administration &amp; digital operations</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
