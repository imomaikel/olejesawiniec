import PrivacyPolicy from './components/PrivacyPolicy';
import ScrollButton from '@/components/ScrollButton';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <>
      <header>
        <nav>
          <Navbar className="px-8 md:px-12 relative" textColor="black" />
        </nav>
      </header>

      <main>
        <section>
          <PrivacyPolicy />
        </section>
      </main>

      <footer>
        <Footer />
      </footer>

      <ScrollButton trackElementIdOrHeight={100} />
    </>
  );
};

export default PrivacyPolicyPage;
