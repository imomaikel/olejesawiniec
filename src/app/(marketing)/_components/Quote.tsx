'use client';
import ContentWrapper from '@/components/ContentWrapper';
import { slideIn } from '@/utils/motion';
import { motion } from 'framer-motion';

const Quote = () => {
  return (
    <ContentWrapper className="bg-black text-white flex flex-col items-center justify-center relative" moreSpace>
      <div className="max-w-6xl">
        <motion.h3
          variants={slideIn('top', 'spring', 0.25, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bold text-center !md:leading-[50px] leading-[35px] "
        >
          Kuchnia Jest Naszym Najbliższym Szpitalem, A Zdrowe Jedzenie To Recepta Na Długie, Pełne Energii Życie. To Nie
          Tylko Posiłki, To Inwestycja W Swoje Dobre Samopoczucie I Harmonię Z Naturą
        </motion.h3>
      </div>
      <motion.h4
        variants={slideIn('top', 'spring', 0.5, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-primary text-xl md:text-3xl font-bold mt-10 mb-5"
      >
        Jamie Oliver
      </motion.h4>
      <motion.p
        variants={slideIn('top', 'spring', 0.75, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-muted-foreground text-center"
      >
        szef kuchni i aktywista kulinarnej świadomości
      </motion.p>
      <div className="absolute w-screen h-full bg-black -z-10" />
    </ContentWrapper>
  );
};

export default Quote;
