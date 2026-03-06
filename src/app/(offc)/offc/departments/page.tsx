import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { createDepartment, deleteDepartment, updateDepartment } from "./actions";
import { ConfirmDeleteButton } from "@/app/components/ConfirmDeleteModal";
import { DepartmentEditDialog } from "./_components/DepartmentEditDialog";

export default async function OffcDepartmentsPage() {
  const supabase = createSupabaseAdmin();

  const { data: departments } = await supabase
    .from("departments")
    .select("id, name")
    .order("name");

  const onCreate = async (formData: FormData): Promise<void> => {
    "use server";
    await createDepartment(formData);
  };

  const makeUpdate = (id: string) => async (formData: FormData): Promise<void> => {
    "use server";
    await updateDepartment(id, formData);
  };

  const makeDelete = (id: string) => async (): Promise<void> => {
    "use server";
    await deleteDepartment(id);
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Departamentos</h1>

      <form
        action={onCreate}
        className="w-full max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
      >
        <h2 className="text-lg font-semibold text-white">Novo departamento</h2>

        <div className="flex flex-col space-y-1">
          <label className="text-sm text-gray-300">Nome *</label>
          <input
            name="name"
            placeholder="Digite o nome do departamento"
            required
            className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-emerald-600/80 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 sm:w-auto"
        >
          Salvar departamento
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-zinc-700">
        {!departments || departments.length === 0 ? (
          <p className="p-4 text-sm opacity-70">Nenhum departamento cadastrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-700 bg-zinc-900/50">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id} className="border-b border-zinc-800">
                  <td className="p-2">{department.id}</td>
                  <td className="p-2 font-medium">{department.name}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <DepartmentEditDialog
                        department={department}
                        onSubmit={makeUpdate(department.id)}
                      />
                      <ConfirmDeleteButton
                        onConfirm={makeDelete(department.id)}
                        itemName={department.name}
                        entityLabel="departamento"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

