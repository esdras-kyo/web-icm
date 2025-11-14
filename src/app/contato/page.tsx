import { ChevronRight, Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center md:justify-start px-4 md:py-16 relative">

      {/* glows de fundo, seguindo a estética geral */}
      <div className=" flex flex-col w-full border rounded-lg border-white/50 items-center justify-center py-16">


      <div className="w-full max-w-2xl text-center items-center justify-center relative z-10">

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Entre em contato
        </h1>

        <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
          Fale conosco por e-mail, telefone ou visite-nos.
        </p>

        <div className="mt-10 w-full flex flex-col justify-center">
          <div className="flex items-center justify-center w-full gap-2">
          <Mail />
            <a
              href="mailto:contato@exemplo.com"
              className="text-xl font-medium text-white hover:underline cursor-pointer"
            >
              contato@exemplo.com
            </a>
          </div>

          <div className="flex items-center w-full justify-center gap-2 mt-4">
            <Phone />
            <a
              href="tel:+556299999999"
              className="text-xl font-medium text-white hover:underline cursor-pointer"
            >
              (62) 99999-9999
            </a>
          </div>
        </div>

        {/* CTA para localização */}
        <div className="mt-12 inline-flex items-center  gap-2 justify-center px-4 py-4 rounded-2xl text-white font-semibold  hover:opacity-90 transition cursor-pointer ring-1 ring-white/15 backdrop-blur-sm">
          <a
            href="/localizacao"
            className=""
          >
            Ver localização completa
          </a>
          <ChevronRight className="w-6 h-6"/>
        </div>
      </div>
      </div>
    </div>
  );
}