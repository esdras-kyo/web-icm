import NavBar from "../components/navbar";
import "../globals.css";
import { DM_Sans } from "next/font/google";
import { auth } from "@clerk/nextjs/server";
import { extractClaimsFromJwt } from "@/utils/auth/extractClaims";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { getToken } = await auth();
  const token = await getToken({ template: "member_jwt" });
  const claims = token ? extractClaimsFromJwt(token) : null;

  return (
    <div className={`${dmSans.variable} min-h-dvh`}>
      <NavBar claims={claims} />
      <main>{children}</main>
    </div>
  );
}