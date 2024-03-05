'use client';
import { Button } from '@/components/ui/button';
import ReactCardFlip from 'react-card-flip';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type TProduct = {
  link: string;
  label: string;
  image: string;
  price: number;
  description: string[];
  onBasketAdd: () => void;
  onShowDescription: () => void;
};
const Product = ({ link, image, label, price, onBasketAdd, onShowDescription }: TProduct) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="shadow-lg rounded-lg relative">
      <div
        className="max-w-[225px] cursor-pointer relative"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <Image
          src={image}
          width={0}
          height={0}
          loading="eager"
          sizes="100vw"
          quality={0}
          alt={label}
          className="w-full h-auto -z-10 invisible"
        />
        <div className="absolute inset-0">
          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerClassName="h-full">
            <div>
              <Image
                src={image}
                width={0}
                height={0}
                loading="eager"
                sizes="100vw"
                alt={label}
                className="w-full h-full rounded-tl-lg rounded-tr-lg"
                onClick={handleFlip}
              />
            </div>

            <div className="w-full h-full flex items-center flex-col justify-center bg-background rounded-tl-lg rounded-tr-lg">
              <span className="font-semibold text-xl text-center">{label}</span>
              <div className="flex flex-col space-y-4 mt-2 z-10">
                <Button onClick={onBasketAdd} disabled={!isFlipped}>
                  Dodaj do koszyka
                </Button>
                <Button
                  onClick={() => {
                    onShowDescription();
                    setIsFlipped(false);
                  }}
                  disabled={!isFlipped}
                >
                  Podgląd właściwości
                </Button>
                <Button asChild variant="link" disabled={!isFlipped}>
                  <Link href={`/sklep/${link}`}>Przejdź do produktu</Link>
                </Button>
              </div>
              <div className="absolute w-full h-full z-0" onClick={handleFlip} />
            </div>
          </ReactCardFlip>
        </div>
      </div>
      <div className="p-2 bg-white rounded-bl-lg rounded-br-lg max-w-[225px]">
        <h2 className="text-center font-bold tracking-wide truncate">{label}</h2>
        <div className="relative flex items-center justify-center">
          <h3 className="bg-background px-2 font-medium z-[1] tracking-wide">{formatPrice(price)}</h3>
          <div className="w-full h-px bg-primary absolute opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default Product;
