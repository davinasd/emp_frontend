import { CloseIcon } from "@chakra-ui/icons";
import { Button, Drawer, Flex, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const GetLedgersByClient = ({ open, setOpen }) => {
    const onBrandSearch = () => { }
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [fetchedItems, setFetchedItems] = useState([]);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE}/api/admin/getAllClients`)
            .then((response) => {
                console.log(response.data)
                setClients(response.data);
            })
            .catch((error) => {
                console.error("Error fetching clients:", error);
            });
    }, [])

    useEffect(() => {
        try {
            axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getLeadgerByClientId/${selectedBrand}`)
                .then((res) => {
                    console.log(res.data);
                    setFetchedItems(res.data);
                });

        } catch (error) {
            console.log(`Error fetching by brand: ${error}`)
        }
    }, [selectedBrand])

    const handleClose = () => {
        setOpen(!open);
        setSelectedBrand(null);
        setFetchedItems(null);
    }

    // const handleGetLedger = () => { }

    return (
        <Drawer
            open={open}
            closable={false}
            onClose={() => setOpen(false)}
            placement="bottom"
            width="100VW"
            height="100vh"
            title={
                <h1 className="text-[24px] flex gap-2 items-center text-gray-700 max-w-[700px]">Ledger By Client</h1>
            }
            extra={
                <Button type="text" onClick={() => setOpen(!open)} className="flex items-center justify-center"><CloseIcon /></Button>
            }
            footer={
                <Flex justify="center">
                    <div className="flex gap-2 max-w-[800px] w-full justify-end mt-1 mb-3">
                        <Button onClick={handleClose}>Cancel</Button>
                        {/* <Button onClick={handleGetLedger} type="primary" className="bg-blue-500">
                            Get Ledger
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
                            placeholder="Choose a client"
                            className="w-full"
                        >
                            {/* <option value="test brac">test brac</option> */}
                            {clients.map((client, idx) => (
                                <option key={`${idx}-${client.client_id}`} value={client.client_id}>
                                    {client.clientName}
                                </option>
                            ))}
                        </Select>
                    </div>
                    {selectedBrand &&
                        fetchedItems?.invoices?.map((item, index) => (
                            <div key={`item-${index}`} className="flex flex-col gap-2 mt-5">
                                <div className="w-full p-3 flex items-start gap-6 bg-gray-50 rounded-md">
                                    <div className="text-sm font-semibold text-gray-500">Date: {item?.date1}</div>
                                    <div className="grid grid-cols-2 w-full">
                                        <div>Bill Type: {item?.billtype}</div>
                                        <div>Discount: {item?.discount}</div>
                                        <div>Gst: {item?.gst}</div>
                                        <div>Subtotal: {item?.subtotal}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </Drawer>
    );
}

export default GetLedgersByClient