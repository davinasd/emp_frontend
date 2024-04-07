import { ChakraProvider, Card, CardBody, Divider, } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import CalendarComponent from "./common/Calendar";
import TodoCheckbox from "./common/TodoCheckbox";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { GoVerified } from "react-icons/go";
import { Link } from "react-router-dom";
import UpcomingClientEventsCard from "./card/UpcomingEventsCard";
import ConvertedLeads from "./card/ConvertedLeads";
import ProjectCard from "./card/ProjectCard";
import LeaveCard from "./card/LeaveCard";
import UpcomingEmployeeEventsCard from "./card/upcomingEmployeeEventsCard";
import InvoiceDashboardStatsCard from "./invoiceDashBoard";

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
  // const user = useSelector(selectUser);

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
          <ProjectCard />
          <LeaveCard />
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <Card className="w-full md:w-[65%]">
            <InvoiceDashboardStatsCard />
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
          <UpcomingClientEventsCard />
        </div>
        <div className="mt-4">
          <UpcomingEmployeeEventsCard />
        </div>

        <CalendarComponent />
      </div>
    </ChakraProvider>
  );
}

export default Home;
