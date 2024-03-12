import { Link, Section, Text } from '@react-email/components';
import { MailTemplate } from '../MailTemplate';
import { render } from '@react-email/render';

type TSignUpMail = {
  username: string;
  confirmUrl: string;
  dayOrNightTime: 'day' | 'night';
};
export const SignUpMail = ({ confirmUrl, username, dayOrNightTime }: TSignUpMail) => {
  return (
    <MailTemplate title="Potwierdź swój adres e-mail">
      <Section>
        {dayOrNightTime === 'day' ? (
          <Text className="tracking-wide font-medium">Dzień dobry, {username}!</Text>
        ) : (
          <Text className="tracking-wide font-medium">Dobry wieczór, {username}!</Text>
        )}
        <Text>Dziękujemy za rejestrację na naszej stronie! Jesteśmy podekscytowani, że jesteś z nami.</Text>
        <Text>
          Abyśmy mogli dokończyć proces rejestracji i zapewnić Ci pełen dostęp do naszych funkcji, prosimy o
          potwierdzenie swojego konta poprzez kliknięcie w poniższy przycisk:
        </Text>
        <Link className="py-2 px-4 bg-muted border shadow-lg rounded underline text-brand" href={confirmUrl}>
          Potwierdź rejestrację
        </Link>
        <Text>
          Dzięki potwierdzeniu swojej rejestracji będziesz mógł/mogła cieszyć się pełnymi korzyściami naszej platformy.
        </Text>
        <Text className="text-muted-foreground text-sm">
          Jeśli nie rejestrowałeś/rejestrowałaś się na naszej stronie, zignoruj tę wiadomość.
        </Text>
      </Section>
    </MailTemplate>
  );
};

const SignUpMailPage = () => {
  // TODO
  const plain = render(
    SignUpMail({
      confirmUrl: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/`,
      username: 'Michał',
      dayOrNightTime: 'night',
    }),
  );
  return <div dangerouslySetInnerHTML={{ __html: plain }} />;
};
export default SignUpMailPage;
