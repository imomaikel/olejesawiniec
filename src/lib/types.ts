export type TPixelAction =
  | 'AddPaymentInfo'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'InitiateCheckout'
  | 'Lead'
  | 'Purchase'
  | 'Schedule'
  | 'Search'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe'
  | 'ViewContent'
  | 'PageView';

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
