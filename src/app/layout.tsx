import { Epilogue } from 'next/font/google';
import type { Metadata } from 'next';
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
		<html lang='en'>
			<body className={epilogue.className}>{children}</body>
		</html>
	);
}
