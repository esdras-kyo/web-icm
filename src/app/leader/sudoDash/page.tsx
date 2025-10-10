import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EventCreateForm from "@/app/components/EventCreator";
import {createEvent} from "./actions"
import { PdfUploader } from "@/app/components/PdfUpload";
import { PdfCloudList } from "@/app/components/PdfList";
export default async function Painel() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/teste");
  }
  return (
    <div className="flex flex-col w-full items-start justify-start ">
      <div className="p-6 gap-2 flex flex-col ">
        <h1 className="text-xl font-semibold mb-4">Novo Evento</h1>
        <EventCreateForm onCreate={createEvent} />
        <PdfUploader/>
        <PdfCloudList
          workerBase="https://worker-1.esdrascamel.workers.dev"
          defaultVisibility="ORG"
        />
      </div>
    </div>
  );
}
