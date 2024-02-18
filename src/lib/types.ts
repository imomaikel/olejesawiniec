export type TBasketVariant = {
  quantity: number;
  variant: {
    id: string;
    unit: string;
    price: number;
    capacity: number;
    product: {
      link: string;
      label: string;
      mainPhoto: string | null;
    } | null;
  };
};
