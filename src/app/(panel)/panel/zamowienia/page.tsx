'use client';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import OrderLabel, { TOrderStatus } from './_components/OrderLabel';
import { formatPrice, relativeDate } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { LuArrowUpDown } from 'react-icons/lu';
import { Input } from '@/components/ui/input';
import { TStatuses } from '@/utils/constans';
import { format } from 'date-fns';
import { useState } from 'react';
import Link from 'next/link';

type Order = {
  id: string;
  date: Date;
  amount: number;
  userEmail: string;
  status: TOrderStatus;
  productCount: number;
};
const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    footer: 'ID',
  },
  {
    accessorKey: 'userEmail',
    header: 'Email',
    footer: 'Email',
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as TOrderStatus;
      return <OrderLabel status={status} />;
    },
    footer: 'Status',
    filterFn: (row, columnId, filterVal) => {
      const status = row.getValue('status');

      const canShow = filterVal.includes(status);

      return canShow;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-translate-x-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Kwota <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));

      return formatPrice(amount);
    },
    footer: 'Kwota',
  },
  {
    accessorKey: 'productCount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-translate-x-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Produkty <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    footer: 'Produkty',
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-translate-x-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;

      return (
        <div className="flex flex-col">
          <span>{format(date, 'dd/MM HH:mm')}</span>
          <span className="text-muted-foreground text-xs">{relativeDate(date)}</span>
        </div>
      );
    },
    footer: 'Data',
  },
  {
    id: 'actions',
    header: 'Szczegóły',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <Button asChild size="icon" variant="secondary">
          <Link href={`/panel/zamowienia/${order.id}`}>
            <FaExternalLinkAlt className="h-4 w-4" />
          </Link>
        </Button>
      );
    },
    footer: 'Szczegóły',
    enableHiding: false,
  },
];

const PanelOrdersPage = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: 'status', value: TStatuses.map(({ value }) => value) },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ id: false });
  const [sorting, setSorting] = useState<SortingState>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  trpc.panel.getOrders.useQuery(undefined, {
    onSuccess: (data) => {
      setOrders(data);
    },
  });

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <h1 className="tracking-wide font-bold text-xl md:text-2xl mb-6">Lista zamówień</h1>
      <div className="mb-4 space-y-2">
        <Input
          placeholder="Szukaj po email..."
          value={(table.getColumn('userEmail')?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn('userEmail')?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Szukaj po identyfikatorze..."
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn('id')?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-col max-w-sm space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Filtruj statusy</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {TStatuses.map((entry, index) => {
                const currentFilters = table.getColumn('status')?.getFilterValue() as string[];
                return (
                  <DropdownMenuCheckboxItem
                    onSelect={(e) => e.preventDefault()}
                    key={`${entry.value}${index}`}
                    checked={currentFilters.includes(entry.value)}
                    onCheckedChange={() => {
                      if (currentFilters.includes(entry.value)) {
                        table.getColumn('status')?.setFilterValue(currentFilters.filter((val) => val !== entry.value));
                      } else {
                        table.getColumn('status')?.setFilterValue([...currentFilters, entry.value]);
                      }
                    }}
                  >
                    <OrderLabel status={entry.value} />
                  </DropdownMenuCheckboxItem>
                );
              })}
              <DropdownMenuCheckboxItem className="px-0">
                <div className="w-full text-center">Zamknij</div>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Zmień widoczność kolumn</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onSelect={(e) => e.preventDefault()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.columnDef.footer?.toString() ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              <DropdownMenuCheckboxItem className="px-0">
                <div className="w-full text-center">Zamknij</div>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full relative rounded-md border md:max-w-lg lg:max-w-3xl xl:max-w-none">
        <Table className="min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default PanelOrdersPage;
// TODO Pagination
