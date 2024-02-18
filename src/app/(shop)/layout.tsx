import { Separator } from '@/components/ui/separator';
import AfterLogin from '@/components/AfterLogin';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const ShopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen border justify-between">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col relative px-8 md:px-12">
        <Navbar className="relative mt-4" textColor="black" topPadding={0} />

        <Separator className="my-4" />

        {children}
      </div>
      <Footer />
      <AfterLogin />
    </div>
  );
};

export default ShopLayout;
