import React, { useEffect, useState } from 'react';
import { Card, CardBody, Divider, Progress, Stat, StatLabel, StatNumber, Text, Box } from '@chakra-ui/react';
import axios from 'axios';

const InvoiceDashboardStatsCard = () => {
  const [totalPaidInvoices, setTotalPaidInvoices] = useState(0);
  const [totalUnpaidInvoices, setTotalUnpaidInvoices] = useState(0);
  const [totalLifetimeSales, setTotalLifetimeSales] = useState(0);
  const [averageInvoiceAmount, setAverageInvoiceAmount] = useState(0);
  const [monthlySalesReport, setMonthlySalesReport] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const endpoints = [
        '/getTotalPaidInvoicesCount',
        '/getTotalUnpaidInvoicesCount',
        '/getLifetimeSales',
        '/getAverageInvoiceAmount',
        '/getMonthlySalesReport',
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  
  const totalInvoices = totalPaidInvoices + totalUnpaidInvoices;
  const paidPercentage = totalInvoices ? (totalPaidInvoices / totalInvoices) * 100 : 0;
  const unpaidPercentage = totalInvoices ? (totalUnpaidInvoices / totalInvoices) * 100 : 0;

  return (
    <>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
       
        <div className="mt-6 text-gray-500">
          <div className="flex justify-between">
            <span>{totalUnpaidInvoices} Unpaid</span>
            <span>{unpaidPercentage.toFixed(2)}%</span>
          </div>
          <Progress value={unpaidPercentage} colorScheme="red" mt={4} height={2} rounded={"lg"} />
        </div>
        <div className="mt-6 text-gray-500">
          <div className="flex justify-between">
            <span>{totalPaidInvoices} Paid</span>
            <span>{paidPercentage.toFixed(2)}%</span>
          </div>
          <Progress value={paidPercentage} colorScheme="green" mt={4} height={2} rounded={"lg"} />
        </div>
      </div>
      <Divider mt={10} mb={4} />
      <div className="flex gap-6 flex-col md:flex-row">
        <Stat className="rounded-md border-[0.6px] px-4 py-2">
          <StatLabel>Total Lifetime Sales</StatLabel>
          <StatNumber>${totalLifetimeSales.toFixed(2)}</StatNumber>
        </Stat>
        <Stat className="rounded-md border-[0.6px] px-4 py-2">
          <StatLabel>Average Invoice Amount</StatLabel>
          <StatNumber>${averageInvoiceAmount.toFixed(2)}</StatNumber>
        </Stat>
        <Box mt="6">
        <Text fontSize="lg" fontWeight="bold" mb="4">Monthly Sales Report</Text>
        {monthlySalesReport.map(({ _id, totalSales, averageSalePerInvoice, numberOfInvoices }, index) => (
          <Box key={index} mb="4">
            <Text fontSize="md" fontWeight="semibold">{`Month: ${_id.month}/${_id.year}`}</Text>
            <Text fontSize="sm">{`Total Sales: $${totalSales}`}</Text>
            <Text fontSize="sm">{`Average Sale per Invoice: $${averageSalePerInvoice}`}</Text>
            <Text fontSize="sm">{`Number of Invoices: ${numberOfInvoices}`}</Text>
          </Box>
        ))}
      </Box>      </div>
      
      </>  );
};

export default InvoiceDashboardStatsCard;
