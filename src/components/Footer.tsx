import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

const Footer = () => {
	return (
		<>
			<div className='bg-gradient-to-l from-[#596340] to-[#2D331F] py-16 px-[35px] text-white'>
				<div className='flex justify-between px-32'>
					<div className='cursor-pointer w-[271px] h-[107px] relative	mb-4'>
						<Link href='/'>
							<Image src='/signature.png' fill alt='podpis' />
						</Link>
					</div>
					<div className='flex space-x-48'>
						<div>
							<h5>Dla Klienta</h5>
							<ul>
								<li>Regulamin</li>
								<li>Polityka Prywatności</li>
								<li>Oferta dla Sklepów</li>
							</ul>
						</div>
						<div>
							<h5>Kontakt</h5>
							<ul>
								<li>+ 123 123 123</li>
								<li>email@email</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className='px-[35px] py-5'>
				<div>© 2023 Oleje Sawiniec. All rights reserved.</div>
			</div>
		</>
	);
};

export default Footer;
