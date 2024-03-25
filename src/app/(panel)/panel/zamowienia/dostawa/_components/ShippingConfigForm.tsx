'use client';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PanelShippingConfigValidator, TPanelShippingConfigValidator } from '@/lib/validators/panel';
import { shopRouter } from '@/server/routers/shopRouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/components/providers/TRPC';
import { inferRouterOutputs } from '@trpc/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { errorToast } from '@/lib/utils';
import { toast } from 'sonner';

type TShippingConfigForm = {
  data: Exclude<inferRouterOutputs<typeof shopRouter>['getShippingConfig']['data'], undefined>;
};
const ShippingConfigForm = ({ data }: TShippingConfigForm) => {
  const { courierPrice, inpostFreeShippingOverPrice, inpostPrice } = data;

  const form = useForm<TPanelShippingConfigValidator>({
    defaultValues: {
      courierPrice,
      inpostFreeShippingOverPrice,
      inpostPrice,
    },
    resolver: zodResolver(PanelShippingConfigValidator),
  });

  const { mutate: updateShippingPrice, isLoading } = trpc.panel.updateShippingPrice.useMutation();

  const onSubmit = (values: TPanelShippingConfigValidator) => {
    updateShippingPrice(
      {
        ...values,
      },
      {
        onSuccess: ({ error }) => {
          if (error) return errorToast();
          toast.success('Ceny zostały zaktualizowane!');
        },
        onError: () => errorToast(),
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xs">
        <FormField
          control={form.control}
          name="courierPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cena wysyłki za pobraniem</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  type="number"
                  onChange={(e) => form.setValue('courierPrice', parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inpostPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cena wysyłki do paczkomatu</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  type="number"
                  onChange={(e) => form.setValue('inpostPrice', parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inpostFreeShippingOverPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Darmowa wysyłka (paczkomat)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  type="number"
                  onChange={(e) => form.setValue('inpostFreeShippingOverPrice', parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>Od tej kwoty, wysyłka do paczkomatu będzie darmowa.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          Aktualizuj
        </Button>

        <Button
          className="w-full"
          type="button"
          disabled={isLoading}
          onClick={() => {
            form.reset();
          }}
          variant="secondary"
        >
          Resetuj
        </Button>
      </form>
    </Form>
  );
};

export default ShippingConfigForm;
