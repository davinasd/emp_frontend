import { Box, Button, FormControl, FormLabel, Input, Select, Text, useToast } from "@chakra-ui/react"
import { formatDate } from "@fullcalendar/core"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import MyDatePicker from "../common/MyDatePicker"
import SelectSupply from "../common/SelectSupply"
import { selectExpenseId } from "../../store/slice/ExpenseSlice"

const CreateExpense = () => {
    const toast = useToast();
    const currDate = new Date();
    const currTime = currDate.getHours() + ":"
        + currDate.getMinutes() + ":"
        + currDate.getSeconds();
    const [expenses, setExpenses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newExpense, setNewExpense] = useState({
        name: "",
        amountReceived: 0,
        description: "",
        categories: [],
        totalSpent: 0,
        createdAt: `${currDate}`
        // date1: "",
        // time1: currTime,
    });
    const [client, setClient] = useState("");
    const [selectSupplies, setSelectSupplies] = useState([]);
    const [projectData, setProjectData] = useState({});
    const expId = useSelector(selectExpenseId);

    useEffect(() => {
        // axios
        //     .get(
        //         `${import.meta.env.VITE_API_BASE}/api/admin/getLeadDetails/${expId}`
        //     )
        //     .then((response) => {
        //         const clientData = response.data;
        //         setClient(response.data);
        //         setProjectData((projectData) => ({
        //             ...projectData,
        //             enquiryDate: clientData?.enquiryDate || projectData.enquiryDate,
        //         }));
        //     })

        //     .catch((error) => {
        //         console.error("Error fetching client details:", error);
        //         toast.error("Failed to fetch client details");
        //     });
    }, [expId]);

    // console.log(projectData);
    console.log(expId);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getAllEmployees`)
            .then((response) => {
                setEmployees(response.data);
            })
    }, [])

    const RequiredIndicator = () => {
        return <Text as="span" color="red.500" ml={1}>*</Text>;
    };

    const fetchExpense = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE}/api/admin/getAllExpenses`
            );
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching sources:", error);
        }
    };

    // console.log(expenses)

    const handleUpdateExpense = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE}/api/admin/updateExpense/${expId}`, newExpense)
            .then(() => {
                toast({
                    title: "Success",
                    description: "Expense updated",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            });
        } catch (error) {
            console.error("Error adding source:", error);
        }
    };

    const handleExpenseChange = (field, value) => {
        let updatedService = { ...newExpense };
        const selectedexpense = expenses.find((product) => product._id === value);
        updatedService["categories"] = selectedexpense;
        setNewExpense(updatedService);
    };

    return (
        <Box
            mx="auto"
            borderWidth="1px"
            borderRadius="lg"
            p="4"
            boxShadow="lg"
            m="4"
        >
            <h1 className="text-2xl font-semibold">Update Expense</h1>
            <p className="font-light mb-4">Fill the below form to add a new invoice</p>
            <div className="flex flex-col gap-3 max-w-[400px]">
                <FormControl>
                    <FormLabel>
                        Name
                        <RequiredIndicator />{" "}
                    </FormLabel>
                    <Input
                        placeholder="Enter name"
                        value={newExpense.name}
                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>
                        Description
                        <RequiredIndicator />{" "}
                    </FormLabel>
                    <Input
                        placeholder="Enter description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>
                        Date
                        <RequiredIndicator />{" "}
                    </FormLabel>
                    <div>
                        <MyDatePicker
                            className="h-[40px]"
                            selected={newExpense.date1}
                            onChange={(date) =>
                                handleExpenseChange("date1", date)
                            } // Corrected to use 'date' instead of 'startDate'
                            // disabledDate={(current) => {
                            //   return newSupply.endDate && current > newSupply.endDate;
                            // }}
                            format={"DD/MM/YYYY"}
                        />
                        <div>{formatDate(newExpense?.date1)}</div>
                    </div>
                </FormControl>
                <FormControl>
                    <FormLabel>
                        Amount Received
                        <RequiredIndicator />{" "}
                    </FormLabel>
                    <Input
                        placeholder="Amount"
                        value={newExpense?.amountReceived}
                        onChange={(e) => setNewExpense({ ...newExpense, amountReceived: e.target.value })}
                        maxWidth={100}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>
                        Categories
                        <RequiredIndicator />{" "}
                    </FormLabel>
                    <SelectSupply
                        selectSourceValue={selectSupplies}
                        setSelectSourceValue={setSelectSupplies}
                    />
                </FormControl>
                <Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                    <option disabled value="">
                        Select Employee
                    </option>
                    {employees.map((employeeId) => (
                        <option key={employeeId._id} value={employeeId._id}>
                            {employeeId.name}
                        </option>
                    ))}
                </Select>
                {/* <Select onChange={handleExpenseSelectChange} size="md" value="">
                    <option value="" disabled>
                        Select employees
                    </option>
                    {employees.map((employee) => (
                        <option key={employee._id} disabled={projectData.employees.includes(employee.employee_id)} value={employee.employee_id}>
                            {employee.name}
                        </option>
                    ))}
                </Select>
                {projectData?.employees?.length > 0 && (
                    <Box className="my-4 p-4 rounded-lg bg-slate-100 shadow-lg flex gap-2">
                        {projectData.employees.map((tag) => (
                            <Tag
                                key={tag.employee_id}
                                size="lg"
                                borderRadius="full"
                                variant="outline"
                                colorScheme="purple"
                            >
                                <TagLabel>{getEmployeeNameById(tag)}</TagLabel>
                                <TagCloseButton onClick={() => removeEmployeeById(tag)} />
                            </Tag>
                        ))}
                    </Box>
                )} */}
            </div>
            <Button
                mt={4}
                colorScheme="purple"
                onClick={handleUpdateExpense}
            >
                Update Expense
            </Button>
        </Box>
    )
}

export default CreateExpense