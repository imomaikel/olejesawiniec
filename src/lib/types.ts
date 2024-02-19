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

export type TInPostPointSelect = {
  name: string;
  location_description: string;
  address_details: {
    city: string;
    province: string;
    post_code: string;
    street: string;
    building_number: string | null;
    flat_number: string | null;
  };
  image_url: string | null;
};
