import Image from "next/image";

export default function EdosLogoMark({ dark }: { dark: boolean }) {
  return (
    <div className="h-12 overflow-hidden">
      <Image
        src="/EDOS-LOGOty-1.png"
        alt="Edos Centre"
        width={300}
        height={100}
        className={`h-[72px] w-auto ${dark ? "mix-blend-multiply" : "brightness-0 invert"}`}
        priority
      />
    </div>
  );
}
