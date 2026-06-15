import Image from "next/image";

export default function EdosLogoMark({ dark }: { dark: boolean }) {
  return (
    <div className={dark ? "" : "rounded-xl overflow-hidden bg-white p-1 shadow-sm"}>
      <Image
        src="/logo.png"
        alt="Edos Centre"
        width={120}
        height={120}
        className="h-10 w-auto"
        priority
      />
    </div>
  );
}
