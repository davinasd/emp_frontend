import { useEffect, useState } from "react";
import { Button, Card, CardBody, Flex, Progress, Select } from "@chakra-ui/react";
import { Divider } from "antd";
import axios from "axios";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { TfiBarChart } from "react-icons/tfi";
import { CiWarning } from "react-icons/ci";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { PiCardholderThin } from "react-icons/pi";
import { allMonths } from "../../helpers";

const ProjectCard = () => {
  const [totalLeads, setTotalLeads] = useState(0);
  const [leadsInProgress, setLeadsInProgress] = useState(0);
  const [convertedLeads, setConvertedLeads] = useState(0);
  const [lostLeads, setLostLeads] = useState(0);
  const [rawLeads, setRawLeads] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [selectQuarterFirstMonth, setSelectQuarterFirstMonth] = useState(null);

  useEffect(() => {
    fetchData();
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth, selectedQuarter]);

  useEffect(() => {
    // Fetch total project count
    axios
      .get(`${import.meta.env.VITE_API_BASE}/api/admin/getTotalProjects`)
      .then((response) => {
        setTotalLeads(response.data.totalProjectCount);
      })
      .catch((error) => {
        console.error("Error fetching total lead count:", error);
      });

    fetchData();
  }, [selectedYear, selectedMonth, selectedQuarter])

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

  const fetchData = () => {
    // Fetch leads by status
    axios.post(`${import.meta.env.VITE_API_BASE}/api/admin/getProjectCountByStatus`, {
      financialYear: selectedYear,
      month: selectedMonth || "",
      quarter: selectedQuarter || "",
      firstQuarterMonth: selectQuarterFirstMonth || ""
    })
      .then((response) => {
        const leads = response.data;
        const inProgressLead = leads.find((lead) => lead._id === "Not Started");
        const convertedLead = leads.find((lead) => lead._id === "In Progress");
        const lostLead = leads.find((lead) => lead._id === "Completed");
        const rawLead = leads.find((lead) => lead._id === "On Hold");

        if (inProgressLead) {
          setLeadsInProgress(inProgressLead.count);
        }
        if (convertedLead) {
          setConvertedLeads(convertedLead.count);
        }
        if (lostLead) {
          setLostLeads(lostLead.count);
        }
        if (rawLead) {
          setRawLeads(rawLead.count);
        }
      })
      .catch((error) => {
        console.error("Error fetching leads by status:", error);
      });
  }

  const handleYearClear = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedQuarter(null);
    setSelectQuarterFirstMonth(null);
    setSelectedFilter(null);
  }

  return (
    <>
      <Card className="w-full md:w-1/3 p-4 pb-8">
        <div className="flex items-center justify-between text-gray-600">
          <h1 className="flex text-xl gap-2 items-center">
            <LiaProjectDiagramSolid /> Projects
          </h1>
          <div className="bg-blue-500 rounded-full h-[25px] min-w-[25px] flex items-center justify-center text-white text-[10px]">{totalLeads}</div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
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
          <div className="flex gap-2 items-center">
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
                {selectedYear && allMonths.map((month, index) => (
                  <option key={`m-${month}`} value={index + 1}>{selectedYear}-{month}</option>
                ))}
              </Select>
            )}
            {selectedYear && selectedFilter === "quarter" && (
              <Select
                placeholder='Select Quarter'
                value={selectedQuarter || ""}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                size={"sm"}
                rounded={"lg"}
              >
                <option key={`quarter-1`} value={1}>1 - {selectedYear}</option>
                <option key={`quarter-2`} value={2}>2 - {selectedYear}</option>
                <option key={`quarter-3`} value={3}>3 - {selectedYear}</option>
                <option key={`quarter-4`} value={4}>4 - {selectedYear}</option>
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
              {selectedYear && allMonths.map((month, index) => (
                <option key={`m-${month}`} value={index + 1}>{selectedYear}-{month}</option>
              ))}
              </Select>
            )}
          {selectedFilter && <Button width={100} size={"sm"} onClick={handleYearClear} className="self-end">Clear</Button>}
          </div>
        </div>
        <Divider />
        <CardBody m={0} p={0}>
          <Flex color={"gray.500"} alignItems="center" justifyContent="space-between">
            <div className="flex gap-4 items-center text-lg">
              <TfiBarChart />
              In progress
            </div>
            {totalLeads === 0 ? 0 : convertedLeads}/{totalLeads}
          </Flex>
          <Progress
            value={totalLeads === 0 ? 0 : (convertedLeads / totalLeads) * 100}
            colorScheme="blue"
            mt={2}
            height={2}
            rounded="lg"
          />
          <Flex color={"gray.500"} mt={4} alignItems="center" justifyContent="space-between">
            <div className="flex gap-4 items-center text-lg">
              <CiWarning />
              Not Started
            </div>
            {totalLeads === 0 ? 0 : leadsInProgress}/{totalLeads}
          </Flex>
          <Progress
            value={totalLeads === 0 ? 0 : (leadsInProgress / totalLeads) * 100}
            colorScheme="red"
            mt={2}
            height={2}
            rounded="lg"
          />
          <Flex color={"gray.500"} mt={4} alignItems="center" justifyContent="space-between">
            <div className="flex gap-4 items-center text-lg">
              <IoCheckmarkDoneOutline />
              Completed
            </div>
            {totalLeads === 0 ? 0 : lostLeads}/{totalLeads}
          </Flex>
          <Progress
            value={totalLeads === 0 ? 0 : (lostLeads / totalLeads) * 100}
            colorScheme="green"
            mt={2}
            height={2}
            rounded="lg"
          />
          <Flex color={"gray.500"} mt={4} alignItems="center" justifyContent="space-between">
            <div className="flex gap-4 items-center text-lg">
              <PiCardholderThin />
              On Hold
            </div>
            {rawLeads}/{totalLeads}
          </Flex>
          <Progress
            value={(rawLeads / totalLeads) * 100}
            colorScheme="yellow"
            mt={2}
            height={2}
            rounded="lg"
          />
        </CardBody>
      </Card>
    </>
  );
};

export default ProjectCard;
