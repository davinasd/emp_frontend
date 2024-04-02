import { useEffect, useState } from "react";
import { Button, Card, CardBody, Flex, Progress, Select } from "@chakra-ui/react";
import axios from "axios";
import { CiCalendar } from "react-icons/ci";
import { Divider } from "antd";
import { IoBanOutline } from "react-icons/io5";
import { FiCheckSquare } from "react-icons/fi";
import { CgSandClock } from "react-icons/cg";
import { allMonths } from "../../helpers";

const LeaveCard = () => {
  const currentYear = new Date().getFullYear();
  const currenMonth = new Date().getMonth();
  const [totalLeads, setTotalLeads] = useState(0);
  const [leadsInProgress, setLeadsInProgress] = useState(0);
  const [convertedLeads, setConvertedLeads] = useState(0);
  const [lostLeads, setLostLeads] = useState(0);
  const [rawLeads, setRawLeads] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currenMonth + 1);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("month");
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [selectQuarterFirstMonth, setSelectQuarterFirstMonth] = useState(null);

  useEffect(() => {
    fetchFinancialYears();
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth, selectedQuarter])

  const fetchData = () => {
    let firstQuarterMonth = selectedQuarter === 1 ? 1 : (
      selectedQuarter === 2 ? 4 : (
        selectedQuarter === 3 ? 7 : (
          selectedQuarter === 4 ? 10 : null
        )
      )
    )
    // Fetch total lead count
    axios.post(`${import.meta.env.VITE_API_BASE}/api/admin/getTotalLeaves`, {
      financialYear: selectedYear,
      month: selectedMonth || "",
      quarter: selectedQuarter || "",
      firstQuarterMonth: firstQuarterMonth || ""
    })
      .then((response) => {
        console.log(response.data)
        setTotalLeads(response.data.totalLeaveCount);
      })
      .catch((error) => {
        console.error("Error fetching total lead count:", error);
      });

    // Fetch leads by status
    axios.post(`${import.meta.env.VITE_API_BASE}/api/admin/getLeavesByStatus/${selectedYear}/${selectedMonth}`)
      .then((response) => {
        const leads = response.data;
        console.log(response.data)
        const inProgressLead = leads.find((lead) => lead._id === "Approved");
        const convertedLead = leads.find((lead) => lead._id === "Pending");
        const lostLead = leads.find((lead) => lead._id === "Rejected");

        if (inProgressLead) {
          setLeadsInProgress(inProgressLead.count);
        }
        if (convertedLead) {
          setConvertedLeads(convertedLead.count);
        }
        if (lostLead) {
          setLostLeads(lostLead.count);
        }
        if (rawLeads) {
          setRawLeads(rawLeads.count);
        }
      })
      .catch((error) => {
        console.error("Error fetching leaves by status:", error);
      });
  }

  const fetchFinancialYears = () => {
    try {
      axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getAllYears`)
        .then((res) => {
          setFinancialYears(res.data);
        });
    } catch (error) {
      console.log(`Error fetching financial years: ${error}`);
    }
  }

  const handleYearClear = () => {
    setSelectedYear(currentYear - 1);
    setSelectedMonth(null);
    setSelectedQuarter(null);
    setSelectedQuarter(null);
    setSelectQuarterFirstMonth(null);
  }

  return (
    <>
      <Card className="w-full md:w-1/3 p-4 pb-8">
        <div className="flex items-center justify-between text-gray-600">
          <h1 className="flex text-xl gap-2 items-center">
            <CiCalendar /> Leave
          </h1>
          <div className="bg-blue-500 rounded-full h-[25px] min-w-[25px] flex items-center justify-center text-white text-[10px]">{totalLeads}</div>
        </div>

        <div className="flex gap-2 items-center mt-4">
          <Select
            placeholder='Select Year'
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(e.target.value)}
            size={"sm"}
            rounded={"lg"}
          >
            {financialYears.map((year) => (
              <option key={`fy-${year._id}`} value={year.financial_year.split('-')[0]}>{year.financial_year}</option>
            ))}
          </Select>
          <Select
            placeholder='Filter by'
            value={selectedFilter || ""}
            onChange={(e) => setSelectedFilter(e.target.value)}
            size={"sm"}
            rounded={"lg"}
          >
            <option value={"month"}>Month</option>
            <option value={"quarter"}>Quarter</option>
          </Select>
          {selectedFilter === "month" && (
            <Select
              placeholder='Select Month'
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value)}
              size={"sm"}
              rounded={"lg"}
            >
              {allMonths.map((month, index) => (
                <option key={`m-${month}`} value={index + 1}>{month}</option>
              ))}
            </Select>
          )}
          {selectedFilter === "quarter" && (
            <Select
              placeholder='Select Quarter'
              value={selectedQuarter || ""}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              size={"sm"}
              rounded={"lg"}
            >
              <option key={`quarter-1`} value={1}>1</option>
              <option key={`quarter-2`} value={2}>2</option>
              <option key={`quarter-3`} value={3}>3</option>
              <option key={`quarter-4`} value={4}>4</option>
            </Select>
          )}
          {selectedQuarter && (
            <Select
              placeholder='Select Quarter'
              value={selectQuarterFirstMonth || ""}
              onChange={(e) => setSelectQuarterFirstMonth(e.target.value)}
              size={"sm"}
              rounded={"lg"}
            >
              <option key={`quarter-1`} value={1}>1</option>
              <option key={`quarter-2`} value={2}>2</option>
              <option key={`quarter-3`} value={3}>3</option>
              <option key={`quarter-4`} value={4}>4</option>
              <option key={`quarter-1`} value={5}>5</option>
              <option key={`quarter-2`} value={6}>6</option>
              <option key={`quarter-3`} value={7}>7</option>
              <option key={`quarter-4`} value={8}>8</option>
              <option key={`quarter-1`} value={9}>9</option>
              <option key={`quarter-2`} value={10}>10</option>
              <option key={`quarter-3`} value={11}>10</option>
              <option key={`quarter-4`} value={12}>12</option>
            </Select>
          )}
          {selectedFilter && <Button width={100} size={"sm"} onClick={handleYearClear}>Clear</Button>}
        </div>
        <Divider />
        <CardBody m={0} p={0} className="flex flex-col gap-6">
          <div>
            <Flex color={"gray.500"} alignItems="center" justifyContent="space-between">
              <div className="flex gap-4 items-center text-lg">
                <CgSandClock />
                Pending
              </div>
              {totalLeads === 0 ? 0 : convertedLeads}/{totalLeads}
            </Flex>
            <Progress
              value={totalLeads === 0 ? 0 : (convertedLeads / totalLeads) * 100}
              colorScheme="green"
              mt={2}
              height={2}
              rounded="lg"
            />
          </div>
          <div>
            <Flex color={"gray.500"} alignItems="center" justifyContent="space-between">
              <div className="flex gap-4 items-center text-lg">
                <FiCheckSquare />
                Approved
              </div>
              {totalLeads === 0 ? 0 : leadsInProgress}/{totalLeads}
            </Flex>
            <Progress
              value={totalLeads === 0 ? 0 : (leadsInProgress / totalLeads) * 100}
              colorScheme="yellow"
              mt={2}
              height={2}
              rounded="lg"
            />
          </div>
          <div>
            <Flex color={"gray.500"} alignItems="center" justifyContent="space-between">
              <div className="flex gap-4 items-center text-lg">
                <IoBanOutline />
                Rejected
              </div>
              {totalLeads === 0 ? 0 : lostLeads}/{totalLeads}
            </Flex>
            <Progress
              value={totalLeads === 0 ? 0 : (lostLeads / totalLeads) * 100}
              colorScheme="red"
              mt={2}
              height={2}
              rounded="lg"
            />
          </div>
        </CardBody>

      </Card>
    </>
  );
};

export default LeaveCard;
