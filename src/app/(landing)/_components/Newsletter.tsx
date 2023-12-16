import { Button } from '@/components/ui/button';

const Newsletter = () => {
	return (
		<div className='relative h-auto'>
			<div className='bg-footer bg-no-repeat bg-cover bg-center flex items-center justify-end w-full min-h-[768px] relative'>
				<div className='bg-black w-[650px] h-[500px] mr-40 rounded-md text-white z-10 flex flex-col p-12 space-y-12'>
					<h3>Dołącz Do Nas</h3>
					<h2>Dodaj swojego maila do Newsletter i bądź na bieżąco</h2>
					<div className='w-full rounded-full bg-gray-600 h-16 flex p-3'>
						<div className='w-3/5 h-full rounded-full'>
							<input
								className='w-full h-full bg-transparent outline-none px-4'
								placeholder='Podaj swój adres e-mail'
							/>
						</div>
						<Button className='h-full w-2/5 rounded-full shadow-md shadow-primary'>
							Zapisz
						</Button>
					</div>
				</div>
				<div className='absolute w-full h-full bg-black/20 top-0 z-0 backdrop-blur-sm' />
			</div>
		</div>
	);
};

export default Newsletter;
