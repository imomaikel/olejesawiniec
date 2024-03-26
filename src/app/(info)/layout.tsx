import ScrollButton from '@/components/ScrollButton';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const InfoPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header>
        <nav>
          <Navbar className="px-8 md:px-12 relative" textColor="black" />
        </nav>
      </header>

      <main>
        <section>{children}</section>
      </main>

      <footer>
        <Footer />
      </footer>

      <ScrollButton trackElementIdOrHeight={100} />
    </>
  );
};

export default InfoPageLayout;
