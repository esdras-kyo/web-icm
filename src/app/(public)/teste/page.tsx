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

      <EventsGrid />

      <MinistriesGrid />
      
      <div className=" -top-px h-px bg-linear-to-r from-transparent via-white/30 to-transparent" /> 

      <Footer/>
    </div>
  );
}