'use client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from 'react-icons/bi';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { formatPrice, relativeDate, translatePaymentStatus } from '@/lib/utils';
import { shopRouter } from '@/server/routers/shopRouter';
import { trpc } from '@/components/providers/TRPC';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { inferRouterOutputs } from '@trpc/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';

type TOrder = inferRouterOutputs<typeof shopRouter>['getMyOrders'][0];
const getHour = (date: Date) => {
  return format(date, 'HH:mm');
};

const columns: ColumnDef<TOrder>[] = [
  {
    accessorKey: 'cashbillId',
    header: 'Identyfikator',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <Badge>{translatePaymentStatus(row.getValue('status'))}</Badge>;
    },
  },
  {
    accessorKey: 'totalProducts',
    header: 'Produkty',
  },
  {
    accessorKey: 'productsPrice',
    header: 'Cena produktów',
    cell: ({ row }) => {
      return formatPrice(row.getValue('productsPrice'));
    },
  },
  {
    accessorKey: 'shippingPrice',
    header: 'Cena dostawy',
    cell: ({ row }) => {
      return formatPrice(row.getValue('shippingPrice'));
    },
  },
  {
    header: 'Cena całkowita',
    cell: ({ row }) => {
      const shippingPrice = parseFloat(row.getValue('shippingPrice'));
      const productsPrice = parseFloat(row.getValue('productsPrice'));
      return formatPrice(shippingPrice + productsPrice);
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Złożono',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return (
        <div className="flex flex-col items-center">
          <span>{relativeDate(date)}</span>
          <span className="text-muted-foreground text-xs">{getHour(date)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Zaktualizowano',
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as Date;
      return (
        <div className="flex flex-col items-center">
          <span>{relativeDate(date)}</span>
          <span className="text-muted-foreground text-xs">{getHour(date)}</span>
        </div>
      );
    },
  },
  {
    header: 'Zobacz szczegóły',
    cell: ({ row }) => {
      return (
        <Button size="icon" variant="secondary" asChild>
          <Link href={`/zamowienie/${row.getValue('cashbillId')}`}>
            <FaExternalLinkAlt />
          </Link>
        </Button>
      );
    },
  },
];

const UserOrdersPage = () => {
  const { data: orders, isLoading } = trpc.shop.getMyOrders.useQuery();

  const table = useReactTable({
    data: orders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return null;

  return (
    <div className="space-y-4 flex flex-col">
      <div className="flex items-center justify-between px-2 ml-auto">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Ilość na strone</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Strona {table.getState().pagination.pageIndex + 1} z {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Pokaż pierwszą stronę</span>
              <BiChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Poprzednia strona</span>
              <BiChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Następna strona</span>
              <BiChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ostatnia strona</span>
              <BiChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Table className="border">
          {orders && orders.length >= 1 && <TableCaption>Dziękujemy za zakupy w naszym sklepie!</TableCaption>}
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
                  <div>
                    <h1 className="font-bold text-xl">Brak poprzednich zamówień</h1>
                    <p className="text-muted-foreground">
                      Zapraszamy do{' '}
                      <Link href="/sklep" className="underline text-primary">
                        sklepu
                      </Link>{' '}
                      i złożenia swojego pierwszego zamówienia.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserOrdersPage;
