export default function LocationPage() {
  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-start px-4 py-16 relative">
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 bg-sky-500/20 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 bg-indigo-500/20 blur-[140px] rounded-full" />

      <div className="w-full max-w-4xl relative z-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Como chegar
          </h1>
          <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
            Veja nossa localização.
          </p>
        </header>

        <div className="w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Endereço
            </h2>
            <p className="text-white/80 text-sm md:text-base">
              Av. Abel Coimbra, 86 – Cidade Jardim, Goiânia – GO
            </p>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/60">
            <div className="relative w-full pb-[56.25%]"> 
              <iframe
                title="Mapa - Localização da igreja"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.0959276895997!2d-49.272!3d-16.690!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQxJzI0LjAiUyA0OcKwMTYnMTkuMCJX!5e0!3m2!1spt-BR!2sbr!4v0000000000000"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Av.+Abel+Coimbra,+86,+Cidade+Jardim,+Goi%C3%A2nia+-+GO"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm md:text-base font-semibold bg-gradient-to-br from-sky-600 to-blue-800 text-white hover:opacity-90 transition ring-1 ring-white/15"
            >
              Abrir no Google Maps
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}