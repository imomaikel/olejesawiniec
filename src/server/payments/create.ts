import {
  TNewTransaction,
  TPaymentGateway400,
  TPaymentGateway401,
  TPaymentCreateGateway200,
  TPaymentCreateGatewayResponse,
} from './types';
import crypto from 'node:crypto';

const SHOP_ID = process.env.SHOP_ID;
const SHOP_SECRET = process.env.SHOP_SECRET;

export const _createNewTransaction = async (
  props: TNewTransaction,
  method: 'TEST' | 'PRODUCTION',
): Promise<TPaymentCreateGatewayResponse> => {
  try {
    const baseUrl = method === 'PRODUCTION' ? 'https://pay.cashbill.pl/ws/rest' : 'https://pay.cashbill.pl/testws/rest';

    const {
      amount,
      title,
      additionalData,
      description,
      languageCode,
      negativeReturnUrl,
      paymentChannel,
      personalData,
      referer,
      returnUrl,
    } = props;

    const personalDataToHash = [
      personalData?.firstName,
      personalData?.surname,
      personalData?.email,
      personalData?.country,
      personalData?.city,
      personalData?.postcode,
      personalData?.street,
      personalData?.house,
      personalData?.flat,
      personalData?.ip,
    ]
      .filter((val) => val)
      .join('');

    const toHash = [
      title,
      amount.value,
      amount.currencyCode,
      returnUrl,
      description,
      negativeReturnUrl,
      additionalData,
      paymentChannel,
      languageCode,
      referer,
      personalDataToHash,
      SHOP_SECRET,
    ]
      .filter((val) => val)
      .join('');

    const hash = crypto.createHash('sha1');
    hash.update(toHash);

    const sign = hash.digest('hex');

    const bodyData: TNewTransaction & { sign: string } = { ...props, sign };

    let response: Response | undefined;

    await fetch(`${baseUrl}/payment/${SHOP_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
      .then((res) => {
        response = res;
      })
      .catch((error) => {
        console.log('Create new transaction error:');
        console.log(error);
      });

    if (!response) {
      return {
        statusCode: 400,
        errorMessage: 'Something went wrong',
      };
    }

    if (response.body) {
      console.log(response.status, typeof response.status);
      if (response.status === 200) {
        const data = (await response.json()) as TPaymentCreateGateway200;
        data.statusCode = 200;
        return data;
      } else if (response.status === 400) {
        const data = (await response.json()) as TPaymentGateway400;
        data.statusCode = 400;
        return data;
      } else if (response.status === 401) {
        const data = (await response.json()) as TPaymentGateway401;
        data.statusCode = 401;
        return data;
      }

      console.log('Create new transaction unknown response status:');
      console.log(response);
    } else {
      console.log('Create new transaction missing body:');
      console.log(response);
    }
  } catch (error) {
    console.log('Create new transaction unknown error:');
    console.log(error);
  }
  return {
    statusCode: 400,
    errorMessage: 'Something went wrong',
  };
};
