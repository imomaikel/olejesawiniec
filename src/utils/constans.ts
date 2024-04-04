import { FaShopify, FaChartLine } from 'react-icons/fa6';
import { MdOutlineDesignServices } from 'react-icons/md';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { BiSolidShoppingBags } from 'react-icons/bi';
import { PaymentStatus } from '@prisma/client';
import { RiTodoLine } from 'react-icons/ri';
import { FaHashtag } from 'react-icons/fa';
import { TiPlus } from 'react-icons/ti';
import { FaEdit } from 'react-icons/fa';

export const TStatuses: {
  value: PaymentStatus;
  label: string;
  color: string;
}[] = [
  { value: 'PositiveFinish', label: 'Złożone', color: 'black' },
  { value: 'Order_processing', label: 'W realizacji', color: '#3c40c6' },
  { value: 'Order_ready', label: 'Gotowe do wysyłki', color: '#8e44ad' },
  { value: 'Order_sent', label: 'Wysłane', color: '#8e44ad' },
  { value: 'Order_finished', label: 'Zrealizowane', color: 'hsl(var(--primary))' },
  { value: 'PreStart', label: 'Płatność nierozpoczęta', color: '#ff6b81' },
  { value: 'Start', label: 'Płatność w trakcie', color: '#ff6b81' },
] as const;
export type TOrderStatus = (typeof TStatuses)[number]['value'];

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
    label: 'Logowanie',
    path: '/logowanie',
  },
];

export const FOOTER_LINKS = [
  {
    header: 'Dla klienta',
    options: [
      {
        label: 'Regulamin',
        link: '/regulamin',
      },
      {
        label: 'Polityka prywatności',
        link: '/polityka-prywatnosci',
      },
      // {
      //   label: 'Oferta dla sklepów',
      //   link: '#',
      // },
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
    options: null,
  },
  {
    label: 'Produkty',
    Icon: FaShopify,
    link: '/panel/produkty',
    options: [
      {
        label: 'Dodaj produkt',
        Icon: TiPlus,
        link: '/panel/produkty/nowy',
      },
      {
        label: 'Tagi',
        Icon: FaHashtag,
        link: '/panel/produkty/tagi',
      },
      {
        label: 'Niestandardowe',
        Icon: MdOutlineDesignServices,
        link: '/panel/produkty/niestandardowe',
      },
      {
        label: 'Szybka edycja',
        Icon: FaEdit,
        link: '/panel/produkty/edycja',
      },
    ],
  },
  {
    label: 'Zamówienia',
    Icon: BiSolidShoppingBags,
    link: '/panel/zamowienia',
    options: [
      {
        label: 'Podsumowanie',
        Icon: RiTodoLine,
        link: '/panel/zamowienia/podsumowanie',
      },
      {
        label: 'Dostawa',
        Icon: LiaShippingFastSolid,
        link: '/panel/zamowienia/dostawa',
      },
    ],
  },
];

export const PRODUCT_NAME_REGEX = /^[a-zA-Z\sąćęłńóśźżł]+$/;
export const DISALLOWED_PRODUCT_NAMES = PANEL_TABS.filter((tab) =>
  tab.options?.some((option) => option.link.startsWith('/panel/produkty/')),
)
  .map((tab) =>
    tab.options?.map((option) => {
      const splitPath = option.link.split('/');
      const lastElement = splitPath[splitPath.length - 1];
      return lastElement;
    }),
  )
  .flat();
export const REPLACE_LETTERS = [
  {
    from: 'ą',
    to: 'a',
  },
  {
    from: 'ć',
    to: 'c',
  },
  {
    from: 'ę',
    to: 'e',
  },
  {
    from: 'ł',
    to: 'l',
  },
  {
    from: 'ń',
    to: 'n',
  },
  {
    from: 'ó',
    to: 'o',
  },
  {
    from: 'ś',
    to: 's',
  },
  {
    from: 'ż',
    to: 'z',
  },
  {
    from: 'ź',
    to: 'x',
  },
];

export const SORT_OPTIONS = [
  {
    label: 'Domyślnie',
    id: 'domyślnie',
  },
  {
    label: 'Popularność',
    id: 'popularność',
  },
  {
    label: 'Alfabetycznie',
    id: 'alfabetycznie',
  },
  {
    label: 'Cena rosnąco',
    id: 'cena_rosnąco',
  },
  {
    label: 'Cena malejąco',
    id: 'cena_malejąco',
  },
  {
    label: 'Nowości',
    id: 'nowości',
  },
  {
    label: 'Ilość opinii',
    id: 'ilość_opinii',
  },
  {
    label: 'Najlepiej oceniane',
    id: 'najlepiej_oceniane',
  },
] as const;
export type TSortOptions = (typeof SORT_OPTIONS)[number]['id'];

export const OPINIONS_PER_PAGE = 3;
