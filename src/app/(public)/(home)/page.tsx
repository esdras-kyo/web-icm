import Footer from "@/app/components/Footer";
import HeroFirstPaint from "@/app/components/HeroFirstPaint";
import HeroCarousel from "@/app/components/HeroCarousel";
import YouTubeSection from "@/app/components/YoutubeSection";
import EventsGrid from "@/app/components/EventShowCase";
import WeeklySchedule from "@/app/components/WeeklySchedule";
import HomeFeatureCard from "@/app/components/HomeFeatureCard";

const HERO_IMAGES = ["/images/home2.png", "/images/home31.png"];

export default function ChurchHome() {
  const firstImage = HERO_IMAGES[0] ?? "/images/home2.png";

  return (
    <div className="min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full bg-red-700/50 blur-3xl" />
        <div className="absolute top-24 right-[-160px] h-[520px] w-[520px] rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-[-220px] left-1/3 h-[640px] w-[640px] rounded-full bg-red-500/25 blur-3xl" />
      </div>

      <HeroFirstPaint
        firstImageSrc={firstImage}
        churchName="Igreja de Cristo Maranata"
        mission="SOMOS MIL"
        subtitle="Ganhar, consolidar, discipular e enviar"
      >
        <HeroCarousel
          images={HERO_IMAGES}
          alt="Igreja de Cristo Maranata"
          intervalMs={6000}
          slideDirection="left"
        />
      </HeroFirstPaint>

      <YouTubeSection />

      <WeeklySchedule />

      <EventsGrid />

      <div className="">
        <HomeFeatureCard
          href="/historia"
          kicker="Conheça nossas raízes"
          title="Nossa História"
          subtitle="Do começo até hoje"
          variant="soft"
          height="sm"
          align="left"
        />

        <HomeFeatureCard
          href="/celulas"
          kicker="Conheça nossas Células"
          title="Células"
          subtitle="A asa da Igreja"
          variant="soft"
          height="sm"
          align="left"
        />
      </div>

      <Footer />
    </div>
  );
}
