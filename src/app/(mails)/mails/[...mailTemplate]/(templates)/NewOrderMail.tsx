import { Container, Section, Text, Link, Row, Column } from '@react-email/components';
import { MailTemplate } from '../MailTemplate';
import { render } from '@react-email/render';
import { formatPrice } from '@/lib/utils';

type TNewOrderMail = {
  orderUrl: string;
  orderId: string;
  username: string;
  dayOrNightTime: 'day' | 'night';
  supportMail: string;
  supportPhoneNumber: string;
  products: {
    label: string;
    price: number;
    variant: string;
    quantity: number;
  }[];
  shippingPrice?: number;
};
export const NewOrderMail = ({
  username,
  dayOrNightTime,
  orderId,
  orderUrl,
  supportMail,
  supportPhoneNumber,
  products,
  shippingPrice = 0,
}: TNewOrderMail) => {
  const toalPrice = products.reduce((acc, curr) => (acc += curr.price), shippingPrice);

  return (
    <MailTemplate title={`Aktualizacja statusu zamówienia ${orderId}`}>
      <Section>
        {dayOrNightTime === 'day' ? (
          <Text className="tracking-wide font-medium">Dzień dobry, {username}!</Text>
        ) : (
          <Text className="tracking-wide font-medium">Dobry wieczór, {username}!</Text>
        )}
        <Text>
          Dziękujemy za złożenie zamówienia w naszym sklepie online! Jesteśmy bardzo wdzięczni za Twoje zaufanie.
        </Text>
        <Text>Oto szczegóły Twojego zamówienia:</Text>

        <Section>
          <Row className="text-center font-semibold">
            <Column className="border w-[45%] p-2">Produkt</Column>
            <Column className="border w-[20%] p-2">Pojemność</Column>
            <Column className="border w-[10%] p-2">Ilość</Column>
            <Column className="border w-[25%] p-2">Cena</Column>
          </Row>
          {products.map(({ label, price, quantity, variant }) => (
            <Row key={`${label}${variant}`} className="text-center">
              <Column className="border w-[45%]">{label}</Column>
              <Column className="border w-[20%]">{variant}</Column>
              <Column className="border w-[10%]">{quantity}</Column>
              <Column className="border w-[25%]">{formatPrice(price)}</Column>
            </Row>
          ))}
          {shippingPrice !== 0 && (
            <Row>
              <Column className="w-[45%] border" />
              <Column className="border w-[30%] text-center">Cena wysyłki</Column>
              <Column className="border w-[25%] text-center">{formatPrice(shippingPrice)}</Column>
            </Row>
          )}
          <Row>
            <Column className="w-[45%] border" />
            <Column className="border w-[30%] text-center font-semibold">Cena całkowita</Column>
            <Column className="border w-[25%] text-center">{formatPrice(toalPrice)}</Column>
          </Row>
        </Section>

        <Container className="my-6">
          <Link className="py-2 px-4 bg-muted border shadow-lg rounded underline text-brand" href={orderUrl}>
            Zobacz zamówienie
          </Link>
        </Container>

        <Text className="text-muted-foreground max-w-[80%] mx-auto">
          Jeśli masz jakiekolwiek pytania dotyczące Twojego zamówienia lub potrzebujesz dodatkowych informacji, prosimy
          o kontakt pod adresem <Link href={`mailto:${supportMail}`}>{supportMail}</Link> lub numerem telefonu{' '}
          <Link href={`tel:${supportPhoneNumber}`}>{supportPhoneNumber}</Link>
        </Text>
      </Section>
    </MailTemplate>
  );
};

const NewOrderMailPage = () => {
  // TODO
  const plain = render(
    NewOrderMail({
      orderUrl: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/`,
      username: 'Michał',
      dayOrNightTime: 'night',
      orderId: '#asnho9ws',
      shippingPrice: 15,
      supportMail: 'support@gmail.com',
      supportPhoneNumber: '123123123',
      products: [
        {
          label: 'Olej rzepakowy',
          price: 20,
          quantity: 1,
          variant: '100ml',
        },
        {
          label: 'Olej lniany',
          price: 22,
          quantity: 2,
          variant: '100ml',
        },
      ],
    }),
  );
  return <div dangerouslySetInnerHTML={{ __html: plain }} />;
};
export default NewOrderMailPage;
