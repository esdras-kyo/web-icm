
import BackButton from "../../components/BackButton";
import { MeetingFormSimple } from "../../components/MeetingForm";

export default function DepartmentDetailPage({
    params,
  }: { params: { depId: string } }) {
    const { depId } = params;

  return (
    <div className="w-full mx-auto p-6 space-y-6 text-white">
      <BackButton />

      <div>
        <h1 className="text-2xl font-semibold">Departamento</h1>
        <p className="text-sm text-gray-500">ID:{depId}</p>
      </div>
      <MeetingFormSimple depId={depId} />
    </div>
  );
}