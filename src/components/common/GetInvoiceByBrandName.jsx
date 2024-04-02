import { CloseIcon } from "@chakra-ui/icons";
import { Button, Checkbox, Drawer, Flex, Select, Tag } from "antd";
import axios from "axios";
import download from "downloadjs";
import { useEffect, useState } from "react";

const GetInvoiceByBrandName = ({ open, setOpen }) => {
    const onBrandSearch = () => { }
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [fetchedItems, setFetchedItems] = useState([]);
    const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE}/api/admin/getAllClients`)
            .then((response) => {
                setClients(response.data);
            })
            .catch((error) => {
                console.error("Error fetching clients:", error);
            });
    }, [])

    useEffect(() => {
        try {
            axios.post(`${import.meta.env.VITE_API_BASE}/api/admin/getAllInvoiceByBrand`, { brandName: selectedBrand })
                .then((res) => {
                    setFetchedItems(res.data);
                });

        } catch (error) {
            console.log(`Error fetching by brand: ${error}`)
        }
    }, [selectedBrand])

    console.log(selectedInvoiceIds);

    const handleCumulativeInvoices = () => {
        const url = `${import.meta.env.VITE_API_BASE}/api/admin/getAllInvoiceByBrand`;
        axios({
            url,
            method: "POST",
            responseType: "blob",
            data: { invoiceIds: selectedInvoiceIds },
        })
            .then((response) => {
                const content = response.headers['content-type'];
                const currDate = new Date();
                const file_name = `invoice-${currDate}.pdf`;
                download(response, file_name, content);
            });
    }

    const handleSelect = (invoice_id) => {
        if (selectedInvoiceIds && selectedInvoiceIds.includes(invoice_id)) {
            const { newArr, invoice_id } = selectedInvoiceIds;
            setSelectedInvoiceIds(newArr);
        }
        else setSelectedInvoiceIds([...selectedInvoiceIds, invoice_id]);
    }

    const handleClose = () => {
        setOpen(!open);
        setSelectedBrand(null);
        setFetchedItems(null);
    }
    console.log(clients)

    return (
        <Drawer
            open={open}
            closable={false}
            onClose={() => setOpen(false)}
            placement="bottom"
            width="100VW"
            height="100vh"
            title={
                <h1 className="text-[24px] flex gap-2 items-center text-gray-700 max-w-[700px]">Collected Invoices</h1>
            }
            extra={
                <Button type="text" onClick={() => setOpen(!open)} className="flex items-center justify-center"><CloseIcon /></Button>
            }
            footer={
                <Flex justify="center">
                    <div className="flex gap-2 max-w-[800px] w-full justify-end mt-1 mb-3">
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button disabled={selectedInvoiceIds?.length === 0} onClick={handleCumulativeInvoices} type="primary" className="bg-blue-500">
                            Get Combined Invoices
                        </Button>
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
                            placeholder="Choose a brand"
                            className="w-full"
                        >
                            {/* <option value="test brac">test brac</option> */}
                            {clients.map((client) => (
                                <option key={client.client_id} value={client.brandName}>
                                    {client.brandName}
                                </option>
                            ))}
                        </Select>
                    </div>
                    {selectedBrand &&
                        fetchedItems?.invoices?.map((item, index) => (
                            <div key={`item-${index}`} className="flex flex-col gap-2 mt-5">
                                <div className="w-full p-3 flex items-start gap-6 bg-gray-50 rounded-md">
                                    <Checkbox
                                        onClick={() => handleSelect(item.invoice_id)}
                                    />
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

export default GetInvoiceByBrandName