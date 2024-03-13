import { Html, Head, Preview, Body, Container, Section, Img, Heading, Link, Text } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

type TMailTemplate = {
  children: React.ReactNode;
  title: string;
};
export const MailTemplate = ({ children, title }: TMailTemplate) => {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#16a34a',
                muted: '#f4f4f5',
                'muted-foreground': '#71717a',
              },
            },
          },
        }}
      >
        <Body className="bg-background my-auto mx-auto font-sans">
          <Container className="border border-1 rounded my-10 mx-auto p-5 max-w-screen-sm relative text-center">
            <Container className="mx-6">
              <Section className="mt-8">
                <Img
                  src={`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/signatureBlack.png`}
                  alt="podpis"
                  className="my-0 mx-auto w-[330px] h-[134px]"
                />
              </Section>
              <Heading as="h1" className="text-2xl font-bold text-center p-0 my-3 mx-0">
                <Link href={process.env.NEXT_PUBLIC_PRODUCTION_URL} className="!text-black">
                  Olejesawiniec.pl
                </Link>
              </Heading>
              <Heading as="h2" className="font-semibold text-lg text-center">
                {title}
              </Heading>
              {children}
              <Container className="relative">
                <Container className="w-full h-full absolute" />
                <Img
                  src={`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/nature.webp`}
                  className="w-full max-h-36 object-cover"
                />
              </Container>
              <Section className="text-right">
                <Text className="text-muted-foreground">Olejarnia w zgodzie z naturą</Text>
              </Section>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
