import { Button } from '@/components/ui/button';
import { PANEL_TABS } from '@/utils/constans';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PanelControls = () => {
	const pathname = usePathname();

	return (
		<div>
			{PANEL_TABS.map((tab) => {
				let isSelected = pathname.startsWith(tab.link);
				if (pathname.startsWith(`${tab.link}/`) && tab.link === '/panel') {
					isSelected = false;
				}

				return (
					<div key={tab.label}>
						<Link href={tab.link}>
							<Button
								variant={isSelected ? 'default' : 'secondary'}
								className='w-full'
							>
								{<tab.Icon className='w-6 h-6 mr-2' />}
								{tab.label}
							</Button>
						</Link>
						<div className='flex flex-col space-y-2 mt-1 mb-2'>
							{tab.options &&
								isSelected &&
								tab.options.map((option) => {
									const isSelected = pathname === option.link;
									return (
										<div key={option.link} className='text-right'>
											<Link href={option.link}>
												<Button
													className='w-3/4'
													variant={isSelected ? 'default' : 'secondary'}
												>
													{option.label}
												</Button>
											</Link>
										</div>
									);
								})}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default PanelControls;
