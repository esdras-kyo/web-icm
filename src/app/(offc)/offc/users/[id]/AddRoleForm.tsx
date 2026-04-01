"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, Check, Search } from "lucide-react";
import { addRoleAction } from "./rolesActions";

interface Dept {
  id: string;
  name: string;
}

interface Option {
  value: string;
  label: string;
}

const ROLE_OPTIONS: Option[] = [
  { value: "ADMIN", label: "Administrador" },
  { value: "LEADER", label: "Líder" },
  { value: "MEMBER", label: "Membro" },
];

const SCOPE_OPTIONS: Option[] = [
  { value: "ORG", label: "Organização" },
  { value: "DEPARTMENT", label: "Ministério" },
];

// ─── Base dropdown ────────────────────────────────────────────────────────────

function Dropdown({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-left cursor-pointer transition-colors hover:bg-white/8 focus:outline-none focus:ring-1 focus:ring-white/20"
      >
        <span className={selected ? "text-white" : "text-white/30"}>
          {selected?.label ?? placeholder ?? "Selecione..."}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                o.value === value
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/6 hover:text-white"
              }`}
            >
              {o.label}
              {o.value === value && <Check size={13} className="shrink-0 text-[#4d8bff]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dept dropdown (with search) ─────────────────────────────────────────────

function DeptCombobox({
  depts,
  value,
  onChange,
}: {
  depts: Dept[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const filtered = query.trim()
    ? depts.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : depts;

  const selected = depts.find((d) => d.id === value);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-left cursor-pointer transition-colors hover:bg-white/8 focus:outline-none focus:ring-1 focus:ring-white/20"
      >
        <span className={selected ? "text-white truncate" : "text-white/30"}>
          {selected?.name ?? "Selecione um ministério..."}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
            <Search size={13} className="shrink-0 text-white/30" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar ministério..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
            />
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-white/30">Nenhum resultado.</p>
            ) : (
              filtered.map((d) => {
                const isSelected = d.id === value;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => { onChange(d.id); setOpen(false); setQuery(""); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <span>{d.name}</span>
                    {isSelected && <Check size={13} className="shrink-0 text-[#4d8bff]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Form ────────────────────────────────────────────────────────────────────

export function AddRoleForm({ userId, depts }: { userId: string; depts: Dept[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [role, setRole] = useState("MEMBER");
  const [scope, setScope] = useState("ORG");
  const [deptId, setDeptId] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const form = new FormData();
      form.set("user_id", userId);
      form.set("role", role);
      form.set("scope_type", scope);
      if (scope === "DEPARTMENT") form.set("department_id", deptId);
      const res = await addRoleAction(form);
      if (res?.success) {
        router.refresh();
      } else {
        setError(res?.message ?? "Falha ao adicionar permissão.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-white/50">Função</label>
          <Dropdown options={ROLE_OPTIONS} value={role} onChange={setRole} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-white/50">Escopo</label>
          <Dropdown
            options={SCOPE_OPTIONS}
            value={scope}
            onChange={(v) => { setScope(v); setDeptId(""); }}
          />
        </div>

        {scope === "DEPARTMENT" && (
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs text-white/50">Ministério</label>
            <DeptCombobox depts={depts} value={deptId} onChange={setDeptId} />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending || (scope === "DEPARTMENT" && !deptId)}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium bg-[#0c49ac] hover:bg-[#0c49ac]/80 disabled:opacity-50 cursor-pointer transition-colors"
        >
          <Plus size={15} />
          {pending ? "Salvando..." : "Adicionar"}
        </button>
      </div>
    </form>
  );
}
