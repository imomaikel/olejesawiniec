import ShoppingCart from '@/components/ShoppingCart';
import MobileNavbar from '@/components/MobileNavbar';
import { Epilogue } from 'next/font/google';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';

const epilogue = Epilogue({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Oleje Sawiniec',
	description: 'Olejarnia w zgodzie z naturą',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='pl' className='h-full scroll-smooth'>
			<body className={cn('h-full relative', epilogue.className)}>
				<main className='relative flex flex-col min-h-screen'>
					<div className='flex-1 flex-grow overflow-hidden relative'>
						{children}
					</div>
				</main>
				<ShoppingCart />
				<MobileNavbar />
			</body>
		</html>
	);
}
