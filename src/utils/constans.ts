import { FaShopify, FaChartLine } from 'react-icons/fa6';
import { BiSolidShoppingBags } from 'react-icons/bi';

export const NAV_LINKS = [
	{
		label: 'Sklep',
		path: '/sklep',
	},
	{
		label: 'Panel',
		path: '/panel',
	},
	{
		label: 'Kontakt',
		path: '#',
	},
];

export const FOOTER_LINKS = [
	{
		header: 'Dla klienta',
		options: [
			{
				label: 'Regulamin',
				link: '#',
			},
			{
				label: 'Polityka prywatności',
				link: '#',
			},
			{
				label: 'Oferta dla sklepów',
				link: '#',
			},
		],
	},
	{
		header: 'Kontakt',
		options: [
			{
				label: '780 031 831',
				link: 'tel:780031831',
			},
			{
				label: 'sawiniec.olejarnia@gmail.com',
				link: 'mailto:sawiniec.olejarnia@gmail.com',
			},
		],
	},
];

export const PANEL_TABS = [
	{
		label: 'Podsumowanie',
		Icon: FaChartLine,
		link: '/panel',
	},
	{
		label: 'Produkty',
		Icon: FaShopify,
		link: '/panel/produkty',
	},
	{
		label: 'Zamówienia',
		Icon: BiSolidShoppingBags,
		link: '/panel/zamowienia',
	},
];

export const TEMP_PRODUCTS = [
	{
		label: 'Olej rzepakowy',
		price: 50,
		image: '/TEMP/product.jpg',
		description: [
			'Obniża cholesterol',
			'Wspiera układ krążenia',
			'Duża zawartość witaminy E',
			'Właściwości przeciwzapalne',
			'Wysoka temperatura dymienia',
			'Stabilny podczas gotowania i pieczenia',
		],
	},
	{
		label: 'Olej z wiesiołka',
		price: 65,
		image: '/TEMP/product.jpg',
		description: [
			'Korzystny dla układu nerwowego.',
			'Poprawia zdrowie stawów.',
			'Wspomaga zdrowie kobiecego układu rozrodczego.',
			'Wspomaga zdrowie serca.',
			'Źródło antyoksydantów.',
			'Przeciwdziała stanom zapalnym.',
			'Zawartość kwasu GLA.',
			'Poprawia zdrowie skóry.',
		],
	},
	{
		label: 'Olej z konopii',
		price: 30,
		image: '/TEMP/product.jpg',
		description: [
			'Działa przeciwzapalnie.',
			'Obniża ciśnienie krwi.',
			'Chroni przed uszkodzeniem komórek i stresem oksydacyjnym.',
			'Wspomaga trawienie.',
			'Wspomaga zdrowie serca.',
			'Bogaty w kwasy tłuszczowe.',
		],
	},
];
