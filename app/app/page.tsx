import Hero from "../components/landing/Hero";
import ProblemSection from "../components/landing/ProblemSection";
import HowKlazzThinks from "../components/landing/HowKlazzThinks";
import ProductDemoSection from "../components/landing/ProductDemoSection";
import ThenNowSection from "../components/landing/ThenNowSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowKlazzThinks />
      <ProductDemoSection />
      <ThenNowSection />
    </>
  );
}