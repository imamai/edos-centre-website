import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import EdosLogoMark from "@/components/ui/EdosLogoMark";

export const metadata = { title: "Change password — EDOS Control Centre" };

export default async function ChangePasswordPage() {
  const adminUser = await getAdminUser();
  if (!adminUser?.is_active) redirect("/admin/login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1733] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <EdosLogoMark dark={false} />
          <h1 className="mt-6 text-2xl font-bold text-white">Set a new password</h1>
          <p className="mt-2 text-sm text-slate-300">
            {adminUser.must_change_password
              ? "Your administrator account requires a password change before continuing."
              : "Update your account password."}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
