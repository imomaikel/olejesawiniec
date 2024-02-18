export type TNewTransaction = {
  title: string;
  amount: {
    value: number;
    currencyCode: 'PLN';
  };
  description?: string;
  additionalData?: string;
  returnUrl?: string;
  negativeReturnUrl?: string;
  paymentChannel?: string;
  languageCode: 'PL' | 'EN';
  personalData?: {
    firstName?: string;
    surname?: string;
    email?: string;
    country?: string;
    city?: string;
    postcode?: string;
    street?: string;
    house?: string;
    flat?: string;
    ip?: string;
  };
  referer?: string;
};
export type TPaymentCreateGateway200 = {
  statusCode: 200;
  id: string;
  redirectUrl: string;
  additional?: string;
};
export type TPaymentGateway400 = {
  statusCode: 400;
  errorMessage: 'Illegal signature' | 'Something went wrong';
};
export type TPaymentGateway401 = {
  statusCode: 401;
  errorMessage: 'sign is required field';
};

export type TPaymentCreateGatewayResponse = TPaymentCreateGateway200 | TPaymentGateway400 | TPaymentGateway401;

type TPaymentStatusLabel =
  | 'PreStart'
  | 'Start'
  | 'NegativeAuthorization'
  | 'Abort'
  | 'Fraud'
  | 'PositiveAuthorization'
  | 'PositiveFinish'
  | 'NegativeFinish';

/*
PreStart	Payment has been started. Customer has not yet choosen payment channel.
Start	Payment has been started. Customer has not yet paid.
NegativeAuthorization	Payment Channel has refused payment (ie. insufficient funds).
Abort	Customer has aborted the payment.
Fraud	Payment Channel has refused payment and classified is as fraudant. This is a final status and cannot change.
PositiveAuthorization	Payment Channel has accepted transaction for processing.
PositiveFinish	Payment Channel has confirmed transfer of funds. This is a final status and cannot change.
NegativeFinish	Payment Channel has refused transfer of funds. This is a final status and cannot change.
*/

export type TPaymentStatusGateway200 = {
  id: string;
  paymentChannel: string;
  amount: {
    value: number;
    currencyCode: string;
  };
  requestedAmount: {
    value: number;
    currencyCode: string;
  };
  title: string;
  description: string;
  personalData: {
    firstName: string;
    surname: string;
    email: string;
    country: string;
    city: string;
    postcode: string;
    street: string;
    house: string;
    flat: string;
    ip: string;
  };
  additionalData: string;
  status: TPaymentStatusLabel;
  details: {
    bankId: string;
  };
};

export type TPaymentStatusGatewayResponse = TPaymentGateway400 | TPaymentGateway401 | TPaymentStatusGateway200;
