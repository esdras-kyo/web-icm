import Link from "next/link";
import { headers } from "next/headers";

type Mini = { id: string; name: string | null };

export default async function DepartmentsPage() {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/departments`,  {
    method: "GET",
    cache: "force-cache",
    headers: { cookie }, 
    next: { revalidate: 1,  },
  });
  const data = await res.json();
  const minis: Mini[] = Array.isArray(data) ? data : [];

  return (
    <main className="mx-auto max-w-7xl px-2 py-2">
      <h1 className="text-xl font-bold text-white mb-8">Ministérios</h1>
      <ul className="space-y-4">
        {minis?.map((mini) => (
          <li
            key={mini.id}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-gray-600 cursor-pointer"
          >
            <Link
              href={`/leader/departments/${mini.id}`}
              className="block p-4 hover:bg-zinc-400 rounded"
            >
              <h2 className="text-lg text-white hover:text-black font-medium">{mini.name}</h2>
            </Link>
          </li>
        ))}
      </ul>
      {minis.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum Departamento encontrado.</p>
      )}
    </main>
  );
}