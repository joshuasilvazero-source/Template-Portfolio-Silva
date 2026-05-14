import AboutSection from "@/components/About/AboutSection";
import Team from "@/components/About/Team";
import Breadcrumb from "@/components/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Joshua Silva — Full Stack Developer",
  description: "Learn more about Joshua Silva, Full Stack Developer and U.S. Army veteran.",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb pageTitle="About" />
      <AboutSection />
      <Team />
    </>
  );
};

export default AboutPage;
