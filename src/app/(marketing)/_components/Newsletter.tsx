import { Button } from '@/components/ui/button';

const Newsletter = () => {
	return (
		<div className='relative h-auto'>
			<div className='bg-footer bg-no-repeat bg-cover bg-center flex items-center justify-center lg:justify-end w-full min-h-[768px] relative px-8 lg:px-0'>
				<div className='bg-black/90 w-full lg:w-[650px] h-[500px] lg:mr-40 rounded-md text-white z-10 flex flex-col p-12 space-y-12'>
					<h3 className='text-primary tracking-wide font-normal mb-2 text-lg'>
						Dołącz Do Nas
					</h3>
					<h2 className='font-bold whitespace-pre-wrap text-2xl lg:text-4xl'>
						Podaj swojego e-mail&apos;a do Newsletter i bądź na bieżąco
					</h2>
					<div className='w-full rounded-full bg-gray-600 h-16 flex p-3'>
						<div className='w-full lg:w-3/5 h-full rounded-full'>
							<input
								className='w-full h-full bg-transparent outline-none px-2 lg:px-4 text-xs lg:text-base'
								placeholder='Podaj swój adres e-mail'
							/>
						</div>
						<Button className='h-full w-2/5 rounded-full shadow-md shadow-primary hidden lg:block'>
							Zapisz
						</Button>
					</div>
					<Button
						className='rounded-full shadow-md shadow-primary lg:hidden'
						size='2xl'
					>
						Zapisz
					</Button>
				</div>
				<div className='absolute w-full h-full bg-black/20 top-0 z-0 backdrop-blur-sm' />
			</div>
		</div>
	);
};

export default Newsletter;
