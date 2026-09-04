export function Checkbox({
  id,
  name,
  value,
  defaultChecked,
  label,
}: {
  id: string;
  name: string;
  value?: string;
  defaultChecked?: boolean;
  label: string;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-slate-700">
      <input
        id={id}
        name={name}
        value={value}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-slate-300 text-[#1A1733] focus:ring-[#1A1733]/30"
      />
      {label}
    </label>
  );
}

export function formBool(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}
