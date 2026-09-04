import { ShieldAlert, Wrench, Mail } from "lucide-react";
import EdosLogoMark from "@/components/ui/EdosLogoMark";

export default function SiteStatusNotice({
  status,
  message,
  returnAt,
}: {
  status: "suspended" | "maintenance";
  message: string | null;
  returnAt: string | null;
}) {
  const isMaintenance = status === "maintenance";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1A1733] px-4 py-16 text-center">
      <EdosLogoMark dark={false} />
      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
        {isMaintenance ? <Wrench className="h-7 w-7 text-white" /> : <ShieldAlert className="h-7 w-7 text-white" />}
      </div>
      <h1 className="mt-6 text-3xl font-bold text-white">{isMaintenance ? "Website Maintenance" : "Site Unavailable"}</h1>
      <p className="mt-3 max-w-md text-slate-300">
        {message ??
          (isMaintenance
            ? "We are currently performing scheduled maintenance. Please check back shortly."
            : "This site is temporarily unavailable. Please check back later.")}
      </p>
      {returnAt && (
        <p className="mt-2 text-sm text-slate-400">Expected back: {new Date(returnAt).toLocaleString()}</p>
      )}
      <a href="mailto:info@edoscentre.co.ke" className="mt-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <Mail className="h-4 w-4" /> info@edoscentre.co.ke
      </a>
    </div>
  );
}
