import Image from 'next/image';
import Link from 'next/link';

const AuthPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-h-screen overflow-y-auto h-screen flex items-center justify-center py-12">
      <div className="w-full flex items-center relative flex-col my-auto">
        <div className="relative w-[350px] md:w-[400px] flex justify-center">
          <Link href="/sklep">
            <Image src="/signatureBlack.webp" width={300} height={120} alt="podpis" className="object-center" />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthPageLayout;
