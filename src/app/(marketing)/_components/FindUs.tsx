'use client';
import ContentWrapper from '@/components/ContentWrapper';
import ImageSwiper from '@/components/ImageSwiper';
import { slideIn } from '@/utils/motion';
import SectionInfo from './SectionInfo';
import { motion } from 'framer-motion';

const FindUs = () => {
  return (
    <ContentWrapper className="flex-col lg:flex-row justify-center md:space-x-6 bg-gray-100 relative">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={slideIn('left', 'tween', 0, 0.75)}
        className="space-y-8 w-full mb-6 flex flex-col md:max-w-lg lg:max-w-sm lg:mr-6"
      >
        <SectionInfo
          smallTitle="Znajdź nas"
          bigTitle="Sklepy stacjonarne"
          description="Nasze wyjątkowe produkty są dostępne nie tylko online,
ale także w sklepach stacjonarnych. Każda butelka to rezultat ręcznej
pracy i starannie wybranych składników,
gwarantująca najwyższą jakość i unikalny smak.
Zapraszamy do zakupów, gdziekolwiek jest Ci wygodniej"
          buttonText="Zamawiam online"
          buttonLink="/sklep"
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={slideIn('right', 'spring', 0, 0.75)}
      >
        <ImageSwiper
          urls={['/shop1.webp', '/shop2.webp', '/shop3.webp']}
          alt="sklep stacjonarny"
          className="max-w-lg"
          caption="Zamość, ul. Partyzantów 100"
          captionLink="https://maps.app.goo.gl/YKn2FDUXzxjFHfMJA"
        />
      </motion.div>
      <div className="absolute w-screen top-0 h-full bg-gray-100 -z-10" />
    </ContentWrapper>
  );
};

export default FindUs;
