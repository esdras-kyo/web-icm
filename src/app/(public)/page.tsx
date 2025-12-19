'use client'
import Footer from "@/app/components/Footer";
import HeroMission from "@/app/components/HomeHero";
import YouTubeSection from "@/app/components/YoutubeSection";
import EventsGrid from "@/app/components/EventShowCase";
import WeeklySchedule from "@/app/components/WeeklySchedule";

export default function ChurchHome() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroMission
        churchName="Igreja de Cristo Maranata"
        mission="Somos Mil"
        subtitle="Ganhar, consolidar, discipular e enviar"
      />

      <YouTubeSection />

      <WeeklySchedule />

      <EventsGrid />

      <div className=" -top-px h-px bg-linear-to-r from-transparent via-white/30 to-transparent" /> 

      <Footer/>
    </div>
  );
}