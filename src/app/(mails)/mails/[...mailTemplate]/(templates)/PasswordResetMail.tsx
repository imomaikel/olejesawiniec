import { Container, Link, Section, Text } from '@react-email/components';
import { MailTemplate } from '../MailTemplate';
import { render } from '@react-email/render';

type TPasswordResetMail = {
  username: string;
  dayOrNightTime: 'day' | 'night';
  passwordResetUrl: string;
};
export const PasswordResetMail = ({ username, dayOrNightTime, passwordResetUrl }: TPasswordResetMail) => {
  return (
    <MailTemplate title="Przypomnienie hasła">
      <Section>
        {dayOrNightTime === 'day' ? (
          <Text className="tracking-wide font-medium">Dzień dobry, {username}!</Text>
        ) : (
          <Text className="tracking-wide font-medium">Dobry wieczór, {username}!</Text>
        )}
        <Text>
          Otrzymujesz tę wiadomość, ponieważ poprosiłeś/poprosiłaś o przypomnienie hasła do Twojego konta na naszej
          stronie.
        </Text>
        <Text>Aby ustanowić nowe hasło, proszę kliknij poniższy link:</Text>

        <Container className="my-6">
          <Link className="py-2 px-4 bg-muted border shadow-lg rounded underline text-brand" href={passwordResetUrl}>
            Ustaw nowe hasło
          </Link>
        </Container>

        <Text>
          Po kliknięciu na link zostaniesz przekierowany/przekierowana do strony, gdzie będziesz mógł/mogła wprowadzić
          nowe hasło dostępu.
        </Text>

        <Text className="text-muted-foreground text-sm">Link do zmiany hasła jest wazny przez 30 minut.</Text>
      </Section>
    </MailTemplate>
  );
};

const PasswordResetMailPage = () => {
  // TODO
  const plain = render(
    PasswordResetMail({
      passwordResetUrl: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/`,
      username: 'Michał',
      dayOrNightTime: 'night',
    }),
  );
  return <div dangerouslySetInnerHTML={{ __html: plain }} />;
};
export default PasswordResetMailPage;
