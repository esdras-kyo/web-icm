'use client'
import Footer from "@/app/components/Footer";
import HeroMission from "@/app/components/HomeHero";
import YouTubeSection from "@/app/components/YoutubeSection";
import EventsGrid from "@/app/components/EventShowCase";
import WeeklySchedule from "@/app/components/WeeklySchedule";
import MinistriesGrid from "@/app/components/MinistriesGrid";

export default function ChurchHome() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroMission
        churchName="Igreja de Cristo Maranata"
        mission="Ganhar, consolidar, discipular e enviar"
        imageSrc="/images/home.png"
      />

      <YouTubeSection />

      <WeeklySchedule />

      <div className="w-full bg-linear-to-tr from-black via-black to-sky-800/50 py-16 mb-16">
        <div className="mx-auto max-w-6xl px-6 flex flex-col gap-10">
          <div className=" text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">
              Programações especiais
            </p>
            <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight text-white">
              Próximos Eventos
            </h2>
            <p className="mt-2 text-sm md:text-base text-white/70">
              Participe do movimento.
            </p>
          </div>

          <EventsGrid />

        </div>
      </div>


      <MinistriesGrid />
      <div className=" -top-px h-px bg-linear-to-r from-transparent via-white/30 to-transparent" /> 

      <Footer/>
    </div>
  );
}