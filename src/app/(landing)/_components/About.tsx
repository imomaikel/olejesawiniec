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
			<div className='flex justify-center w-full flex-wrap'>
				<motion.div
					variants={slideIn('left', 'spring', 0.1, 1)}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
				>
					<SectionInfo
						className='max-w-sm'
						bigTitle='Odkryj Unikalne Doznania Kulinarne Z Naszym Olejami'
						smallTitle='Olejarnia Sawiniec'
						buttonText='Właściwości zdrowotne'
						description='W Olejarni Sawiniec tworzymy wyjątkowe oleje ręcznie robione,
					korzystając wyłącznie z najwyższej jakości surowców. Nasza pasja do
					doskonałości sprawia, że każda kropla oleju to 100% smaku i aromatu.'
					/>
				</motion.div>
				<motion.div
					variants={slideIn('right', 'spring', 0.1, 1)}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					transition={{
						bounce: 1,
						damping: 100,
						type: 'spring',
					}}
					className='relative max-w-md aspect-video min-w-[400px] min-h-[530px]'
				>
					<Image
						src='/oil.png'
						width={0}
						height={0}
						alt='olej'
						sizes='100vw'
						className='w-full h-full aspect-video'
					/>
				</motion.div>
				<div className='max-w-sm mt-6 space-y-8'>
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
						variants={slideIn('top', 'spring', 0.4, 0.75)}
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
						variants={slideIn('top', 'spring', 0.4, 0.75)}
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
