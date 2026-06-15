import Image from "next/image";

export default function EdosLogoMark({ dark }: { dark: boolean }) {
  return (
    <div className={dark ? "" : "rounded-xl overflow-hidden bg-white px-2 py-1 shadow-sm"}>
      <Image
        src="/EDOS-LOGOty-1.png"
        alt="Edos Centre"
        width={300}
        height={100}
        className="h-10 w-auto"
        priority
      />
    </div>
  );
}
