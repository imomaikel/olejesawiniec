import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PanelVariantValidator, TPanelVariantValidator } from '@/lib/validators/panel';
import { errorToast, successToast } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

type TNewVariant = {
  productId: string;
  refetchProduct: () => void;
};
const NewVariant = ({ productId, refetchProduct }: TNewVariant) => {
  const form = useForm<TPanelVariantValidator>({
    resolver: zodResolver(PanelVariantValidator),
    defaultValues: {
      capacity: 100,
      price: 20,
      stock: 10,
      unit: 'ml',
    },
  });

  const { mutate: createVariant, isLoading } = trpc.panel.createVariant.useMutation({
    onSuccess: ({ status, message }) => {
      if (status === 'success') {
        refetchProduct();
        successToast(message!);
      } else {
        errorToast(message);
      }
    },
    onError: () => errorToast(),
  });

  const onSubmit = ({ capacity, price, stock, unit }: TPanelVariantValidator) => {
    createVariant({
      options: { unit, capacity, price, stock },
      productId: productId,
    });
  };

  return (
    <>
      <h3 className="mt-4 font-medium">Dodaj nową opcję</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-col xl:flex-row lg:space-y-4">
          <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-2 mr-0 lg:mr-4 lg:space-y-0 space-y-4 w-full lg:w-auto">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pojemność</FormLabel>
                  <FormControl>
                    <Input placeholder="100" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jednostka</FormLabel>
                  <FormControl>
                    <Input placeholder="ml" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stan magazynowy</FormLabel>
                  <FormControl>
                    <Input placeholder="10" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cena</FormLabel>
                  <FormControl>
                    <Input placeholder="20" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" size="xl" disabled={isLoading} className="rounded-full w-full mt-4 mlg:mt-0 lg:w-auto">
            Dodaj
          </Button>
        </form>
      </Form>
    </>
  );
};

export default NewVariant;
