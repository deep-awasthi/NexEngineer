import Image from "next/image";
import Hero from "@/components/Hero";
import LearningGrid from "@/components/LearningGrid";
import PracticeSection from "@/components/PracticeSection";
export default function HomePage() {
  return (
    <>
      <div className="pageBackground">
        <Image
          src="/background.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 350px, 650px"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <Hero />

      <LearningGrid />

      <PracticeSection />
    </>
  );
}