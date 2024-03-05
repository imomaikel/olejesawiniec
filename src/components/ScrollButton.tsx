'use client';
import { FaArrowAltCircleUp } from 'react-icons/fa';
import { useEffect, useState } from 'react';

type TScrollButton = {
  trackElementIdOrHeight: number | string;
};
const ScrollButton = ({ trackElementIdOrHeight }: TScrollButton) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const firstSectionPos =
        typeof trackElementIdOrHeight === 'string'
          ? document.getElementById(trackElementIdOrHeight)?.offsetHeight
          : trackElementIdOrHeight;
      const currentScrollPos = document.documentElement.scrollTop;

      if (firstSectionPos && currentScrollPos > firstSectionPos) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [trackElementIdOrHeight]);

  if (!showButton) return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  return (
    <div className="fixed right-3 bottom-3 md:right-6 md:bottom-6 opacity-75 cursor-pointer z-10" onClick={scrollToTop}>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full">
        <FaArrowAltCircleUp className="w-10 h-10 md:w-12 md:h-12 text-white" />
      </div>
    </div>
  );
};

export default ScrollButton;
