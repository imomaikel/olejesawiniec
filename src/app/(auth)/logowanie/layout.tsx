import Image from 'next/image';
import Link from 'next/link';

const AuthPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full md:h-screen flex items-center mt-16 md:mt-0 justify-start md:justify-center relative flex-col">
      <div className="relative w-[350px] md:w-[400px] flex justify-center">
        <Link href="/sklep">
          <Image src="/signatureBlack.webp" width={300} height={120} alt="podpis" className="object-center" />
        </Link>
      </div>
      {children}
    </div>
  );
};

export default AuthPageLayout;
