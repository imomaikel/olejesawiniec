import { Link, Section, Text } from '@react-email/components';
import { MailTemplate } from '../MailTemplate';
import { render } from '@react-email/render';

type TNewsletterMail = {
  confirmUrl: string;
};
export const NewsletterMail = ({ confirmUrl }: TNewsletterMail) => {
  return (
    <MailTemplate title="Potwierdź zapisanie się do Newsletter'a">
      <Section>
        <Text>Szanowny Użytkowniku,</Text>
        <Text>
          Dziękujemy za zapisanie się do naszego newslettera! Jesteśmy bardzo zadowoleni, że dołączyłeś do naszej
          społeczności.
        </Text>
        <Text>
          Abyśmy mogli potwierdzić Twoją subskrypcję i regularnie dostarczać Ci najnowsze informacje, promocje i ciekawe
          treści, prosimy Cię o kliknięcie w poniższy przycisk:
        </Text>
        <Link className="py-2 px-4 bg-muted border shadow-lg rounded underline text-brand" href={confirmUrl}>
          Potwierdź zapis
        </Link>
        <Text>
          Jeśli nie chcesz otrzymywać naszych wiadomości, możesz w każdej chwili zrezygnować z subskrypcji, klikając w
          link do wypisania się znajdujący się na dole każdego naszego maila.
        </Text>
      </Section>
    </MailTemplate>
  );
};

const NewsletterMailPage = () => {
  // TODO
  const plain = render(NewsletterMail({ confirmUrl: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/` }));
  return <div dangerouslySetInnerHTML={{ __html: plain }} />;
};
export default NewsletterMailPage;
