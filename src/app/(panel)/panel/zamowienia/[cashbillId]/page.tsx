'use client';
import {
  cn,
  errorToast,
  formatPrice,
  getNextPaymentSteps,
  relativeDate,
  translatePaymentStatus,
  translateShippingMethod,
} from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useParams, useRouter } from 'next/navigation';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { TOrderStatus } from '@/utils/constans';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import InfoBox from './_components/InfoBox';
import { useRef } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

const PanelOrderPage = () => {
  const router = useRouter();
  const { cashbillId } = useParams<{ cashbillId: string }>();
  const sendMail = useRef(true);

  const { data: order, isLoading, refetch } = trpc.panel.getOrder.useQuery({ cashbillId });
  const { mutate: changeOrderStatus, isLoading: statusUpdating } = trpc.panel.changeOrderStatus.useMutation();
  const { mutate: verifyOrder, isLoading: isVerifying, data: verifiedOrder } = trpc.panel.verifyOrder.useMutation();

  const handleStatusChange = (nextStep: TOrderStatus) => {
    changeOrderStatus(
      { cashbillId, nextStatus: nextStep, sendMail: sendMail.current },
      {
        onSuccess: ({ message, error, success }) => {
          if (success) {
            toast.success(message);
            refetch();
          } else if (error) {
            errorToast(message);
          }
        },
        onError: () => errorToast(),
      },
    );
  };

  const handleVerifyOrder = () => {
    verifyOrder(
      { cashbillId },
      {
        onSuccess: (verifiedOrder) => {
          if (verifiedOrder.success) {
            const { amount, personalData, requestedAmount } = verifiedOrder;
            console.log(amount, personalData, requestedAmount);
          } else {
            errorToast(verifiedOrder.message);
          }
        },
        onError: () => errorToast(),
      },
    );
  };

  if (isLoading) return 'Loading';
  if (!order) {
    router.replace('/panel/zamowienia');
    return;
  }

  const {
    firstName,
    surname,
    email,
    phone,
    status,
    createdAt,
    updatedAt,
    user,
    userId,
    productsPrice,
    shippingPrice,
    totalProducts,
    products,
    shipping,
  } = order;

  const translatedStatus = translatePaymentStatus(status);
  const translatedShipping = translateShippingMethod(shipping?.method ?? 'INPOST');
  const inpostBuilding = shipping?.inpostBuildingNumber ?? '';
  const inpostFlat = shipping?.inpostFlatNumber ?? '';
  const courierFlat = shipping?.courierFlat ?? '';
  const nextPossibleSteps = getNextPaymentSteps(status);

  return (
    <div className="flex flex-col space-y-8 mb-16">
      <div className="flex items-center">
        <h1 className="text-4xl font-bold">{cashbillId}</h1>
        <Button onClick={() => router.back()} variant="link" className="text-muted-foreground flex items-center">
          Powrót
          <IoArrowBackOutline className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Szczegóły zamówienia</h2>
        <div className="mt-3">
          <h3 className="font-semibold text-xl">Klient</h3>
          <div className="flex flex-wrap gap-4">
            <InfoBox content={firstName} title="Imię" />
            <InfoBox content={surname} title="Nazwisko" />
            <InfoBox content={email} title="Email w zamówieniu" />
            <InfoBox content={user.email} title="Email konta" />
            <InfoBox
              content={
                <a href={`tel:${phone}`} className="underline">
                  {phone}
                </a>
              }
              raw={phone}
              title="Numer telefonu"
            />
            <InfoBox content={userId} title="Identyfikator użytkownika" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-xl">Zamówienie</h3>
          <div className="flex flex-wrap gap-4">
            <InfoBox content={<Badge>{translatedStatus}</Badge>} title="Status" raw={translatedStatus} />
            <InfoBox content={relativeDate(createdAt)} title="Zarejestrowane" />
            <InfoBox content={relativeDate(updatedAt)} title="Ostatnia aktualizacja" />
            <InfoBox content={cashbillId} title="Numer zamówienia" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-xl">Zarządzanie statusem</h3>
          <div>
            <div className="space-x-2">
              <span className="tracking-wide font-medium">Aktualny Status</span>
              <Badge>{translatedStatus}</Badge>
            </div>
            {nextPossibleSteps.length >= 1 ? (
              <>
                <div className="flex items-center space-x-1 my-1">
                  <Checkbox
                    className="h-6 w-6"
                    defaultChecked
                    onCheckedChange={(checked) => (sendMail.current = !!checked)}
                  />
                  <Label className="pt-1">Wyślij email do klienta o zmianie statusu</Label>
                </div>
                <div>
                  <p className="text-muted-foreground tracking-wide">Kliknij aby zmienić status</p>
                  <div className="flex flex-wrap gap-4">
                    {nextPossibleSteps.map((step) => (
                      <Badge
                        key={step.key}
                        variant="secondary"
                        role="button"
                        onClick={() => handleStatusChange(step.key)}
                        className={cn(
                          'ring-1 ring-primary cursor-pointer transition-colors',
                          !statusUpdating && 'hover:bg-primary/50',
                        )}
                      >
                        {step.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Aktualnie nie ma możliwości zmiany statusu.</p>
            )}
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-xl">Produkty</h3>
          <div className="flex flex-wrap gap-4">
            <InfoBox content={formatPrice(productsPrice)} title="Cena produktów" />
            <InfoBox content={totalProducts.toString()} title="Ilość produktów" />
          </div>
          <div className="mt-2">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Pokaż/ukryj produkty</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produkt</TableHead>
                        <TableHead>Pojemność</TableHead>
                        <TableHead>Ilość</TableHead>
                        <TableHead>Uwagi</TableHead>
                        <TableHead>Zapłacono</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => {
                        const { id, productName, productQuantity, productCapacity, productUnit, productPrice } =
                          product;
                        const productLink = product.originalProduct?.link || null;
                        const productEnabled = product.originalProduct?.enabled;
                        const productExists = typeof productEnabled === 'boolean';

                        return (
                          <TableRow key={`${index}${id}`}>
                            <TableCell>
                              {productExists ? (
                                <div className="flex flex-col">
                                  {productLink && productEnabled ? (
                                    <Link href={`/sklep/${productLink}`} className="underline">
                                      {productName}
                                    </Link>
                                  ) : (
                                    <span>{productName}</span>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {productEnabled ? 'Aktualnie włączony' : 'Aktualnie wyłączony'}
                                  </span>
                                </div>
                              ) : (
                                productName
                              )}
                            </TableCell>
                            <TableCell>
                              {productCapacity}
                              {productUnit}
                            </TableCell>
                            <TableCell>{productQuantity}</TableCell>
                            {/* TODO */}
                            <TableCell>-</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{formatPrice(productQuantity * productPrice)}</span>
                                <span className="text-xs text-muted-foreground">
                                  {productQuantity} * {formatPrice(productPrice)}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-xl">Dostawa</h3>
          <div className="flex flex-wrap gap-4">
            <InfoBox content={formatPrice(shippingPrice)} title="Cena dostawy" />
            <InfoBox content={translatedShipping} title="Metoda dostawy" />
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {shipping?.method === 'INPOST' ? (
              <>
                <InfoBox title="Nazwa paczkomatu" content={shipping.inpostName} />
                <InfoBox title="Województwo" content={shipping.inpostProvince} />
                <InfoBox title="Kod pocztowy" content={shipping.inpostPostCode} />
                <InfoBox title="Miejscowość" content={shipping.inpostCity} />
                <InfoBox title="Nazwa ulicy" content={shipping.inpostStreet} />
                {inpostBuilding.length >= 1 && (
                  <InfoBox title="Numer budynku" content={shipping.inpostBuildingNumber} />
                )}
                {inpostFlat.length >= 1 && <InfoBox title="Numer klatki" content={shipping.inpostFlatNumber} />}
              </>
            ) : (
              <>
                <InfoBox title="Województwo" content={shipping?.courierProvince} />
                <InfoBox title="Kod pocztowy" content={shipping?.courierPostCode} />
                <InfoBox title="Miejscowość" content={shipping?.courierCity} />
                <InfoBox title="Nazwa ulicy" content={shipping?.courierStreet} />
                <InfoBox title="Numer budynku" content={shipping?.courierBuilding} />
                {courierFlat.length >= 1 && <InfoBox title="Numer klatki" content={shipping?.courierFlat} />}
              </>
            )}
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-xl">Weryfikacja CashBill</h3>
          {verifiedOrder ? (
            <>
              <p className="text-muted-foreground">W kwotach poniżej zawarta jest cena dostawy.</p>
              <p className="text-sm text-muted-foreground mb-1">
                Status tutaj musi wskazywać &quot;Zamówienie opłacone&quot;
              </p>
              <div className="flex flex-wrap gap-4">
                <InfoBox
                  title="Status"
                  raw={translatePaymentStatus(verifiedOrder.status!)}
                  content={<Badge>{translatePaymentStatus(verifiedOrder.status!)}</Badge>}
                />
                <InfoBox title="Kwota" content={formatPrice(verifiedOrder.amount?.value ?? 0)} />
                <InfoBox title="Kwota oczekwiana" content={formatPrice(verifiedOrder.requestedAmount?.value ?? 0)} />

                {verifiedOrder.personalData?.firstName && (
                  <InfoBox title="Imię" content={verifiedOrder.personalData.firstName} />
                )}
                {verifiedOrder.personalData?.surname && (
                  <InfoBox title="Nazwisko" content={verifiedOrder.personalData.surname} />
                )}
                {verifiedOrder.personalData?.email && (
                  <InfoBox title="Email" content={verifiedOrder.personalData.email} />
                )}
              </div>
            </>
          ) : (
            <Button disabled={isVerifying} onClick={handleVerifyOrder}>
              Kliknij aby zweryfikować
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelOrderPage;
// TODO Custom features
// TODO see user's orders
