'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ChartWrapper from './_components/ChartWrapper';
import { format, getDaysInMonth, getYear } from 'date-fns';
import { formatPrice } from '@/lib/utils';

// TEMP DATA
const month = new Date().getMonth() + 1;
const year = format(new Date(), 'yy');
const daysInMonth = getDaysInMonth(new Date());
//
const ordersThisMonth = Array.from(Array(daysInMonth).keys()).map((day) => ({
  date: `${day + 1}.${month}`,
  orders: Math.floor(Math.random() * 100 + 1),
}));
//
const newCustomersThisMonth = Array.from(Array(daysInMonth).keys()).map((day) => ({
  date: `${day + 1}.${month}`,
  customers: Math.floor(Math.random() * 10),
}));
//
const earningsThisMonth = Array.from(Array(daysInMonth).keys()).map((day) => ({
  date: `${day + 1}.${month}`,
  earnings: Math.floor(Math.random() * 1000 + 20),
}));
//
const earningsThisYear = Array.from(Array(12).keys()).map((month) => ({
  date: `${month < 9 ? '0' : ''}${month + 1}.${year}`,
  earnings: Math.floor(Math.random() * 10000 + 200),
}));
//

const PanelSummaryPage = () => {
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartWrapper title="Zamówienia w tym miesiącu">
        <LineChart data={ordersThisMonth}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="date" />
          <YAxis width={30} />
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Zamówienia" />
        </LineChart>
      </ChartWrapper>
      <ChartWrapper title="Nowi klienci w tym miesiącu">
        <LineChart data={newCustomersThisMonth}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="date" />
          <YAxis width={30} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="customers"
            stroke="hsl(var(--primary))"
            activeDot={{ r: 8 }}
            name="Nowi klienci"
          />
        </LineChart>
      </ChartWrapper>
      <ChartWrapper title="Zarobki w tym miesiącu">
        <LineChart data={earningsThisMonth}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="date" />
          <YAxis width={40} />
          <Tooltip formatter={(val) => formatPrice(parseFloat(val.toString()))} />
          <Line type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Zarobki" />
        </LineChart>
      </ChartWrapper>
      <ChartWrapper title="Zarobki roczne">
        <LineChart data={earningsThisYear}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="date" className="text-sm" />
          <YAxis width={50} />
          <Tooltip formatter={(val) => formatPrice(parseFloat(val.toString()))} />
          <Line type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Zarobki" />
        </LineChart>
      </ChartWrapper>
    </div>
  );
};

export default PanelSummaryPage;
