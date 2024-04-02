import { CloseIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { Button, Drawer, Flex, Select, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const GetTaskByEmp = ({ open, setOpen }) => {
    const toast = useToast();
    const onBrandSearch = () => { }
    const [employees, setEmployees] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [fetchedItems, setFetchedItems] = useState([]);

    useEffect(() => {
        try {
            axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getAllEmployees`)
                .then((res) => {
                    setEmployees(res.data);
                });
        } catch (error) {
            console.log(`Error fetching employees: ${error}`)
        }
    }, [])

    const handleClose = () => {
        setOpen(!open);
        setSelectedBrand(null);
        setFetchedItems(null);
    }

    useEffect(() => {
        const handleGetTasksByEmpId = async (emp_id) => {
            try {
                await axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getTasksByEmployeeID/${emp_id}`)
                    .then((res) => {
                        setFetchedItems(res.data);
                    })
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to get tasks",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
        handleGetTasksByEmpId(selectedBrand);
    }, [selectedBrand])

    console.log(fetchedItems)

    // console.log(employees)

    return (
        <Drawer
            open={open}
            closable={false}
            onClose={() => setOpen(false)}
            placement="bottom"
            width="100VW"
            height="100vh"
            title={
                <h1 className="text-[24px] flex gap-2 items-center text-gray-700 max-w-[700px]">Get Tasks</h1>
            }
            extra={
                <Button type="text" onClick={() => setOpen(!open)} className="flex items-center justify-center"><CloseIcon /></Button>
            }
            footer={
                <Flex justify="center">
                    <div className="flex gap-2 max-w-[800px] w-full justify-end mt-1 mb-3">
                        <Button onClick={handleClose}>Cancel</Button>
                        {/* <Button disabled={selectedInvoiceIds?.length === 0} onClick={handleGetTasksByEmpId} type="primary" className="bg-blue-500">
                            Get Combined Invoices
                        </Button> */}
                    </div>
                </Flex>
            }
        >
            <div className="flex items-center justify-center">
                <div className="max-w-[800px] w-full">
                    <div className="flex gap-2">
                        <Select
                            showSearch
                            optionFilterProp="children"
                            onSearch={onBrandSearch}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            value={selectedBrand}
                            onChange={setSelectedBrand}
                            placeholder="Choose an employee"
                            className="w-full"
                        >
                            {employees?.map((emp) => (
                                <option key={emp._id} value={emp.employee_id}>{emp.name}</option>
                            ))}
                        </Select>
                    </div>
                    {selectedBrand &&
                        fetchedItems?.invoices?.map((item, index) => (
                            <div key={`item-${index}`} className="flex flex-col gap-2 mt-5">
                                <div className="w-full p-3 flex items-start gap-6 bg-gray-50 rounded-md">
                                    <div className="flex flex-col w-full">
                                        <div className="text-sm font-semibold text-gray-500">Date: {item?.date1}</div>
                                        <div className="grid grid-cols-2 w-full">
                                            <div>Bill Type: {item?.billtype}</div>
                                            <div>Discount: {item?.discount}</div>
                                            <div>Gst: {item?.gst}</div>
                                            <div>Subtotal: {item?.subtotal}</div>
                                        </div>
                                        <div className="mt-3">
                                            <Tag color="purple" className="mb-2">Brand: {item?.brandName}</Tag>
                                            <div>Time: {item?.time1}</div>
                                            <div>Created At: {item?.createdAt}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </Drawer>
    );
}

export default GetTaskByEmp