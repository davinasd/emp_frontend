import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Spinner, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import InfoModal from "./common/InfoModal";
import GetInvoiceByBrandName from "./common/GetInvoiceByBrandName";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import { IoMdEye } from "react-icons/io";
import { Empty } from "antd";
import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import TableContainer from "./common/TableContainer";

const GetAllPaidInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [downloading, setDownloading] = useState(null);
    const [getInvoiceByBrandName, setGetInvoiceByBrandName] = useState(false);

    const toast = useToast();

    async function fetchData(year, month) {
        setIsLoading(true);
        try {
            let url = `${import.meta.env.VITE_API_BASE}/api/admin/getAllInvoices`;
            if (year) {
                url = `${import.meta.env.VITE_API_BASE
                    }/api/admin/getAllPaidInvoices/${year}`;
                if (month) {
                    url += `/${month}`;
                }
            }
            const response = await axios.get(url);
            setInvoices(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData(selectedYear, selectedMonth);
    }, [selectedYear, selectedMonth]);

    const handleDownload = (id, index) => {
        const url = `${import.meta.env.VITE_API_BASE
            }/api/admin/downloadInvoice/${id}`;
        axiosDownloadFile(url, `${id}.pdf`);
        setDownloading(index);
    };

    const handleMoreInfo = (invoice) => {
        setSelectedInvoice(invoice);
        onOpen();
    };


    const handleDeleteInvoice = async () => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE
                }/api/admin/deleteInvoiceById/${deleteInvoiceId}`
            );
            toast.success("Successfully deleted Invoice");
            fetchData(selectedYear, selectedMonth);
            setIsDeleteAlertOpen(false);
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };
    const handleReset = () => {
        setSelectedYear(null);
        setSelectedMonth(null);
    };

    const handleDeleteConfirmation = (projectId) => {
        setDeleteInvoiceId(projectId);
        setIsDeleteAlertOpen(true);
    };
    const handleDeleteCancel = () => {
        setIsDeleteAlertOpen(false);
    };
    async function axiosDownloadFile(url, fileName) {
        setDownloading(true);
        return axios({
            url,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                const href = window.URL.createObjectURL(response.data);

                const anchorElement = document.createElement("a");

                anchorElement.href = href;
                anchorElement.download = fileName;

                document.body.appendChild(anchorElement);
                anchorElement.click();

                document.body.removeChild(anchorElement);
                window.URL.revokeObjectURL(href);
                setDownloading(false);
            })
            .catch((error) => {
                console.log("error: ", error);
                setDownloading(false);
            });
    }

    return (
        <>
            <div className="w-full p-8 md:block flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4">Paid Invoices</h1>
                <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-4 items-center mb-5">
                    <div className="flex gap-2">
                        <Link to="/CreateInvoice">
                            <Button
                                colorScheme="blue"
                                _hover={{ bg: "blue.600" }}
                                mb="2"
                                className="flex gap-2 items-center"
                            >
                                <GoPlus /> Add an Invoice
                            </Button>
                        </Link>
                        {/* <Button
                            onClick={() => setGetInvoiceByBrandName(true)}
                            variant={"solid"}
                        >
                            Get Combined Invoices
                        </Button> */}
                    </div>

                    {/* <div className="flex items-center justify-end mb-2">
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
                        <Button className="ml-2" size={"sm"} colorScheme="gray" onClick={handleReset}>
                            Reset
                        </Button>
                    </div> */}
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center h-screen">
                        <Spinner size="xl" color="purple.500" />
                    </div>
                ) : (
                    <>
                        {invoices.length === 0 ? (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={<span>No Invoices Available</span>}
                            />
                        ) : (
                            <TableContainer
                                formFor="invoice"
                                searchText={searchText}
                                setSearchText={setSearchText}
                                setFilteredData={setFilteredInvoices}
                                data={invoices}
                            >
                                <Thead position="sticky" top={0} bg={"#F1F5F9"} zIndex={10}>
                                    <Tr>
                                        <Th fontWeight="bold" className="md:table-cell hidden">Index</Th>
                                        <Th fontWeight="bold">
                                            Brand Name
                                        </Th>
                                        <Th fontWeight="bold" className="md:table-cell hidden">
                                            Date
                                        </Th>
                                        <Th fontWeight="bold" className="md:table-cell hidden">
                                            Time
                                        </Th>
                                        <Th fontWeight="bold">Action</Th>
                                        <Th fontWeight="bold"></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {searchText !== ""
                                        ? filteredInvoices.map((invoice, index) => (
                                            <Tr key={invoice._id}>
                                                <Td className="md:table-cell hidden">{index + 1}</Td>
                                                <Td>{invoice.brandName}</Td>
                                                <Td className="md:table-cell hidden">{invoice.date1}</Td>
                                                <Td className="md:table-cell hidden">{invoice.time1}</Td>

                                                <Td className="flex flex-col md:flex-row gap-2">
                                                    <Button
                                                        size={"sm"}
                                                        colorScheme="purple"
                                                        onClick={() => handleMoreInfo(invoice)}
                                                    >
                                                        <IoMdEye />
                                                    </Button>
                                                    <Button
                                                        size={"sm"}
                                                        variant={"outline"}
                                                        isLoading={downloading === index}
                                                        colorScheme="purple"
                                                        onClick={() =>
                                                            handleDownload(invoice.invoice_id, index)
                                                        }
                                                    >
                                                        <DownloadIcon />
                                                    </Button>
                                                </Td>
                                                <Td>
                                                    <Button
                                                        size={"sm"}
                                                        variant={"outline"}
                                                        colorScheme="red"
                                                        onClick={() =>
                                                            handleDeleteConfirmation(invoice.invoice_id)
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))
                                        : invoices.map((invoice, index) => (
                                            <Tr key={invoice._id}>
                                                <Td className="md:table-cell hidden">{index + 1}</Td>
                                                <Td>{invoice.brandName}</Td>
                                                <Td className="md:table-cell hidden">{invoice.date1}</Td>
                                                <Td className="md:table-cell hidden">{invoice.time1}</Td>

                                                <Td className="flex flex-col md:flex-row gap-2">
                                                    <Button
                                                        size={"sm"}
                                                        colorScheme="purple"
                                                        onClick={() => handleMoreInfo(invoice)}
                                                    >
                                                        <IoMdEye />
                                                    </Button>
                                                    <Button
                                                        size={"sm"}
                                                        variant={"outline"}
                                                        isLoading={downloading === index}
                                                        colorScheme="purple"
                                                        onClick={() =>
                                                            handleDownload(invoice.invoice_id, index)
                                                        }
                                                    >
                                                        <DownloadIcon />
                                                    </Button>
                                                </Td>
                                                <Td>
                                                    <Button
                                                        size={"sm"}
                                                        variant={"outline"}
                                                        colorScheme="red"
                                                        onClick={() =>
                                                            handleDeleteConfirmation(invoice.invoice_id)
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
                    </>
                )}
            </div>

            <GetInvoiceByBrandName open={getInvoiceByBrandName} setOpen={setGetInvoiceByBrandName} />

            <InfoModal
                modalFor="invoice"
                data={selectedInvoice}
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
                            Delete Invoice
                        </AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                            Are you sure you want to delete this Invoice?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={handleDeleteCancel}>Cancel</Button>
                            <Button colorScheme="red" onClick={handleDeleteInvoice} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default GetAllPaidInvoices