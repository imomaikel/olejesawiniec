import MobileNavbar from '@/components/MobileNavbar';
import Navbar from '@/components/Navbar';
import Hero from './_components/Hero';
import ProductPhotos from './_components/ProductPhotos';
import ProductsPreview from './_components/ProductsPreview';
import About from './_components/About';

export default function Home() {
	return (
		<>
			<header>
				<nav>
					<Navbar />
				</nav>
			</header>
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

			<MobileNavbar />
		</>
	);
}
