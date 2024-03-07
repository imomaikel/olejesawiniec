import { Html, Head, Preview, Body, Container, Section, Img, Heading, Link } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

type TNewsletterMail = {};
const NewsletterMail = ({}: TNewsletterMail) => {
  return (
    <Html>
      <Head />
      <Preview>Potwierdź zapisanie się do Newsletter&apos;a</Preview>
      <Tailwind>
        <Body className="bg-background my-auto mx-auto font-sans px-2">
          <Container className="border border-1 rounded-md my-10 mx-auto p-5 max-w-screen-sm ">
            <Section className="mt-8">
              <Img src="/signatureBlack.png" alt="podpis" className="my-0 mx-auto w-[330px] h-[134px]" />
            </Section>
            <Heading className="text-2xl font-bold text-center p-0 my-6 mx-0">
              <Link href={process.env.NEXT_PUBLIC_PRODUCTION_URL} className="!text-black">
                Olejesawiniec.pl
              </Link>
            </Heading>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
NewsletterMail.Preview = function ShowPreview() {
  return <NewsletterMail />;
};

export default NewsletterMail;
