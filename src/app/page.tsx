import Hero from "@/components/Hero";
import LearningGrid from "@/components/LearningGrid";
import FeaturedTopics from "@/components/FeaturedTopics";

export default function HomePage() {
  return (
    <>
      <div className="pageBackground" style={{ backgroundImage: "url('/background.png')" }} />
      <Hero />

      <LearningGrid />

      <FeaturedTopics />
    </>
  );
}