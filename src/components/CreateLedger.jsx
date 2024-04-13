import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Text,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    Card,
    CardBody,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const CreateLedger = () => {
    const [projectData, setProjectData] = useState({
        companyName: "",
        brandName: "",
        clientName: "",
        client_id: "",
        employee_id: "",
        description: "",
        received: 0,
        paid: 0,
    });
    const RequiredIndicator = () => {
        return <Text as="span" color="red.500" ml={1}>*</Text>;
    };
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE}/api/admin/getAllClients`)
            .then((response) => {
                setClients(response.data);
            })
            .catch((error) => {
                console.error("Error fetching clients:", error);
            });
    }, []);

    useEffect(() => {
        if (projectData.client_id) {
            axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getClientDetails/${projectData.client_id}`)
                .then((res) => {
                    // console.log(res.data.clientName);
                    setProjectData({ ...projectData, clientName: res.data.clientName, brandName: res.data.brandName })
                })
        }
    }, [projectData.client_id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        const selectedClient = clients.find(
            (client) => client.client_id === clientId
        );
        setSelectedClient(selectedClient);
        setProjectData({
            ...projectData,
            client_id: clientId,
            brandName: selectedClient.brandName,
            employees: [],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const requiredFields = [
            { key: 'companyName', label: 'Company Name' },
            { key: 'client_id', label: 'Client Name' },
            { key: 'client_id', label: 'Brand Name' },
            { key: 'description', label: 'Description' },
            { key: 'received', label: 'received' },
            { key: 'paid', label: 'Paid', isArray: true },
        ];

        for (let { key, label, isArray } of requiredFields) {
            if (isArray ? !projectData[key] || projectData[key].length === 0 : !projectData[key]) {
                toast.error(`${label} is required.`);
                return;
            }
        }
        axios
            .post(
                `${import.meta.env.VITE_API_BASE}/api/admin/addLedger`,
                projectData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    toast.success(response.data.message);
                    setSelectedClient(null);
                    setProjectData({
                        companyName: "",
                        brandName: "",
                        clientName: "",
                        client_id: "",
                        employee_id: "",
                        description: "",
                        received: 0,
                        paid: 0,
                    });
                    toast.success(response.data.message, {
                        autoClose: 2000,
                    });
                    // setTimeout(() => {
                    //     navigate("/getAllProject");
                    // }, 2000);
                } else {
                    console.error("Failed to create project");
                    console.log(response.data.message);
                    toast.success(response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                console.log(error.response.data.message);
                console.log(error);
                toast.error(error.response.data.message);
            });
    };

    return (
        <>
            <ToastContainer />
            <Box
                mx="auto"
                borderWidth="1px"
                borderRadius="lg"
                p="4"
                boxShadow="lg"
                m="4"
            >
                <h1 className="text-2xl font-semibold">Add Ledger</h1>
                <p className="font-light mb-4">
                    Fill the below form to add a new ledger
                </p>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                        <div className="flex flex-col md:flex-row gap-4">
                            <FormControl id="projectName">
                                <FormLabel>
                                    Company Name
                                    <RequiredIndicator />{" "}
                                </FormLabel>
                                <Input
                                    name="companyName"
                                    onChange={handleChange}
                                    value={projectData.companyName}
                                />
                            </FormControl>
                            <FormControl id="client_id">
                                <FormLabel>
                                    Brand Name
                                    <RequiredIndicator />{" "}
                                </FormLabel>
                                <Select
                                    onChange={handleClientChange}
                                    size="md"
                                    placeholder="Select Brand"
                                    value={projectData.client_id}
                                >
                                    {clients.map((client) => (
                                        <option key={client.client_id} value={client.client_id}>
                                            {client.brandName}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl id="client_id">
                                <FormLabel>
                                    Select Brand
                                    <RequiredIndicator />{" "}
                                </FormLabel>
                                <Select
                                    onChange={handleClientChange}
                                    size="md"
                                    placeholder="Select Brand"
                                    value={projectData.client_id}
                                >
                                    {clients.map((client) => (
                                        <option key={client.client_id} value={client.client_id}>
                                            {client.clientName}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        {selectedClient && (
                            <Card variant={"outline"}>
                                <CardBody>
                                    <Text textTransform={"capitalize"}>
                                        Client Name: {selectedClient.clientName}
                                    </Text>
                                    <Text>Client Company: {selectedClient.companyName}</Text>
                                </CardBody>
                            </Card>
                        )}
                        <FormControl id="description">
                            <FormLabel>
                                Description
                                <RequiredIndicator />{" "}
                            </FormLabel>
                            <Input
                                name="description"
                                onChange={handleChange}
                                h="5rem"
                                value={projectData.description}
                            />
                        </FormControl>

                        <div className="flex gap-2">
                            <FormControl id="received">
                                <FormLabel>
                                    Received
                                    <RequiredIndicator />{" "}
                                </FormLabel>
                                <Input
                                    name="received"
                                    onChange={handleChange}
                                    value={projectData.received}
                                />
                            </FormControl>
                            <FormControl id="paid">
                                <FormLabel>
                                    Paid
                                    <RequiredIndicator />{" "}
                                </FormLabel>
                                <Input
                                    name="paid"
                                    onChange={handleChange}
                                    value={projectData.paid}
                                />
                            </FormControl>
                        </div>

                        <Button type="submit" colorScheme="purple">
                            Create Project
                        </Button>
                    </VStack>
                </form>
            </Box>
        </>
    );
}

export default CreateLedger