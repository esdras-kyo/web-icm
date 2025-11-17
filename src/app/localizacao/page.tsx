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
            Av. Abel Coimbra, Quadra 86, Lote 09 – Cidade Jardim, Goiânia – GO, CEP 74425-250. 
            </p>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/60">
            <div className="relative w-full pb-[56.25%]"> 
              <iframe
                title="Mapa - Localização da igreja"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.012028516941!2d-49.31202!3d-16.68058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef42469bcf065%3A0x6f774486a15a587!2sIGREJA%20DE%20CRISTO%20MARANATA%20-%20CIDADE%20JARDIM!5e0!3m2!1spt-BR!2sbr!4v1731510000000!5m2!1spt-BR!2sbr"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <a
              href="https://www.google.com/maps/place/IGREJA+DE+CRISTO+MARANATA+-+CIDADE+JARDIM/@-16.6801429,-49.3116333,18.84z/data=!4m6!3m5!1s0x935ef42469bcf065:0x6f774486a15a587!8m2!3d-16.6805794!4d-49.3105781!16s%2Fg%2F11f2b6lh52?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
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