import { Separator } from '@/components/ui/separator';
import AfterLogin from '@/components/AfterLogin';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const ShopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col relative px-4 md:px-12">
        <Navbar
          className="pt-4 px-3 pb-2 lg:pt-0 lg:px-0 lg:pb-0 fixed bg-background/60 lg:bg-background backdrop-blur-lg lg:backdrop-blur-0 left-0 lg:relative lg:mt-4 z-50"
          textColor="black"
          topPadding={0}
        />

        <Separator className="my-4 hidden lg:block" />

        <div className="mt-20 md:mt-36 lg:mt-0">{children}</div>
      </div>
      <Footer />
      <AfterLogin />
    </div>
  );
};

export default ShopLayout;
