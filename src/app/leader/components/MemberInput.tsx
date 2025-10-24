'use client'
import React, { useRef, useState } from "react";

export type MembersInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
};

export const MembersInput: React.FC<MembersInputProps> = ({
  value,
  onChange,
  placeholder = "Digite um nome e aperte Enter ou clique em +",
  className,
}) => {
  const [draft, setDraft] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const normalize = (s: string): string =>
    s.normalize("NFKC").trim().replace(/\s+/g, " ");

  const addOne = (name: string): void => {
    const n = normalize(name);
    if (!n) return;

    const has = value.some((v) => v.toLowerCase() === n.toLowerCase());
    if (has) return;

    onChange([...value, n]);
    setDraft("");
    inputRef.current?.focus();
  };

  const addMany = (chunk: string): void => {
    // aceita vírgula, ponto e vírgula, pipes, quebras de linha e tabs
    const parts = chunk.split(/[\n\r,;|\t|]+/).map(normalize).filter(Boolean);
    if (!parts.length) return;

    const existing = new Set(value.map((v) => v.toLowerCase()));
    const incoming: string[] = [];

    for (const p of parts) {
      const low = p.toLowerCase();
      if (!existing.has(low)) {
        incoming.push(p);
        existing.add(low);
      }
    }

    if (incoming.length) onChange([...value, ...incoming]);
    setDraft("");
  };

  const handleAdd = (): void => {
    if (!draft) return;
    /[\n\r,;|\t|]/.test(draft) ? addMany(draft) : addOne(draft);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const removeAt = (i: number): void => {
    onChange(value.filter((_, idx) => idx !== i));
    inputRef.current?.focus();
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (/[\n\r,;|\t|]/.test(text)) {
              e.preventDefault();
              addMany(text);
            }
          }}
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg border px-3 py-2"
          disabled={!draft}
          aria-label="Adicionar participante"
          title="Adicionar participante"
        >
          +
        </button>
      </div>

      {value.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {value.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
            >
              <span className="text-sm">{name}</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="text-xs text-gray-600 hover:text-red-600"
                aria-label={`Remover ${name}`}
                title="Remover"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};