import ProductsPreview from './_components/ProductsPreview';
import ProductPhotos from './_components/ProductPhotos';
import ScrollButton from '@/components/ScrollButton';
import Newsletter from './_components/Newsletter';
import FindUs from './_components/FindUs';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import About from './_components/About';
import Quote from './_components/Quote';
import Hero from './_components/Hero';

export default function Home() {
  return (
    <>
      <header>
        <nav>
          <Navbar className="px-8 md:px-12" />
        </nav>
      </header>

      <main>
        <section>
          <Hero />
        </section>

        <section>
          <ProductPhotos />
        </section>

        <section>
          <ProductsPreview />
        </section>

        <section>
          <About />
        </section>

        <section>
          <FindUs />
        </section>

        <section>
          <Quote />
        </section>

        <section>
          <Newsletter />
        </section>
      </main>

      <footer>
        <Footer />
      </footer>

      <ScrollButton trackElementIdOrHeight="zdjecia" />
    </>
  );
}
