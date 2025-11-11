import { use } from 'react'
import BackButton from "../../components/BackButton";
import { MeetingFormSimple } from "../../components/MeetingForm";


export default function DepartmentDetailPage({ params }: { params: Promise<{ depId: string }> }) {
  const { depId } = use(params); // <-- força o resolve da Promise

  return (
    <div className="w-full mx-auto p-6 space-y-6 text-white">
      <BackButton />

      <div>
        <h1 className="text-2xl font-semibold">Departamento</h1>
        <p className="text-sm text-gray-500">ID: {depId}</p>
      </div>

      <MeetingFormSimple depId={depId} />
    </div>
  );
}