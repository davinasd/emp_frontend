import { ChakraProvider, Flex, Card, CardBody, Progress, Grid, GridItem, Divider, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { selectUser } from "../store/slice/UserSlice";
import { useSelector } from "react-redux";
import { FaMoneyBills } from "react-icons/fa6";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { GrTask } from "react-icons/gr";
import { GiProgression } from "react-icons/gi";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { PiNewspaperClipping, PiNewspaperLight } from "react-icons/pi";
import CalendarComponent from "./common/Calendar";
import TodoCheckbox from "./common/TodoCheckbox";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { GoVerified } from "react-icons/go";
import { Link } from "react-router-dom";
import UpcomingEventsCard from "./card/UpcomingEventsCard";
import ConvertedLeads from "./card/ConvertedLeads";
import ProjectCard from "./card/ProjectCard";
import LeaveCard from "./card/LeaveCard";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.100",
        color: "gray.800",
      },
    },
  },
});


function Home() {
  const user = useSelector(selectUser);

  const todoDone = [
    { title: "Login to the dashboard" },
    { title: "Go to the dashboard" },
  ]

  const todoNotDone = [
    { title: "Create Employee" },
    { title: "Create Client" },
  ]

  return (
    <ChakraProvider theme={theme}>
      <div className="px-4 mt-8 mb-10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <ConvertedLeads />
          {/* <ProjectCard />
          <LeaveCard></LeaveCard> */}
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <Card className="w-full md:w-[65%]">
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex gap-4 items-center text-md text-gray-600">
                    <LiaFileInvoiceSolid fontSize={20} />
                    Invoice overview
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>0 Draft</span>
                      <span>0.00%</span>
                    </div>
                    <Progress
                      value={0}
                      colorScheme="gray"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>13 Not Sent</span>
                      <span>65.00%</span>
                    </div>
                    <Progress
                      value={65}
                      colorScheme="gray"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>9 Unpaid</span>
                      <span>45.00%</span>
                    </div>
                    <Progress
                      value={45}
                      colorScheme="red"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>4 Partially Paid</span>
                      <span>20.00%</span>
                    </div>
                    <Progress
                      value={20}
                      colorScheme="yellow"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>0 Overdue</span>
                      <span>0.00%</span>
                    </div>
                    <Progress
                      value={0}
                      colorScheme="yellow"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>7 Paid</span>
                      <span>35.00%</span>
                    </div>
                    <Progress
                      value={30}
                      colorScheme="green"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex gap-4 items-center text-md text-gray-600">
                    <PiNewspaperLight fontSize={20} />
                    Estimate overview
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>0 Draft</span>
                      <span>0.00%</span>
                    </div>
                    <Progress
                      value={0}
                      colorScheme="gray"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>13 Not Sent</span>
                      <span>65.00%</span>
                    </div>
                    <Progress
                      value={65}
                      colorScheme="gray"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>9 Unpaid</span>
                      <span>45.00%</span>
                    </div>
                    <Progress
                      value={45}
                      colorScheme="red"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>4 Partially Paid</span>
                      <span>20.00%</span>
                    </div>
                    <Progress
                      value={20}
                      colorScheme="yellow"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>0 Overdue</span>
                      <span>0.00%</span>
                    </div>
                    <Progress
                      value={0}
                      colorScheme="yellow"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>7 Paid</span>
                      <span>35.00%</span>
                    </div>
                    <Progress
                      value={30}
                      colorScheme="green"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex gap-4 items-center text-md text-gray-600">
                    <PiNewspaperClipping fontSize={20} />
                    Proposal overview
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>0 Draft</span>
                      <span>0.00%</span>
                    </div>
                    <Progress
                      value={0}
                      colorScheme="gray"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>13 Not Sent</span>
                      <span>65.00%</span>
                    </div>
                    <Progress
                      value={65}
                      colorScheme="gray"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>9 Unpaid</span>
                      <span>45.00%</span>
                    </div>
                    <Progress
                      value={45}
                      colorScheme="red"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>4 Partially Paid</span>
                      <span>20.00%</span>
                    </div>
                    <Progress
                      value={20}
                      colorScheme="yellow"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>0 Overdue</span>
                      <span>0.00%</span>
                    </div>
                    <Progress
                      value={0}
                      colorScheme="yellow"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                  <div className="mt-6 text-gray-500">
                    <div className="flex justify-between">
                      <span>7 Paid</span>
                      <span>35.00%</span>
                    </div>
                    <Progress
                      value={30}
                      colorScheme="green"
                      mt={4}
                      height={2}
                      rounded={"lg"}
                    />
                  </div>
                </div>
              </div>
              <Divider mt={10} mb={4} />
              <div className="flex gap-6 flex-col md:flex-row">
                <Stat className="rounded-md border-[0.6px] px-4 py-2">
                  <StatLabel>Outstanding Invoices</StatLabel>
                  <StatNumber>$38,353.00</StatNumber>
                </Stat>
                <Stat className="rounded-md border-[0.6px] px-4 py-2">
                  <StatLabel>Past Due Invoices</StatLabel>
                  <StatNumber>$38,353.00</StatNumber>
                </Stat>
                <Stat className="rounded-md border-[0.6px] px-4 py-2">
                  <StatLabel>Paid Invoices</StatLabel>
                  <StatNumber>$38,353.00</StatNumber>
                </Stat>
              </div>
            </CardBody>
          </Card>

          <div className="overflow-auto w-full md:w-[35%]">
            <Card>
              <CardBody>
                <div className="flex justify-between">
                  <h1 className="text-lg flex gap-2 items-center">
                    <GoVerified size={24} color="#ccc" /> My To Do Items
                  </h1>
                  <Link to="/getAllTodo" className="text-blue-400 text-sm">
                    View all
                  </Link>
                </div>
                <Divider my={4} />
                <div className="w-full flex flex-col">
                  <h2 className="text-lg mb-2 text-yellow-600 flex items-center gap-2">
                    <WarningTwoIcon /> Latest to do&apos;s
                  </h2>
                  {todoNotDone.map((item, index) => (
                    <TodoCheckbox
                      key={`done-${index}`}
                      done={false}
                      title={item.title}
                    />
                  ))}
                </div>
                <Divider my={6} />
                <div className="w-full flex flex-col">
                  <h2 className="text-lg mb-2 text-green-500 flex items-center gap-2">
                    <CheckIcon /> Latest finished to do&apos;s
                  </h2>
                  {todoDone.map((item, index) => (
                    <TodoCheckbox
                      key={`done-${index}`}
                      done={true}
                      title={item.title}
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="mt-4">
          <UpcomingEventsCard />
        </div>
        <CalendarComponent />
      </div>
    </ChakraProvider>
  );
}

export default Home;
