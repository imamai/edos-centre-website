import { redirect } from "next/navigation";
import { getPortalUser } from "@/lib/portal/auth";
import PortalChangePasswordForm from "@/components/portal/PortalChangePasswordForm";
import EdosLogoMark from "@/components/ui/EdosLogoMark";

export const metadata = { title: "Change password — EDOS Client Portal", robots: { index: false, follow: false } };

export default async function PortalChangePasswordPage() {
  const portalUser = await getPortalUser();
  if (!portalUser?.is_active) redirect("/portal/login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1733] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <EdosLogoMark dark={false} />
          <h1 className="mt-6 text-2xl font-bold text-white">Set a new password</h1>
          <p className="mt-2 text-sm text-slate-300">
            {portalUser.must_change_password ? "Your account requires a password change before continuing." : "Update your account password."}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <PortalChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
