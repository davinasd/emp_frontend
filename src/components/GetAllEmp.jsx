import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import InfoModal from "./common/InfoModal";
import TableContainer from "./common/TableContainer";
import { Empty } from "antd";
import { Link } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { DeleteIcon } from "@chakra-ui/icons";
import { IoMdEye } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addEmployeeId } from "../store/slice/EmployeeSlice";

const GetAllEmp = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const employee_id = userData ? userData.employee_id : null;
  const [currentUserData, setCurrentUserData] = useState({});

  const dispatch = useDispatch();
  const [employees, setEmployees] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getEmployeeByID/${employee_id}`);
        setCurrentUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchUserData();
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getAllEmployees`
        );
        setEmployees(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (employee) => {
    setSelectedEmployee(employee);
    onOpen();
  };

  const handleDeleteEmployee = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE
        }/api/admin/deleteEmployeeById/${deleteProjectId}`
      );
      toast({
        title: "Success",
        description: "Successfully deleted employee",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllEmployees`
      );
      setEmployees(response.data);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="purple.500" />
      </div>
    );
  }

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteProjectId(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
  };

  const handleUpdateEmp = (id) => {
    dispatch(addEmployeeId(id));
  };

  return (
    <>
      <div className="w-full p-8 md:block flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Employee Information</h1>

        <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-4 items-center mb-5">
          <Link to="/CreateEmp">
            <Button
              colorScheme="blue"
              _hover={{ bg: "blue.600" }}
              mb="6"
              className="flex gap-2 items-center"
            >
              <GoPlus /> Add an Employee
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

        {employees.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No Employee Data</span>}
          />
        ) : (
          <TableContainer
            searchText={searchText}
            setSearchText={setSearchText}
            setFilteredData={setFilteredEmployees}
            data={employees}
          >
            <Thead position="sticky" top={0} bg={"#F1F5F9"} zIndex={10}>
              <Tr>
                <Th fontWeight="bold">S. No.</Th>
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
                <Th fontWeight="bold"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {searchText !== ""
                ? filteredEmployees.map((emp, index) => (
                  <Tr key={emp._id}>
                    <Td>{index + 1}</Td>
                    <Td>{emp.name}</Td>
                    <Td className="md:table-cell hidden">{emp.position}</Td>
                    <Td className="md:table-cell hidden">{emp.department}</Td>
                    <Td className="md:table-cell hidden">
                      {emp.joiningDate}
                    </Td>
                    <Td>
                      <Button
                        size={"sm"}
                        colorScheme="purple"
                        onClick={() => handleMoreInfo(emp)}
                      >
                        <IoMdEye />
                      </Button>
                      {currentUserData?.permissions?.some((el) => {
                        return el.name === "salaryslip" && el.value.includes("delete")
                      }) && (
                          <Link to="/UpdateEmp">
                            <Button
                              size={"sm"}
                              variant={"outline"}
                              colorScheme="blue"
                              ml={2}
                              p={0}
                              onClick={() => handleUpdateEmp(emp.employee_id)}
                            >
                              <MdModeEditOutline size={18} />
                            </Button>
                          </Link>
                        )}
                    </Td>
                    <Td>
                      {currentUserData?.permissions?.some((el) => {
                        return el.name === "salaryslip" && el.value.includes("delete")
                      }) && (
                          <Button
                            size={"sm"}
                            variant={"outline"}
                            colorScheme="red"
                            ml={2}
                            onClick={() =>
                              handleDeleteConfirmation(emp.employee_id)
                            }
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                    </Td>
                  </Tr>
                ))
                : employees.map((emp, index) => (
                  <Tr key={emp._id}>
                    <Td>{index + 1}</Td>
                    <Td>{emp.name}</Td>
                    <Td className="md:table-cell hidden">{emp.position}</Td>
                    <Td className="md:table-cell hidden">{emp.department}</Td>
                    <Td className="md:table-cell hidden">
                      {emp.joiningDate}
                    </Td>
                    <Td>
                      <Button
                        size={"sm"}
                        colorScheme="purple"
                        onClick={() => handleMoreInfo(emp)}
                      >
                        <IoMdEye />
                      </Button>
                      {currentUserData?.permissions?.some((el) => {
                        return el.name === "salaryslip" && el.value.includes("delete")
                      }) && (
                          <Link to="/UpdateEmp">
                            <Button
                              size={"sm"}
                              variant={"outline"}
                              colorScheme="blue"
                              ml={2}
                              p={0}
                              onClick={() => handleUpdateEmp(emp.employee_id)}
                            >
                              <MdModeEditOutline size={18} />
                            </Button>
                          </Link>
                        )}
                    </Td>
                    <Td>
                      {currentUserData?.permissions?.some((el) => {
                        return el.name === "salaryslip" && el.value.includes("delete")
                      }) && (
                          <Button
                            size={"sm"}
                            variant={"outline"}
                            colorScheme="red"
                            ml={2}
                            onClick={() =>
                              handleDeleteConfirmation(emp.employee_id)
                            }
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </TableContainer>
        )}
      </div>

      <InfoModal
        modalFor="employee"
        data={selectedEmployee}
        onClose={onClose}
        isOpen={isOpen}
      />
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={undefined}
        onClose={handleDeleteCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Employee
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this employee information?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteEmployee} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default GetAllEmp;
