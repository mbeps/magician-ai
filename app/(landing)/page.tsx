import { LandingHero } from "@/components/pages/landing/LandingHero";
import { LandingNavbar } from "@/components/pages/landing/LandingNavbar";

const LandingPage = () => {
  return (
    <div className="h-full ">
      <LandingNavbar />
      <LandingHero />
    </div>
  );
};

export default LandingPage;
