'use client';
import { FOOTER_LINKS } from '@/utils/constans';
import { slideIn } from '@/utils/motion';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
	return (
		<div className='flex flex-col'>
			<div className='bg-gradient-to-l from-[#596340] to-[#2D331F] text-white px-16 md:px-24 py-12'>
				<div className='flex flex-col md:flex-row justify-center md:justify-around w-full items-center max-w-[1920px] mx-auto'>
					<div className='cursor-pointer relative	mb-4 lg:block hidden'>
						<Link href='/'>
							<Image
								src='/signature.png'
								className='object-contain object-center'
								width={271}
								height={107}
								loading='eager'
								alt='podpis'
							/>
						</Link>
					</div>
					{FOOTER_LINKS.map((entry) => (
						<div
							className='w-full md:w-auto flex flex-col md:block items-center mb-6 md:mb-0 text-center md:text-left'
							key={entry.header}
						>
							<motion.h5
								variants={slideIn('top', 'spring', 0.2, 1)}
								initial='hidden'
								whileInView='show'
								viewport={{ once: true }}
								className='font-bold text-xl mb-4 capitalize'
							>
								{entry.header}
							</motion.h5>
							<ul className='leading-8'>
								{entry.options.map((option, index) => (
									<motion.li
										variants={slideIn('top', 'spring', 0.2 * index, 1)}
										initial='hidden'
										whileInView='show'
										viewport={{ once: true }}
										key={option.label}
									>
										<Link
											className='hover:text-primary transition-colors tracking-wide'
											href={option.link}
										>
											{option.label}
										</Link>
									</motion.li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
			<div className='px-8 py-2'>
				<div className='flex mx-auto items-start flex-col max-w-[1920px]'>
					<div className='text-sm'>
						© 2023 Oleje Sawiniec. Wszelkie prawa zastrzeżone.
					</div>
					<div className='text-muted-foreground space-x-1 text-xs'>
						<span>Strona wykonana przez</span>
						<Link
							href='https://github.com/imomaikel'
							target='_blank'
							className='underline'
						>
							imomaikel
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
