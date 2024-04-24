'use client';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderDetailsSchema, TOrderDetailsSchema } from '@/lib/validators/order';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { errorToast, formatPrice } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { calculateShipping } from '@/lib/shipping';
import { trpc } from '@/components/providers/TRPC';
import { TInPostPointSelect } from '@/lib/types';
import { Button } from '@/components/ui/button';
import CartItems from './_components/CartItems';
import { Input } from '@/components/ui/input';
import { ShippingType } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useForm } from 'react-hook-form';
import InPost from './_components/InPost';
import { fbPixel } from '@/lib/pixel';
import Image from 'next/image';
import { toast } from 'sonner';
import Link from 'next/link';

const OrderPage = () => {
  const [inPostMachine, setInPostMachine] = useState<{
    description: string;
    imageUrl: string;
  } | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingType>('INPOST');
  const [shippingPrice, setShippingPrice] = useState<number | null>();
  const user = useCurrentUser();

  const { onOpenChange: closeCart } = useCart();
  const router = useRouter();

  useEffect(() => closeCart(), [closeCart]);

  const { data: cartData } = trpc.basket.get.useQuery(undefined, {
    retry: 1,
  });
  const { data: shippingConfig } = trpc.shop.getShippingConfig.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { mutate: pay, isLoading } = trpc.basket.pay.useMutation();

  const form = useForm<TOrderDetailsSchema>({
    resolver: zodResolver(OrderDetailsSchema),
    defaultValues: {
      email: '',
      firstName: '',
      phone: '',
      surname: '',
      inpostData: {
        buildingNumber: '',
        city: '',
        flatNumber: '',
        name: '',
        postCode: '',
        province: '',
        street: '',
      },
      courierData: {
        building: '',
        city: '',
        flat: '',
        postCode: '',
        province: '',
        street: '',
      },
      method: 'INPOST',
    },
  });

  useEffect(() => {
    if (user?.email && form.getValues('email').length <= 0) {
      form.setValue('email', user.email);
      fbPixel('InitiateCheckout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const onSubmit = (values: TOrderDetailsSchema) => {
    toast.info('Za chwilę nastąpi przekierowanie...', { duration: 6000 });
    pay(
      {
        personalDetails: {
          ...values,
        },
        shippingMethod: form.getValues('method'),
      },
      {
        onSuccess: (data) => {
          if (data?.error) {
            errorToast(data.message);
          } else if (data?.success) {
            router.push(data.redirectUrl);
          }
        },
        onError: () => errorToast(),
      },
    );
  };

  const productsTotalPrice = useMemo(
    () => cartData?.reduce((acc, curr) => (acc += curr.quantity * curr.variant.price), 0) || 0,
    [cartData],
  );

  useEffect(() => {
    calculateShipping({
      method: shippingMethod,
      productsTotalPrice,
    }).then((res) => {
      if (res !== 'error') {
        setShippingPrice(res);
      }
    });
  }, [productsTotalPrice, shippingMethod]);

  const onPointSelect = (point: TInPostPointSelect) => {
    toast.info(`Wybrano punkt "${point.name}"`);

    const machineDescription = point.location_description || '';
    const machineImageUrl = point.image_url || '';

    if (machineDescription.length >= 3 && machineImageUrl.length >= 3) {
      setInPostMachine({
        description: machineDescription,
        imageUrl: machineImageUrl,
      });
    }

    const buildingNumber = point.address_details.building_number || '';
    const flatNumber = point.address_details.flat_number || '';

    let street = `${point.address_details.street}`;
    if (buildingNumber.length >= 1) {
      street += ` ${buildingNumber}`;
    }
    if (flatNumber.length >= 1) {
      street += `/${flatNumber}`;
    }

    form.setValue('inpostData.postCode', point.address_details.post_code);
    form.setValue('inpostData.province', point.address_details.province);
    form.setValue('inpostData.street', street);
    form.setValue('inpostData.city', point.address_details.city);
    form.setValue('inpostData.name', point.name);
    form.setValue('inpostData.buildingNumber', buildingNumber);
    form.setValue('inpostData.flatNumber', flatNumber);
    form.trigger([
      'inpostData.name',
      'inpostData.province',
      'inpostData.postCode',
      'inpostData.city',
      'inpostData.street',
    ]);
  };

  // TODO Skeleton
  if (!cartData) return null;

  const shipping = shippingConfig?.data;

  return (
    <div className="mb-12">
      <h1 className="text-2xl font-bold">Aktualny koszyk</h1>
      <CartItems items={cartData} />
      <div className="mb-6 mt-3 flex items-center space-x-1">
        <span>Cena wszystkich produktów:</span> <Badge>{formatPrice(productsTotalPrice)}</Badge>
      </div>
      <Separator className="mb-6" />
      <h1 className="text-2xl font-bold">Dostawa</h1>
      <div className="space-y-2">
        <div className="flex items-center space-x-1">
          <span>Wybrana metoda dostawy:</span>{' '}
          <Badge>{shippingMethod === 'COURIER' ? 'Kurier za pobraniem' : 'Paczkomat'}</Badge>
        </div>
        <div className="flex items-start space-x-1">
          <span>Cena dostawy:</span>{' '}
          {typeof shippingPrice === 'number' ? (
            <Badge>{formatPrice(shippingPrice)}</Badge>
          ) : (
            <Badge>Obliczanie...</Badge>
          )}
        </div>
        {shippingMethod === 'INPOST' && shipping && (
          <div className="flex items-center space-x-1">
            <span>Darmowa dostawa do paczkomatu od:</span>{' '}
            <Badge>{formatPrice(shipping.inpostFreeShippingOverPrice)}</Badge>
          </div>
        )}
      </div>
      <Separator className="my-6" />
      <h1 className="text-2xl font-bold">Szczegóły</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2 max-w-md">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imię</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwisko</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numer telefonu</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold">Metoda dostawy</h2>
            <Tabs
              defaultValue="machine"
              className="w-full"
              onValueChange={(e) => {
                if (e === 'machine') {
                  setShippingMethod('INPOST');
                  form.setValue('method', 'INPOST');
                } else if (e === 'courier') {
                  setShippingMethod('COURIER');
                  form.setValue('method', 'COURIER');
                }
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="machine">Paczkomat - Przedpłata</TabsTrigger>
                <TabsTrigger value="courier">Kurier - Za pobraniem</TabsTrigger>
              </TabsList>
              <TabsContent value="machine">
                <div className="my-4">
                  <InPost onSelect={onPointSelect} />
                  <div className="mt-2 bg-destructive/10 rounded-md text-center py-1">
                    <p className="tracking-wide">
                      Jeżeli mapa z paczkomatami nie ładuje się, dane paczkomatu należy wprowadzić ręcznie.
                    </p>
                    <p>
                      Listę paczkomatów można znaleźć{' '}
                      <Link href="https://inpost.pl/znajdz-paczkomat" target="_blank" className="underline">
                        tutaj
                      </Link>
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  Wybierz punkt z mapy powyżej aby automatycznie uzupełnić dane paczkomatu.
                </p>
                <div className="flex w-full lg:items-center max-w-screen-lg justify-between flex-col lg:flex-row space-y-4 lg:space-y-0">
                  <div className="space-y-2 max-w-md w-full">
                    <FormField
                      control={form.control}
                      name="inpostData.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwa paczkomatu</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} placeholder="np: GDY50M" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inpostData.province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Województwo</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} placeholder="np: Pomorskie" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inpostData.postCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kod pocztowy</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} placeholder="np: 81-001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inpostData.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Miejscowość</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} placeholder="np: Gdynia" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inpostData.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adres</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} placeholder="np: Armii Krajowej 23" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {inPostMachine?.description && (
                    <div className="flex flex-col lg:items-center h-min">
                      <div className="w-full lg:w-[420px] h-80 rounded-lg pointer-events-none select-none shadow-lg">
                        <Image
                          src={inPostMachine.imageUrl}
                          alt="Miejsce paczkomatu"
                          width={0}
                          height={0}
                          priority
                          loading="eager"
                          onError={() => setInPostMachine({ ...inPostMachine, imageUrl: '/inpost.png' })}
                          quality={60}
                          sizes="100vw"
                          className="h-full w-full max-h-80 object-cover object-center rounded-lg"
                        />
                      </div>
                      <p className="text-muted-foreground">{inPostMachine.description}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="courier">
                <div className="space-y-2 max-w-md w-full">
                  <FormField
                    control={form.control}
                    name="courierData.province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Województwo</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} placeholder="np: Pomorskie" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courierData.postCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kod pocztowy</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} placeholder="np: 81-577" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courierData.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Miejscowość</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} placeholder="np: Gdynia" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courierData.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwa ulicy</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} placeholder="np: Pelikana" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courierData.building"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numer budynku</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} placeholder="np: 61" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courierData.flat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numer mieszkania</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} placeholder="np: 2" />
                        </FormControl>
                        <FormDescription>Opcjonalne</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator className="my-6" />
          <h1 className="text-2xl font-bold">Podsumowanie</h1>
          <Table className="max-w-sm">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-right">Cena</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Produkty</TableCell>
                <TableCell className="text-right">{formatPrice(productsTotalPrice)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Wysyłka</TableCell>
                <TableCell className="text-right">
                  {typeof shippingPrice === 'number' ? formatPrice(shippingPrice) : 'Obliczanie...'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Razem</TableCell>
                <TableCell className="text-right">
                  {shippingMethod === 'COURIER' ? (
                    <div className="space-x-2">
                      <span className="text-muted-foreground">(Za pobraniem - {formatPrice(productsTotalPrice)})</span>
                      <span>{formatPrice(shippingPrice || 0)}</span>
                    </div>
                  ) : (
                    formatPrice(productsTotalPrice + (shippingPrice || 0))
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Separator className="my-6" />

          <div className="mt-4">
            <Button size="2xl" className="max-w-md w-full" type="submit" disabled={isLoading}>
              Zamawiam i płacę
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderPage;
