import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

const About = () => {
	return (
		<div className='pt-[165px] px-9 pb-[165px] flex relative' id='photos'>
			<div className='w-full flex justify-center px-24 space-x-12'>
				<div className='space-y-8 max-w-md'>
					<h3 className='text-primary tracking-wide font-normal'>
						Olejarnia Sawiniec
					</h3>
					<h2 className='text-5xl font-bold leading-[60px]'>
						Odkryj Unikalne Doznania Kulinarne Z Naszym Olejami
					</h2>
					<p>
						W Olejarni Sawiniec tworzymy wyjątkowe oleje ręcznie robione,
						korzystając wyłącznie z najwyższej jakości surowców. Nasza pasja do
						doskonałości sprawia, że każda kropla oleju to 100% smaku i aromatu.
					</p>
					<Button size='2xl' className='rounded-full'>
						Właściwości zdrowotne
					</Button>
				</div>
				<div className='flex relative max-w-lg flex-grow'>
					<Image src='/oil.png' fill alt='olej' />
				</div>
				<div className='flex flex-col max-w-[375px] space-y-12'>
					<div className='flex-col space-y-6'>
						<h4 className='text-primary font-bold tracking-wide text-xl'>
							Witaminy i składniki odżywcze:
						</h4>
						<p>
							Oleje zimnotłoczone zachowują większą ilość witamin, minerałów i
							innych cennych składników odżywczych. Proces niskiej temperatury
							pozwala na pełne zachowanie dobroczynnych właściwości, wspierając
							zdrowie organizmu.
						</p>
					</div>
					<div className='flex-col space-y-6'>
						<h4 className='text-primary font-bold tracking-wide text-xl'>
							Naturalny smak i aromat:
						</h4>
						<p>
							Zimnotłoczenie chroni oleje przed utratą naturalnego smaku i
							aromatu surowców. Dzięki temu możemy cieszyć się intensywnymi i
							bogatymi nutami, które dodają wyjątkowego charakteru potrawom.
						</p>
					</div>
					<div className='flex-col space-y-6'>
						<h4 className='text-primary font-bold tracking-wide text-xl'>
							Ochrona przed utlenianiem
						</h4>
						<p>
							Proces zimnotłoczenia minimalizuje kontakt oleju z powietrzem i
							światłem, co ogranicza proces utleniania. To oznacza dłuższy okres
							trwałości oleju oraz zachowanie jego świeżości, co jest kluczowe
							dla zdrowia i walorów smakowych potraw.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
