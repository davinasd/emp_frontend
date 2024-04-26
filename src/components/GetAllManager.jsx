import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Spinner, // Import Spinner component from Chakra UI
} from "@chakra-ui/react";
import axios from "axios";
import InfoModal from "./common/InfoModal";
import TableContainer from "./common/TableContainer";
import { Empty } from "antd";
import { toast } from "react-toastify";
import { DeleteIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { IoMdEye } from "react-icons/io";
const GetAllManagers = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true); // New state to manage loading
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getManagersAllDetails`
        );
        setManagers(response.data);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading to false in case of error too
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (manager) => {
    setSelectedManager(manager);
    onOpen();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="purple.500" />
      </div>
    );
  }
  const handleDeleteManager = async (projectId) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/deleteManagerById/${projectId}`
      );
      toast.success("Successfully deleted Manager");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllManagers`
      );
      setManagers(response.data);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  return (
    <>
      <div className="w-full p-8 md:block flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-10">Manager Information</h1>

        <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-4 items-center mb-5">
          <Link to="/CreateManager">
            <Button
              colorScheme="blue"
              _hover={{ bg: "blue.600" }}
              mb="6"
              className="flex gap-2 items-center"
            >
              <GoPlus /> Add a Manager
            </Button>
          </Link>

          <div className="flex items-center justify-end mb-2">
            <select
              className="px-2 py-1 border mr-1 rounded-lg"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="" disabled>
                Select Financial Year
              </option>
              <option value="2025">2025-2026</option>
              <option value="2024">2024-2025</option>
              <option value="2023">2023-2024</option>
              <option value="2022">2022-2023</option>
              <option value="2021">2021-2022</option>
              <option value="2020">2020-2021</option>
              <option value="2020">2019-2020</option>
              <option value="2019">2018-2019</option>
              <option value="2018">2017-2018</option>
              <option value="2017">2016-2017</option>
              <option value="2015">2015-2016</option>
              <option value="2014">2014-2015</option>
              <option value="2013">2013-2014</option>
              <option value="2012">2012-2013</option>
              <option value="2011">2011-2012</option>
            </select>
            {selectedYear && (
              <select
                className="px-2 py-1 border rounded-md"
                defaultValue=""
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="" disabled>
                  Select Month
                </option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            )}
            <Button
              className="ml-2"
              size={"sm"}
              colorScheme="gray"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

        {managers.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No Managers Assigned</span>}
          />
        )}

        {managers.length > 0 && (
          <TableContainer
            searchText={searchText}
            setSearchText={setSearchText}
            setFilteredData={setFilteredManagers}
            data={managers}
          >
            <Thead position="sticky" top={0} bg={"#F1F5F9"} zIndex={10}>
              <Tr>
                <Th fontWeight="bold">Id</Th>
                <Th fontWeight="bold">Name</Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Position
                </Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Department
                </Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Joining Date
                </Th>
                <Th fontWeight="bold">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {searchText !== ""
                ? filteredManagers.map((manager) => (
                    <Tr key={manager._id}>
                      <Td>{manager.manager_id}</Td>
                      <Td>{manager.name}</Td>
                      <Td className="md:table-cell hidden">
                        {manager.position}
                      </Td>
                      <Td className="md:table-cell hidden">
                        {manager.department}
                      </Td>
                      <Td className="md:table-cell hidden">
                        {manager.joiningDate}
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(manager)}
                        >
                          <IoMdEye />
                        </Button>
                        <Button
                          size={"sm"}
                          colorScheme="red"
                          variant={"outline"}
                          ml={2}
                          onClick={() =>
                            handleDeleteManager(manager.manager_id)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))
                : managers.map((manager) => (
                    <Tr key={manager._id}>
                      <Td>{manager.manager_id}</Td>
                      <Td>{manager.name}</Td>
                      <Td className="md:table-cell hidden">
                        {manager.position}
                      </Td>
                      <Td className="md:table-cell hidden">
                        {manager.department}
                      </Td>
                      <Td className="md:table-cell hidden">
                        {manager.joiningDate}
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(manager)}
                        >
                          <IoMdEye />
                        </Button>
                        <Button
                          size={"sm"}
                          colorScheme="red"
                          variant={"outline"}
                          ml={2}
                          onClick={() =>
                            handleDeleteManager(manager.manager_id)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
            </Tbody>
          </TableContainer>
        )}
      </div>

      <InfoModal
        modalFor="manager"
        data={selectedManager}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};

export default GetAllManagers;
