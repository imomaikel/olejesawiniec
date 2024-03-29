'use client';
import { FaArrowCircleDown } from 'react-icons/fa';
import { slideIn, zoomOut } from '@/utils/motion';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import RandomProduct from './RandomProduct';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Hero = () => {
  const [randomProductOpened, setRandomProductOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const vpHeight = isMounted ? window.innerHeight : null;

  return (
    <>
      <div
        className={cn(
          'bg-hero bg-no-repeat bg-cover bg-center flex items-center justify-center relative px-[35px] !pt-4 md:pt-0',
        )}
        style={{ height: vpHeight ?? '100vh' }}
      >
        <motion.div
          variants={zoomOut(0, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="w-full flex items-center justify-center flex-col max-w-2xl z-10 space-y-6"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-7xl font-bold uppercase text-white mb-10">Oleje Sawiniec</h1>
            <h2 className="text-white text-center text-lg md:text-2xl font-medium leading-9">
              Odkryj moc natury w naszych olejach zimnotłoczonych - wyjątkowe eliksiry zdrowia, pełne cennych składników
              odżywczych, które wspierają kondycję mózgu, skóry i układu krążenia.
            </h2>
          </div>
          <div className="md:space-x-6 flex items-center flex-col md:flex-row md:space-y-0 space-y-6 relative">
            <motion.div
              variants={slideIn('top', 'tween', 0, 0.75, 200)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="absolute w-full z-20 -bottom-[50%] lg:-bottom-[200%] left-0"
            >
              <div className="h-full mx-auto flex items-center justify-center relative">
                <Link href="#zdjecia" className="relative group" aria-label="Dowiedz się więcej" scroll>
                  <FaArrowCircleDown className="h-12 w-12 text-white transition-colors hover:text-primary z-10 relative" />
                  <div className="absolute inset-0 h-12 w-12 mx-auto z-0 bg-gradient-to-r from-emerald-500 to-lime-600 blur-[30px] group-hover:blur-[20px] transition-all" />
                </Link>
              </div>
            </motion.div>
            <motion.div variants={slideIn('left', 'spring', 0, 1)}>
              <Button
                asChild
                className="rounded-full dark bg-black text-[16px] hover:bg-primary transition-all shadow-md shadow-black/90 hover:shadow-primary/90"
                size="2xl"
                variant="secondary"
              >
                <Link href="/sklep">Zobacz Produkty</Link>
              </Button>
            </motion.div>
            <motion.div variants={slideIn('right', 'spring', 0, 1)}>
              <Button
                onClick={() => setRandomProductOpened(true)}
                className="uppercase rounded-full text-[16px] hover:bg-black/90 transition-all shadow-md shadow-primary hover:shadow-black/90"
                size="2xl"
                id="randomProduct"
              >
                Właściwości Oleju
              </Button>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute w-full h-full bg-black/25 top-0 z-0 backdrop-blur-sm" />
        <div className="absolute w-[300px] h-[500px] md:ml-20 rotate md:rotate-45 bg-gradient-to-r from-red-600 to-green-500 blur-[200px] opacity-50 md:opacity-70" />
      </div>
      <RandomProduct isOpen={randomProductOpened} onClose={() => setRandomProductOpened(false)} />
    </>
  );
};

export default Hero;
