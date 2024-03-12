import { Link, Section, Text, Container } from '@react-email/components';
import { translatePaymentStatus } from '@/lib/utils';
import { MailTemplate } from '../MailTemplate';
import { PaymentStatus } from '@prisma/client';
import { render } from '@react-email/render';

type TOrderUpdateMail = {
  orderUrl: string;
  orderId: string;
  username: string;
  dayOrNightTime: 'day' | 'night';
  supportMail: string;
  supportPhoneNumber: string;
  oldOrderStatus: PaymentStatus;
  newOrderStatus: PaymentStatus;
  nextOrderStatus?: PaymentStatus;
};
export const OrderUpdateMail = ({
  orderId,
  orderUrl,
  username,
  dayOrNightTime,
  supportMail,
  supportPhoneNumber,
  newOrderStatus,
  oldOrderStatus,
  nextOrderStatus,
}: TOrderUpdateMail) => {
  return (
    <MailTemplate title={`Aktualizacja statusu zamówienia ${orderId}`}>
      <Section>
        {dayOrNightTime === 'day' ? (
          <Text className="tracking-wide font-medium">Dzień dobry, {username}!</Text>
        ) : (
          <Text className="tracking-wide font-medium">Dobry wieczór, {username}!</Text>
        )}
        <Text>
          Chcieliśmy Cię poinformować, że status Twojego zamówienia został zaktualizowany. Oto najnowsze informacje:
        </Text>
        <Container>
          <Text>
            Poprzedni status zamówienia:{' '}
            <span className="p-2 bg-secondary border rounded-md font-semibold">
              {translatePaymentStatus(oldOrderStatus)}
            </span>
          </Text>
          <Text>
            Obecny status zamówienia:{' '}
            <span className="p-2 bg-brand rounded-md text-white font-semibold">
              {translatePaymentStatus(newOrderStatus)}
            </span>
          </Text>
          {nextOrderStatus && (
            <Text>
              Następny status zamówienia:{' '}
              <span className="p-2 bg-secondary border rounded-md font-semibold">
                {translatePaymentStatus(nextOrderStatus)}
              </span>
            </Text>
          )}
        </Container>
        <Container className="my-4">
          <Link className="py-2 px-4 bg-muted border shadow-lg rounded underline text-brand" href={orderUrl}>
            Zobacz zamówienie
          </Link>
        </Container>
        <Text className="text-muted-foreground max-w-[80%] mx-auto">
          Jeśli masz jakiekolwiek pytania dotyczące Twojego zamówienia lub potrzebujesz dodatkowych informacji, prosimy
          o kontakt pod adresem <Link href={`mailto:${supportMail}`}>{supportMail}</Link> lub numerem telefonu{' '}
          <Link href={`tel:${supportPhoneNumber}`}>{supportPhoneNumber}</Link>
        </Text>
        <Text>Dziękujemy za złożenie zamówienia. Doceniamy Twoje zaufanie.</Text>
      </Section>
    </MailTemplate>
  );
};

const OrderUpdateMailPage = () => {
  // TODO
  const plain = render(
    OrderUpdateMail({
      orderUrl: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/`,
      username: 'Michał',
      dayOrNightTime: 'night',
      orderId: '#asnho9ws',
      newOrderStatus: 'Order_processing',
      oldOrderStatus: 'PositiveFinish',
      supportMail: 'support@gmail.com',
      supportPhoneNumber: '123123123',
      nextOrderStatus: 'Order_ready',
    }),
  );
  return <div dangerouslySetInnerHTML={{ __html: plain }} />;
};
export default OrderUpdateMailPage;
