import { Metadata } from 'next';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Skills from '@/components/Skills/Skills';
import ProfessionalWork from '@/components/ProfessionalWork/ProfessionalWork';
import Projects from '@/components/Projects/Projects';
import Experience from '@/components/Experience/Experience';
import Contact from '@/components/Contact/Contact';

export const metadata: Metadata = {
  title: 'Joshua Silva | UI/UX Specialist & Frontend Developer',
  description:
    'Portfolio of Joshua Silva, a UI/UX Specialist and Frontend Developer building responsive, user-centered web experiences using React, JavaScript, modern CSS, and production CMS platforms.',
  keywords: [
    'Joshua Silva',
    'UI/UX Developer',
    'UX Engineer',
    'Frontend Developer',
    'React Developer',
    'Colorado Springs',
    'Remote Frontend Developer',
    'Next.js',
    'TypeScript',
  ],
};

export default function Home() {
  return (
    <main className='relative'>
      <Hero />
      <About />
      <Skills />
      <ProfessionalWork />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
