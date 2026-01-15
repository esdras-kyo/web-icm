'use client'
import Footer from "@/app/components/Footer";
import HeroMission from "@/app/components/HomeHero";
import YouTubeSection from "@/app/components/YoutubeSection";
import EventsGrid from "@/app/components/EventShowCase";
import WeeklySchedule from "@/app/components/WeeklySchedule";
import HomeFeatureCard from "@/app/components/HomeFeatureCard";

export default function ChurchHome() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroMission
        churchName="Igreja de Cristo Maranata"
        mission="SOMOS MIL"
        imageSrc="/images/home1.jpeg"
        subtitle="Ganhar, consolidar, discipular e enviar"
      />

      <YouTubeSection />

      <WeeklySchedule />

      <EventsGrid />

      {/* <MinistriesGrid />
      
      <div className=" -top-px h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />  */}
<div className="bg-linear-to-bl from-black to-[#0b2a3e]">
      <HomeFeatureCard
        href="/historia"
        kicker="Conheça nossas raízes"
        title="Nossa História"
        subtitle="Uma jornada marcada por fé, unidade e propósito — do começo até hoje."
        // imageSrc="/images/historia.jpg"
        variant="soft"
        height="sm"
        align="left"
      />

      <HomeFeatureCard
        href="/celulas"
        kicker="Conheça nossas Células"
        title="Células"
        subtitle="A asa da Igreja"
        // imageSrc="/images/celula.jpg"
        variant="soft"
        height="sm"
        align="left"
      />
      </div>

      <Footer/>

    </div>
  );
}