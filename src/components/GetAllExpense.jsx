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
} from "@chakra-ui/react";
import axios from "axios";
import InfoModal from "./common/InfoModal";
import TableContainer from "./common/TableContainer";
import { Empty } from "antd";
import { Link } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { toast } from "react-toastify";
import { DeleteIcon } from "@chakra-ui/icons";
import { IoMdEye } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { setExpenseId } from "../store/slice/ExpenseSlice";
import { useDispatch } from "react-redux";

const GetAllExpense = () => {
    const dispatch = useDispatch();
    const [employees, setEmployees] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE}/api/admin/getAllExpenses`
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

    // console.log(employees)

    const handleMoreInfo = (employee) => {
        setSelectedEmployee(employee);
        onOpen();
    };

    const handleDeleteEmployee = async () => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE
                }/api/admin/deleteExpense/${deleteProjectId}`
            );
            toast.success("Successfully deleted expense")
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE}/api/admin/getAllExpenses`
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

    const handleDeleteConfirmation = (id) => {
        setDeleteProjectId(id);
        setIsDeleteAlertOpen(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteAlertOpen(false);
    };

    const handleUpdateEmp = (expenseId) => {
        // console.log(id)
        dispatch(setExpenseId(expenseId));
    }

    return (
        <>
            <div className="w-full p-8 md:block flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4">Expense Information</h1>
                <Link to="/CreateExpense">
                    <Button
                        colorScheme="blue"
                        _hover={{ bg: "blue.600" }}
                        mb="6"
                        className="flex gap-2 items-center"
                    >
                        <GoPlus /> Add an Expense
                    </Button>
                </Link>

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
                        searchFor="expense"
                    >
                        <Thead position="sticky" top={0} bg={"#F1F5F9"} zIndex={10}>
                            <Tr>
                                <Th fontWeight="bold">S. No.</Th>
                                <Th fontWeight="bold">Name</Th>
                                <Th fontWeight="bold">Amount</Th>
                                <Th fontWeight="bold" className="md:table-cell hidden">Date</Th>
                                <Th fontWeight="bold" className="md:table-cell hidden">Time</Th>
                                <Th fontWeight="bold" className="md:table-cell hidden">
                                    Total Spent
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
                                        <Td>{emp.amountReceived}</Td>
                                        <Td className="md:table-cell hidden">{emp.date1}</Td>
                                        <Td className="md:table-cell hidden">{emp.time1}</Td>
                                        <Td className="md:table-cell hidden">{emp.totalSpent}</Td>
                                        <Td>
                                            <Button
                                                size={"sm"}
                                                colorScheme="purple"
                                                onClick={() => handleMoreInfo(emp)}
                                            >
                                                <IoMdEye />
                                            </Button>
                                            <Link to="/UpdateEmp">
                                                <Button
                                                    size={"sm"}
                                                    variant={"outline"}
                                                    colorScheme="blue"
                                                    ml={2}
                                                    p={0}
                                                    onClick={() => handleUpdateEmp(emp.expense_id)}
                                                >
                                                    <MdModeEditOutline size={18} />
                                                </Button>
                                            </Link>
                                        </Td>
                                        <Td>
                                            <Button
                                                size={"sm"}
                                                variant={"outline"}
                                                colorScheme="red"
                                                ml={2}
                                                onClick={() =>
                                                    handleDeleteConfirmation(emp.expense_id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))
                                : employees.map((emp, index) => (
                                    <Tr key={emp._id}>
                                        <Td>{index + 1}</Td>
                                        <Td>{emp.name}</Td>
                                        <Td>{emp.amountReceived}</Td>
                                        <Td className="md:table-cell hidden">{emp.date1}</Td>
                                        <Td className="md:table-cell hidden">{emp.time1}</Td>
                                        <Td className="md:table-cell hidden">{emp.totalSpent}</Td>
                                        <Td>
                                            <Button
                                                size={"sm"}
                                                colorScheme="purple"
                                                onClick={() => handleMoreInfo(emp)}
                                            >
                                                <IoMdEye />
                                            </Button>
                                            <Link to="/UpdateExpense">
                                                <Button
                                                    size={"sm"}
                                                    variant={"outline"}
                                                    colorScheme="blue"
                                                    ml={2}
                                                    p={0}
                                                    onClick={() => handleUpdateEmp(emp.expense_id)}
                                                >
                                                    <MdModeEditOutline size={18} />
                                                </Button>
                                            </Link>
                                        </Td>
                                        <Td>
                                            <Button
                                                size={"sm"}
                                                variant={"outline"}
                                                colorScheme="red"
                                                ml={2}
                                                onClick={() =>
                                                    handleDeleteConfirmation(emp.expense_id)
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
                modalFor="expense"
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
}

export default GetAllExpense