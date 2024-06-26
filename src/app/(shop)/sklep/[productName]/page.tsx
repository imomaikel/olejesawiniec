'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FloatingProduct from './_components/FloatingProduct';
import { cn, errorToast, formatPrice } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/components/providers/TRPC';
import { TiChevronRight } from 'react-icons/ti';
import { Badge } from '@/components/ui/badge';
import Opinions from './_components/Opinions';
import { IoWarning } from 'react-icons/io5';
import draftToHtml from 'draftjs-to-html';
import { useMemo, useState } from 'react';

const ProductPage = () => {
  const router = useRouter();
  const { productName } = useParams<{
    productName: string;
  }>();
  const [selectedVariantId, setSelectedVariantId] = useState('');

  const { data: product, isLoading } = trpc.shop.getProduct.useQuery(
    { productName },
    {
      onSuccess: (response) => {
        if (selectedVariantId.length <= 1) {
          setSelectedVariantId(response?.variants[0].id ?? '');
        }
        if (response && response?.variants.length <= 0) {
          errorToast('Aktualnie nie ma możliwości kupienia tego produktu.');
          router.push('/sklep');
          return;
        }
      },
    },
  );

  const productDescription = useMemo(() => {
    if (!product || !product.description) return;
    try {
      const html = draftToHtml(JSON.parse(product.description));
      return html;
    } catch {}
    return undefined;
  }, [product]);

  const selectedVariant = useMemo(
    () => product?.variants.find(({ id }) => id === selectedVariantId) ?? null,
    [selectedVariantId, product?.variants],
  );
  const { isLowStock, isOutOfStock } = useMemo(() => {
    const isOutOfStock = product?.variants.some((entry) => !entry.stock);
    const isLowStock = product?.variants.some((entry) => entry.stock >= 1 && entry.stock <= 2);
    return { isOutOfStock, isLowStock };
  }, [product?.variants]);

  if (!product && !isLoading) {
    errorToast('Produkt nie istnieje!');
    router.push('/sklep');
  }

  if (!product) return <ProductPage.Skeleton />;

  const { variants, tags, mainPhoto, extraPhotos, label, details, nutritionFact, rating, ratings, opinions, link } =
    product;

  const ratingCount = ratings?.length ?? 0;

  const photos = [];
  if (mainPhoto) {
    photos.push(mainPhoto);
    extraPhotos.forEach((photo) => photos.push(photo.url));
  }

  const calcServing = (value: number, serving: number = 12) => {
    const calculated = parseFloat(((value * serving) / 100).toFixed(2));
    return calculated;
  };
  const calcDietaryReference = (
    serving: number,
    key: 'calories' | 'fat' | 'saturated fat' | 'carbs' | 'sugar' | 'protein' | 'sodium',
  ) => {
    let goal = 0;
    if (key === 'calories') goal = 2000;
    else if (key === 'fat') goal = 70;
    else if (key === 'saturated fat') goal = 20;
    else if (key === 'carbs') goal = 260;
    else if (key === 'sugar') goal = 90;
    else if (key === 'protein') goal = 50;
    else if (key === 'sodium') goal = 6;

    const value = Math.round((serving * 100) / goal);
    return value;
  };

  const pricePer100 = selectedVariant ? (100 * selectedVariant.price) / selectedVariant.capacity : 0;
  const priceDiffPer100 =
    product.variants[0] && pricePer100
      ? (100 * product.variants[0].price) / product.variants[0].capacity - pricePer100
      : 0;

  return (
    <div className="flex justify-center relative flex-col lg:flex-row mb-24 space-y-12 lg:space-y-0">
      <FloatingProduct
        productId={product.id}
        productName={label}
        imageUrls={photos}
        tags={tags}
        rating={rating}
        ratingCount={ratingCount}
        link={link}
        variants={variants}
        onSelect={(variantId) => setSelectedVariantId(variantId)}
      />
      <div className="2xl:mx-24 lg:mx-16 hidden lg:block" />
      <div className="w-full max-w-2xl lg:max-w-xl relative mx-auto lg:mx-0">
        {/* Title */}
        <div className="mb-1">
          <h1 className="text-3xl font-bold">Szczegóły produktu</h1>
        </div>

        {isLowStock && (
          <Alert variant="warning" className="my-2">
            <IoWarning className="h-8 w-8" />
            <AlertTitle className="ml-2">Uwaga!</AlertTitle>
            <AlertDescription className="ml-2">Pojemności na pomarańczowo są na wyczerpaniu.</AlertDescription>
          </Alert>
        )}

        {isOutOfStock && (
          <Alert variant="destructive" className="my-2">
            <IoWarning className="h-8 w-8" />
            <AlertTitle className="ml-2">Uwaga!</AlertTitle>
            <AlertDescription className="ml-2">
              Pojemności na czerwono nie są aktualnie dostępne. Możesz dodać je do listy życzeń i otrzymać e-mail gdy
              będą dostępny ponownie.
            </AlertDescription>
          </Alert>
        )}

        {/* Size */}
        <div className="mt-2 flex flex-col">
          <div className="flex lg:flex-row flex-col lg:space-x-2">
            <div className="flex flex-col">
              <div className="tracking-wide font-medium">Dostępne w pojemnościach</div>
              <div className="text-muted-foreground font-medium lg:text-right">Stan magazynowy</div>
            </div>
            <div className="flex flex-wrap space-x-2">
              {variants.map((variant) => {
                const outOutStock = !variant.stock;
                const lowStock = variant.stock >= 1 && variant.stock <= 2;
                const stock = !outOutStock && !lowStock;

                return (
                  <div key={`${variant.price}${variant.capacity}`} className="flex flex-col items-center">
                    <Badge
                      className="cursor-pointer"
                      variant={stock ? 'default' : lowStock ? 'warning' : 'destructive'}
                    >
                      {variant.capacity}
                      {variant.unit}
                    </Badge>
                    <span className="text-muted-foreground text-sm">({variant.stock})</span>
                  </div>
                );
              })}
            </div>
          </div>
          {selectedVariant && (
            <div className="flex mt-4 lg:space-x-2 flex-col lg:flex-row lg:mt-2">
              <Badge className="w-min">
                {selectedVariant.capacity}
                {selectedVariant.unit}
              </Badge>
              <div>Najniższa cena w ciągu 30 dni</div>
              <div className="font-semibold">{formatPrice(selectedVariant.priceHistory[0].price)}</div>
            </div>
          )}
          {pricePer100 > 0 && selectedVariant && (
            <div className="flex flex-col relative mb-4">
              <div className="flex mt-4 lg:space-x-2 flex-col lg:flex-row lg:mt-2">
                <Badge className="w-min">
                  {selectedVariant.capacity}
                  {selectedVariant.unit}
                </Badge>
                <div>Cena w przeliczeniu na 100{selectedVariant.unit}</div>
                <div className="font-semibold">{formatPrice(pricePer100)}</div>
              </div>
              {priceDiffPer100 > 0 && (
                <div className="space-x-1 text-muted-foreground text-sm absolute -bottom-5">
                  <Badge className="w-min invisible">
                    {selectedVariant.capacity}
                    {selectedVariant.unit}
                  </Badge>
                  <span className="!ml-2">To aż</span>
                  <span className="font-semibold">{formatPrice(priceDiffPer100)}</span>
                  <span>
                    oszczędności na <span>100{selectedVariant.unit}</span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Detailed informations */}
        <div className={cn('mt-6', product.details.length <= 0 && 'hidden')}>
          <h1 className="text-3xl font-bold">Właściwości</h1>
          <ul className="ml-6">
            {details.map(({ id, content }) => (
              <li key={id} className="flex items-center">
                <TiChevronRight className="w-6 h-6" />
                <span>{content}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Description */}
        {productDescription && (
          <div className="mt-6">
            <h1 className="text-3xl font-bold">Opis produktu</h1>
            <div className="richText space-y-2" dangerouslySetInnerHTML={{ __html: productDescription }} />
          </div>
        )}
        {/* Nutrition facts */}
        {nutritionFact && (
          <div className="mt-4">
            <h1 className="text-3xl font-bold">Wartości odżywcze</h1>
            <Table className="mt-2 min-w-[500px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Wartość odżywcza</TableHead>
                  <TableHead>w 100g produktu</TableHead>
                  <TableHead>W porcji: 3 łyżeczki (12g)</TableHead>
                  <TableHead>%RWS* w porcji</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Tłuszcz</TableCell>
                  <TableCell>{nutritionFact.fat}g</TableCell>
                  <TableCell>{calcServing(nutritionFact.fat)}g</TableCell>
                  <TableCell>{calcDietaryReference(calcServing(nutritionFact.fat ?? 0), 'fat')}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>w tym:</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">kwasy tłuszczowe nasycone</TableCell>
                  <TableCell>{nutritionFact.saturatedFat}g</TableCell>
                  <TableCell>{calcServing(nutritionFact.saturatedFat ?? 0)}g</TableCell>
                  <TableCell>
                    {calcDietaryReference(calcServing(nutritionFact.saturatedFat ?? 0), 'saturated fat')}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">kwasy tłuszczowe jednonienasycone</TableCell>
                  <TableCell>{nutritionFact.monounsaturatedFat}g</TableCell>
                  <TableCell>{calcServing(nutritionFact.monounsaturatedFat ?? 0)}g</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">kwasy tłuszczowe wielonienasycone</TableCell>
                  <TableCell>{nutritionFact.polyunsaturatedFat}g</TableCell>
                  <TableCell>{calcServing(nutritionFact.polyunsaturatedFat ?? 0)}g</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Węglowodany</TableCell>
                  <TableCell>{nutritionFact.carbohydrate}g</TableCell>
                  <TableCell>{calcServing(nutritionFact.carbohydrate ?? 0)}g</TableCell>
                  <TableCell>{calcDietaryReference(calcServing(nutritionFact.carbohydrate ?? 0), 'carbs')}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">w tym cukry</TableCell>
                  <TableCell>{nutritionFact.carbohydrateSugar}g</TableCell>
                  <TableCell>{calcServing(nutritionFact.carbohydrateSugar ?? 0)}g</TableCell>
                  <TableCell>
                    {calcDietaryReference(calcServing(nutritionFact.carbohydrateSugar ?? 0), 'sugar')}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Błonnik</TableCell>
                  <TableCell>{nutritionFact.fiber}g</TableCell>
                  <TableCell>{calcServing(nutritionFact.fiber ?? 0)}g</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Białko</TableCell>
                  <TableCell>{nutritionFact.protein}g</TableCell>
                  <TableCell>{calcServing(nutritionFact.protein ?? 0)}g</TableCell>
                  <TableCell>{calcDietaryReference(calcServing(nutritionFact.protein ?? 0), 'protein')}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sól</TableCell>
                  <TableCell>{nutritionFact.sodium}g</TableCell>
                  <TableCell>{calcServing(nutritionFact.sodium ?? 0)}g</TableCell>
                  <TableCell>{calcDietaryReference(calcServing(nutritionFact.sodium ?? 0), 'sodium')}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
        {/* Feedback */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold">Opinie</h1>
          <p className="text-muted-foreground">Dokonaj zakupu, aby ocenić produkt i dodać opinię.</p>
          {/* Opinions */}
          <div>
            <div className="flex flex-col gap-y-4">
              {opinions.length >= 1 ? (
                <Opinions totalOpinions={product._count.opinions} initialOpinions={opinions} />
              ) : (
                <div className="mt-4">
                  <p className="text-justify">
                    Ten produkt jeszcze nie ma jeszcze opinii. Kup teraz i stań się pierwszą osobą, która podzieli się
                    swoją opinią.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute h-full w-[1px] bg-black/40 -left-24 top-0 hidden lg:block" />
      </div>
    </div>
  );
};
ProductPage.Skeleton = function ShowSkeleton() {
  return (
    <div className="flex justify-center relative flex-col lg:flex-row mb-24 space-y-12 lg:space-y-0">
      <FloatingProduct.Skeleton />
      <div className="2xl:mx-24 lg:mx-16 hidden lg:block" />
      <div className="w-full max-w-2xl lg:max-w-xl relative mx-auto lg:mx-0">
        <div className="mb-1">
          <Skeleton className="w-80 h-9" />
        </div>
        <div className="mt-2 flex flex-col">
          <div className="flex lg:flex-row flex-col lg:space-x-2">
            <div className="flex flex-col">
              <Skeleton className="w-[231px] h-6 mb-1" />
              <Skeleton className="lg:ml-auto w-[150px] h-5" />
            </div>
            <div className="flex flex-wrap space-x-2 mt-1 lg:mt-0">
              <div className="flex flex-col items-center">
                <Skeleton className="w-[55px] h-6 mb-1" />
                <Skeleton className="w-8 h-5" />
              </div>
              <div className="flex flex-col items-center">
                <Skeleton className="w-[55px] h-6 mb-1" />
                <Skeleton className="w-8 h-5" />
              </div>
              <div className="flex flex-col items-center">
                <Skeleton className="w-[55px] h-6 mb-1" />
                <Skeleton className="w-8 h-5" />
              </div>
            </div>
          </div>
          <div className="flex mt-4 lg:space-x-2 flex-col lg:flex-row lg:mt-2 space-y-0.5 lg:space-y-0">
            <Skeleton className="w-[55px] h-6" />
            <Skeleton className="w-[230px] h-6" />
            <Skeleton className="w-[55px] h-6" />
          </div>
        </div>
        <div className="mt-5">
          <Skeleton className="w-48 h-9 mb-1" />
          <div className="flex flex-col space-y-1">
            <Skeleton className="w-[220px] h-6 ml-7" />
            <Skeleton className="w-[250px] h-6 ml-7" />
            <Skeleton className="w-[210px] h-6 ml-7" />
            <Skeleton className="w-[220px] h-6 ml-7" />
            <Skeleton className="w-[275px] h-6 ml-7" />
          </div>
        </div>
        <div className="mt-8">
          <Skeleton className="w-48 h-9" />
          <Skeleton className="w-full h-16 mt-1" />
          <Skeleton className="w-full h-60 mt-2" />
          <Skeleton className="w-full h-36 mt-2" />
        </div>
        <div className="absolute h-full w-[1px] bg-black/40 -left-24 top-0 hidden lg:block" />
      </div>
    </div>
  );
};

export default ProductPage;
