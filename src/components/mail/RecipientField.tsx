"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export default function RecipientField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const tokens = raw
      .split(/[,;]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tokens.length === 0) return;
    const next = [...value];
    for (const token of tokens) {
      if (!next.some((a) => a.toLowerCase() === token.toLowerCase())) {
        next.push(token);
      }
    }
    onChange(next);
    setInput("");
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b py-2">
      <span className="w-14 shrink-0 text-xs uppercase tracking-wide text-stone-500">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {value.map((addr, i) => {
          const valid = isValidEmail(addr);
          return (
            <span
              key={`${addr}-${i}`}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                valid
                  ? "border-stone-200 bg-stone-50 text-stone-700"
                  : "border-red-300 bg-red-50 text-red-700"
              )}
              title={valid ? addr : "Dirección no válida"}
            >
              <span className="max-w-48 truncate">{addr}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={disabled}
                aria-label={`Quitar ${addr}`}
                className="text-stone-400 hover:text-red-600 disabled:opacity-40"
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          value={input}
          disabled={disabled}
          onChange={(e) => {
            const v = e.target.value;
            if (/[,;]/.test(v)) commit(v);
            else setInput(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(input);
            } else if (e.key === "Backspace" && !input && value.length > 0) {
              e.preventDefault();
              remove(value.length - 1);
            }
          }}
          onBlur={() => commit(input)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-40 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400 disabled:opacity-60"
        />
      </div>
    </div>
  );
}
