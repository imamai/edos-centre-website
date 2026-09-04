"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select } from "@/components/admin/ui/Input";

export default function StatusSelect({
  id,
  status,
  options,
  onChange,
}: {
  id: string;
  status: string;
  options: string[];
  onChange: (id: string, status: string) => Promise<void>;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        setValue(next);
        startTransition(async () => {
          try {
            await onChange(id, next);
            router.refresh();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Unable to update status.");
            setValue(status);
          }
        });
      }}
      className="w-32 py-1.5 text-xs"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </Select>
  );
}
