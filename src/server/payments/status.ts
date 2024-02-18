import {
  TPaymentGateway400,
  TPaymentGateway401,
  TPaymentStatusGateway200,
  TPaymentStatusGatewayResponse,
} from './types';
import crypto from 'node:crypto';

const SHOP_ID = process.env.SHOP_ID;
const SHOP_SECRET = process.env.SHOP_SECRET;

export const _getTransactionStatus = async (
  orderId: string,
  method: 'TEST' | 'PRODUCTION',
): Promise<TPaymentStatusGatewayResponse> => {
  try {
    const baseUrl = method === 'PRODUCTION' ? 'https://pay.cashbill.pl/ws/rest' : 'https://pay.cashbill.pl/testws/rest';

    const hash = crypto.createHash('sha1');
    hash.update(`${orderId}${SHOP_SECRET}`);

    const sign = hash.digest('hex');

    const url = `${baseUrl}/payment/${SHOP_ID}/${orderId}?sign=${sign}`;

    let response: Response | undefined;

    await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => {
        response = res;
      })
      .catch((error) => {
        console.log('Get transaction status error:');
        console.log(error);
      });

    if (!response) {
      return {
        statusCode: 400,
        errorMessage: 'Something went wrong',
      };
    }

    if (response.body) {
      if (response.status === 200) {
        const data = (await response.json()) as TPaymentStatusGateway200;
        return data;
      } else if (response.status === 400) {
        const data = (await response.json()) as TPaymentGateway400;
        return data;
      } else if (response.status === 401) {
        const data = (await response.json()) as TPaymentGateway401;
        return data;
      }

      console.log('Create new transaction unknown response status:');
      console.log(response);
    } else {
      console.log('Create new transaction missing body:');
      console.log(response);
    }
  } catch (error) {
    console.log('Get transaction status unknown error:');
    console.log(error);
  }
  return {
    statusCode: 400,
    errorMessage: 'Something went wrong',
  };
};
