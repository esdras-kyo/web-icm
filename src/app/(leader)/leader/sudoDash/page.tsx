
// import EventCreateForm from "@/app/components/EventCreator";
// import {createEvent} from "./actions"
import { PdfUploader } from "@/app/components/PdfUpload";
import { PdfCloudList } from "@/app/components/PdfList";
export default async function Painel() {
  // const handleCreate = async (
  //   payload: Parameters<NonNullable<React.ComponentProps<typeof EventCreateForm>["onCreate"]>>[0]
  // ) => {
  //   // injeta o owner_department_id que a action precisa
  //   await createEvent({
  //     ...payload,
  //     owner_department_id: "1",
  //   });
  // };
  return (
    <div className="flex flex-col w-full items-start justify-start ">
      <div className="p-6 gap-2 flex flex-col ">
        <h1 className="text-xl font-semibold mb-4">Novo Evento</h1>
        {/* <EventCreateForm onCreate={handleCreate} /> */}
        <PdfUploader/>
        <PdfCloudList
          workerBase="https://worker-1.esdrascamel.workers.dev"
          defaultVisibility="ORG"
        />
      </div>
    </div>
  );
}
