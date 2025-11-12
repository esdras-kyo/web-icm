"use client";

import * as React from "react";

export type CellRole = "LEADER" | "ASSISTANT" | "MEMBER";

export function RoleField({
  initial,
  name = "role",
  selectClass = "rounded-md border px-2 py-1 text-sm w-full sm:w-[160px] bg-transparent",
  buttonClass = "rounded-md border px-3 py-1 text-sm disabled:opacity-50 w-full sm:w-auto",
  buttonLabel = "Salvar",
}: {
  initial: CellRole;
  name?: string;
  selectClass?: string;
  buttonClass?: string;
  buttonLabel?: string;
}) {
  const [value, setValue] = React.useState<CellRole>(initial);
  const dirty = value !== initial;

  return (
    <>
      <select
        name={name}
        className={selectClass}
        value={value}
        onChange={(e) => setValue(e.target.value as CellRole)}
      >
        <option value="LEADER">Líder</option>
        <option value="ASSISTANT">Co-líder</option>
        <option value="MEMBER">Membro</option>
      </select>

      <button
        type="submit"
        className={`${buttonClass} ${dirty? "cursor-pointer":"cursor-default"}`}
        disabled={!dirty}
      >
        {buttonLabel}
      </button>
    </>
  );
}