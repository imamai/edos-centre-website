import { redirect } from "next/navigation";
import { getPortalUser } from "@/lib/portal/auth";
import PortalLoginForm from "@/components/portal/PortalLoginForm";
import EdosLogoMark from "@/components/ui/EdosLogoMark";

export const metadata = { title: "Sign in — EDOS Client Portal", robots: { index: false, follow: false } };

export default async function PortalLoginPage() {
  const portalUser = await getPortalUser();
  if (portalUser?.is_active) {
    redirect(portalUser.must_change_password ? "/portal/change-password" : "/portal");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1733] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <EdosLogoMark dark={false} />
          <h1 className="mt-6 text-2xl font-bold text-white">Client Portal</h1>
          <p className="mt-2 text-sm text-slate-300">View your invoices, payments and website status</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <PortalLoginForm />
        </div>
      </div>
    </div>
  );
}
