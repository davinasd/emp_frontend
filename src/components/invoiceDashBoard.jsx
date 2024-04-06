import { useEffect, useState } from 'react';
import { Progress, Stat, StatLabel, StatNumber, Text, Box } from '@chakra-ui/react';
import axios from 'axios';
import { Divider } from 'antd';
import { LiaFileInvoiceSolid } from 'react-icons/lia';

const InvoiceDashboardStatsCard = () => {
  const [totalPaidInvoices, setTotalPaidInvoices] = useState(0);
  const [totalUnpaidInvoices, setTotalUnpaidInvoices] = useState(0);
  const [totalLifetimeSales, setTotalLifetimeSales] = useState(0);
  const [averageInvoiceAmount, setAverageInvoiceAmount] = useState(0);
  const [monthlySalesReport, setMonthlySalesReport] = useState([]);
  const [ledgersReport, setLedgersReport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const endpoints = [
        '/getTotalPaidInvoicesCount',
        '/getTotalUnpaidInvoicesCount',
        '/getLifetimeSales',
        '/getAverageInvoiceAmount',
        '/getMonthlySalesReport',
        '/ledgerStatistics',
      ];
      const apiBaseUrl = import.meta.env.VITE_API_BASE || '';
      const requests = endpoints.map((endpoint) =>
        axios.get(`${apiBaseUrl}/api/admin${endpoint}`).catch((error) => console.error(`Error fetching ${endpoint}:`, error))
      );
      console.log(import.meta.env.VITE_API_BASE);


      try {
        const responses = await Promise.all(requests);
        setTotalPaidInvoices(responses[0].data.totalPaidInvoices);
        setTotalUnpaidInvoices(responses[1].data.totalUnpaidInvoices);
        setTotalLifetimeSales(responses[2].data.totalLifetimeSales);
        setAverageInvoiceAmount(responses[3].data.averageInvoiceAmount);
        setMonthlySalesReport(responses[4].data);
        setLedgersReport(responses[5].data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log(ledgersReport)


  const totalInvoices = totalPaidInvoices + totalUnpaidInvoices;
  const paidPercentage = totalInvoices ? (totalPaidInvoices / totalInvoices) * 100 : 0;
  const unpaidPercentage = totalInvoices ? (totalUnpaidInvoices / totalInvoices) * 100 : 0;

  return (
    <div className='p-6'>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex gap-3 items-center text-xl text-gray-600 mb-4">
            <LiaFileInvoiceSolid fontSize={20} />
            Invoice overview
          </div>
          <div className="text-gray-500 max-w-[400px]">
            <div className="flex justify-between">
              <span>{totalUnpaidInvoices} Unpaid</span>
              <span>{unpaidPercentage.toFixed(2)}%</span>
            </div>
            <Progress value={unpaidPercentage} colorScheme="red" mt={4} height={2} rounded={"lg"} />
            <div className="flex justify-between mt-6">
              <span>{totalPaidInvoices} Paid</span>
              <span>{paidPercentage.toFixed(2)}%</span>
            </div>
            <Progress value={paidPercentage} colorScheme="green" mt={2} height={2} rounded={"lg"} />
          </div>
        </div>
        <div>
          <div className="flex gap-3 items-center text-xl text-gray-600 mb-4">
            <LiaFileInvoiceSolid fontSize={20} />
            Ledger overview
          </div>
          <div className="text-gray-500 max-w-[400px]">
            <div className="flex justify-between">
              <span>{ledgersReport.totalReceived} Unpaid</span>
              <span>{((ledgersReport.net / ledgersReport.totalReceived)*100).toFixed(2)}%</span>
            </div>
            <Progress value={unpaidPercentage} colorScheme="red" mt={4} height={2} rounded={"lg"} />
            <div className="flex justify-between mt-6">
              <span>{ledgersReport.totalPaid} Paid</span>
              <span>{((ledgersReport.totalPaid / ledgersReport.totalReceived)*100).toFixed(2)}%</span>
            </div>
            <Progress value={paidPercentage} colorScheme="green" mt={2} height={2} rounded={"lg"} />
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex gap-6 flex-col md:flex-row items-end">
        <Stat className="rounded-md border-[0.6px] px-4 py-2">
          <StatLabel>Total Lifetime Sales</StatLabel>
          <StatNumber>${totalLifetimeSales.toFixed(2)}</StatNumber>
        </Stat>
        <Stat className="rounded-md border-[0.6px] px-4 py-2">
          <StatLabel>Average Invoice Amount</StatLabel>
          <StatNumber>${averageInvoiceAmount.toFixed(2)}</StatNumber>
        </Stat>
        <div>
          <Text color={"gray.500"} fontSize="lg" fontWeight="bold" mb="2">Monthly Sales Report</Text>
          {monthlySalesReport.map(({ _id, totalSales, averageSalePerInvoice, numberOfInvoices }, index) => (
            <Box key={index}>
              <Text fontSize="md" fontWeight="semibold">{`Month: ${_id.month}/${_id.year}`}</Text>
              <Text fontSize="sm">{`Total Sales: $${totalSales}`}</Text>
              <Text fontSize="sm">{`Average Sale per Invoice: $${averageSalePerInvoice}`}</Text>
              <Text fontSize="sm">{`Number of Invoices: ${numberOfInvoices}`}</Text>
            </Box>
          ))}
        </div>
      </div>
    </div>);
};

export default InvoiceDashboardStatsCard;
