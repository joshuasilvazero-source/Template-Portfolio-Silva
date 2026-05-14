import { Metadata } from 'next';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Skills from '@/components/Skills/Skills';
import Projects from '@/components/Projects/Projects';
import Experience from '@/components/Experience/Experience';
import Contact from '@/components/Contact/Contact';

export const metadata: Metadata = {
  title: 'Joshua Silva — Full Stack Developer | Building Digital Universes',
  description:
    'Cinematic interstellar portfolio. Full-stack developer specialising in React, Next.js, TypeScript, Node.js, and immersive 3D web experiences. U.S. Army veteran.',
  keywords: [
    'Full Stack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Portfolio',
    'Interstellar',
    '3D Web',
  ],
};

export default function Home() {
  return (
    <main className='relative'>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
