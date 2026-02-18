'use client';

import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;
  return (
    <CookieConsent
      cookieName="cookie_notice"
      expires={180}
      location="bottom"
      disableStyles

      containerClasses="
        fixed bottom-4 left-1/2 -translate-x-1/2
        w-[95%] max-w-4xl
        z-[9999]
        backdrop-blur-xl
        bg-white/10
        border border-white/20
        shadow-2xl
        rounded-2xl
        p-2
        mb-2
      "

      contentClasses="
        text-sm text-white/90
        px-5 py-4
        flex flex-col md:flex-row
        items-center gap-3
      "

      buttonClasses="
        cursor-pointer
        bg-sky-300
        text-black
        font-semibold
        px-4 py-2
        rounded-lg
        hover:bg-[#00b8e6]
        transition
      "
      buttonText="Entendi"
    >
      Usamos cookies essenciais para login, segurança e melhor experiência.
      <Link
        href="/politica-de-privacidade"
        className="underline text-white hover:text-cyan-300 cursor-pointer"
      >
        Saiba mais
      </Link>
    </CookieConsent>
  );
}