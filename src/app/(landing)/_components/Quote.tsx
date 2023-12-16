const Quote = () => {
	return (
		<div className='bg-black text-white pt-[295px] px-[35px] pb-[160px] flex flex-col items-center justify-center'>
			<div className='max-w-6xl'>
				<h3 className='text-2xl md:text-4xl font-bold text-center leading-[50px]'>
					Kuchnia Jest Naszym Najbliższym Szpitalem, A Zdrowe Jedzenie To
					Recepta Na Długie, Pełne Energii Życie. To Nie Tylko Posiłki, To
					Inwestycja W Swoje Dobre Samopoczucie I Harmonię Z Naturą
				</h3>
			</div>
			<h4 className='text-primary text-xl md:text-3xl font-bold mt-10 mb-5'>
				Jamie Oliver
			</h4>
			<p className='text-muted-foreground text-center'>
				szef kuchni i aktywista kulinarnej świadomości
			</p>
		</div>
	);
};

export default Quote;
