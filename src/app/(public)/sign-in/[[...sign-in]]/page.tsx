import { SignIn } from "@clerk/nextjs";
export default function Page() {
  return (
    <div className="w-full flex min-h-dvh items-center justify-center">
      <SignIn />
    </div>
  );
}
