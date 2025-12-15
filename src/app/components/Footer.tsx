import Image from "next/image";
import { Instagram, MapPin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-3 items-start">

        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Logo" width={28} height={28} />
            <h1 className="text-sm md:text-lg font-medium">
              Igreja de Cristo Maranata
            </h1>
          </div>

          <p className="mt-3 text-sm text-zinc-200">
            Ganhar · Consolidar · Discipular · Enviar
          </p>
        </div>

        <div className="text-zinc-400" >
          <h4 className="font-medium mb-3 text-sm">Endereço</h4>
          <a href="https://www.google.com/maps/place/IGREJA+DE+CRISTO+MARANATA+-+CIDADE+JARDIM/@-16.6801429,-49.3116333,18.84z/data=!4m6!3m5!1s0x935ef42469bcf065:0x6f774486a15a587!8m2!3d-16.6805794!4d-49.3105781!16s%2Fg%2F11f2b6lh52?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
          >
          <div className="flex-row flex gap-2 items-center justify-start">
          <MapPin className="text-zinc-300"/>
          <p className="text-sm leading-relaxed hover:text-zinc-200">
            Av. Abel Coimbra, 86<br />
            Cidade Jardim - Goiânia – GO
          </p>
          </div>
          </a>
          
        </div>

        <div className="text-zinc-400">
          <h4 className="font-medium mb-3 text-sm">Siga-nos</h4>
          <div className="flex flex-col gap-3">

          <a
            href="https://www.instagram.com/icmsede"
            aria-label="Instagram"
            className="flex items-center gap-3 text-sm  hover:text-zinc-200 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
           
              <Instagram className="h-5 w-5 text-zinc-300" />

            <span>Instagram</span>
          </a>

          <a
            href="https://www.youtube.com/@ICMSede"
            aria-label="YouTube"
            className="flex items-center gap-3 text-sm hover:text-zinc-200 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            
            <Youtube className="h-5 w-5 text-zinc-300 " />
            
            <span>YouTube</span>
          </a>

          </div>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground pb-10">
        © {new Date().getFullYear()} Igreja de Cristo Maranata. Todos os direitos reservados.
      </div>
    </footer>
  );
}