import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MobileNavbar from '@/components/MobileNavbar';

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

			<MobileNavbar />
		</>
	);
}
