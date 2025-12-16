import NavBar from "../components/navbar";
import "../globals.css";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${dmSans.variable} min-h-dvh`}>
      <NavBar />
      <main>{children}</main>
    </div>
  );
}