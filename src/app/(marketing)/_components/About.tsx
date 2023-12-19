'use client';
import ContentWrapper from '@/components/ContentWrapper';
import { slideIn } from '@/utils/motion';
import SectionInfo from './SectionInfo';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const About = () => {
	return (
		<ContentWrapper>
			<div className='flex justify-center w-full flex-wrap flex-col md:flex-row items-center md:items-start'>
				<motion.div
					variants={slideIn('left', 'spring', 0.1, 1)}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
				>
					<SectionInfo
						className='max-w-md'
						bigTitle='Odkryj Unikalne Doznania Kulinarne Z Naszymi Olejami'
						smallTitle='Olejarnia Sawiniec'
						buttonText='Właściwości zdrowotne'
						description='W Olejarni Sawiniec tworzymy wyjątkowe oleje ręcznie robione,
					korzystając wyłącznie z najwyższej jakości surowców. Nasza pasja do
					doskonałości sprawia, że każda kropla oleju to 100% smaku i aromatu.'
					/>
				</motion.div>
				<motion.div
					variants={slideIn('right', 'spring', 0.1, 0.75)}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					transition={{
						bounce: 1,
						damping: 100,
						type: 'spring',
					}}
					className='relative aspect-video max-w-md w-full md:min-w-[400px] md:min-h-[530px] min-h-[400px]'
				>
					<Image
						src='/oil.png'
						width={0}
						loading='eager'
						height={0}
						alt='olej'
						sizes='100vw'
						className='w-full h-full aspect-video max-w-[400px] md:max-w-none'
					/>
					<div className='absolute w-1/2 rotate-45 h-3/4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 blur-[90px] -z-10' />
				</motion.div>
				<div className='max-w-sm mt-6 space-y-8'>
					<motion.div
						variants={slideIn('top', 'spring', 0.1, 0.75)}
						initial='hidden'
						whileInView='show'
						viewport={{ once: true }}
						className='flex-col space-y-1'
						transition={{
							bounce: 1,
							damping: 100,
							type: 'spring',
						}}
					>
						<h4 className='text-primary font-bold tracking-wide text-xl'>
							Witaminy i składniki odżywcze:
						</h4>
						<p>
							Oleje zimnotłoczone zachowują większą ilość witamin, minerałów i
							innych cennych składników odżywczych. Proces niskiej temperatury
							pozwala na pełne zachowanie dobroczynnych właściwości, wspierając
							zdrowie organizmu.
						</p>
					</motion.div>
					<motion.div
						variants={slideIn('top', 'spring', 0.2, 0.75)}
						initial='hidden'
						whileInView='show'
						viewport={{ once: true }}
						className='flex-col space-y-1'
						transition={{
							bounce: 1,
							damping: 100,
							type: 'spring',
						}}
					>
						<h4 className='text-primary font-bold tracking-wide text-xl'>
							Naturalny smak i aromat:
						</h4>
						<p>
							Zimnotłoczenie chroni oleje przed utratą naturalnego smaku i
							aromatu surowców. Dzięki temu możemy cieszyć się intensywnymi i
							bogatymi nutami, które dodają wyjątkowego charakteru potrawom.
						</p>
					</motion.div>
					<motion.div
						variants={slideIn('top', 'spring', 0.3, 0.75)}
						initial='hidden'
						whileInView='show'
						viewport={{ once: true }}
						className='flex-col space-y-1'
						transition={{
							bounce: 1,
							damping: 100,
							type: 'spring',
						}}
					>
						<h4 className='text-primary font-bold tracking-wide text-xl'>
							Ochrona przed utlenianiem
						</h4>
						<p>
							Proces zimnotłoczenia minimalizuje kontakt oleju z powietrzem i
							światłem, co ogranicza proces utleniania. To oznacza dłuższy okres
							trwałości oleju oraz zachowanie jego świeżości, co jest kluczowe
							dla zdrowia i walorów smakowych potraw.
						</p>
					</motion.div>
				</div>
			</div>
		</ContentWrapper>
	);
};

export default About;
