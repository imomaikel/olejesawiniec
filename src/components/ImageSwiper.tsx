'use client';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { FaArrowCircleRight } from 'react-icons/fa';
import { Dialog, DialogContent } from './ui/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import TSwiper from 'swiper';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';

type TImageSwiper = {
  urls: string[];
  alt: string;
  className?: string;
  caption?: string;
  captionLink?: string;
  fullSizeOnClick?: boolean;
  fitImage?: boolean;
};
const ImageSwiper = ({ urls, alt, className, caption, captionLink, fullSizeOnClick, fitImage }: TImageSwiper) => {
  const [swiper, setSwiper] = useState<null | TSwiper>(null);
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState('');
  const [controls, setControls] = useState({
    isFirst: true,
    isLast: urls.length >= 2 ? false : true,
  });

  const imageCount = urls.length;

  const showFullSize = (imgUrl: string) => {
    setImage(imgUrl);
    setIsImage(true);
  };

  useEffect(() => {
    swiper?.on('slideChange', ({ activeIndex }) => {
      const currentIndex = activeIndex + 1;
      setControls({
        isFirst: currentIndex === 1,
        isLast: currentIndex === imageCount,
      });
    });
  }, [swiper, imageCount]);

  return (
    <>
      <div className={cn('h-96 w-full relative', className)}>
        <div
          className={cn(
            'absolute z-20 top-1/2 -translate-y-1/2 -left-4 cursor-pointer hover:text-primary transition-colors block',
            controls.isFirst && 'hidden',
          )}
          role="button"
          aria-label="poprzednie zdjęcie"
          onClick={() => swiper?.slidePrev()}
        >
          <FaArrowAltCircleLeft className="h-8 w-8" />
          <div className="h-7 w-7 absolute left-[2px] top-[2px] rounded-full bg-white -z-10" />
        </div>
        <div
          className={cn(
            'absolute z-20 top-1/2 -translate-y-1/2 -right-4 cursor-pointer hover:text-primary transition-colors block',
            controls.isLast && 'hidden',
          )}
          role="button"
          aria-label="następne zdjęcie"
          onClick={() => swiper?.slideNext()}
        >
          <FaArrowCircleRight className="h-8 w-8" />
          <div className="h-7 w-7 absolute left-[2px] top-[2px] rounded-full bg-white -z-10" />
        </div>
        <Swiper
          modules={[Pagination]}
          pagination={{
            type: 'progressbar',
            renderProgressbar: (progressbarFillClass) => {
              return `<span class="${progressbarFillClass} imageSwipeBar"></span>`;
            },
          }}
          onSwiper={setSwiper}
          className={cn(
            'h-full w-full bg-gray-200 rounded-lg select-none shadow-2xl',
            fullSizeOnClick ? 'cursor-pointer' : 'cursor-grab',
          )}
        >
          {urls.map((url) => (
            <SwiperSlide
              key={url}
              className="w-full relative h-full"
              onClick={() => (fullSizeOnClick ? showFullSize(url) : undefined)}
            >
              <Image
                loading="eager"
                alt={alt}
                src={url}
                className={cn('w-full h-full object-cover object-center rounded-lg', fitImage && 'object-contain')}
                fill
              />
            </SwiperSlide>
          ))}
          {urls.length === 0 && (
            <SwiperSlide>
              <div className="h-full w-full flex items-center justify-center flex-col">
                <MdOutlineImageNotSupported className="h-48 w-48" />
                <span className="mt-1">Brak Zdjęcia</span>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
        {caption && (
          <div className="text-muted-foreground mt-2 text-center">
            {captionLink ? (
              <Link href={captionLink} className="hover:underline">
                {caption}
              </Link>
            ) : (
              caption
            )}
          </div>
        )}
      </div>
      <Dialog open={isImage} onOpenChange={setIsImage}>
        <DialogContent className="">
          <div className="pt-6">
            <Image
              src={image}
              alt="produkt"
              width={0}
              height={0}
              sizes="100vw"
              loading="eager"
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageSwiper;
