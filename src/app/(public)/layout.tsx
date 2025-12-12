import NavBar from "../components/navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}