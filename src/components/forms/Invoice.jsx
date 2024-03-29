import { useState, useEffect, useRef } from "react";
import {
  Stack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Select,
  Text,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import MyDatePicker from "../common/MyDatePicker";
import { PiArrowsLeftRightFill } from "react-icons/pi";
import { FaPlus, FaTrashCan } from "react-icons/fa6";
import SelectProduct from "../common/SelectProduct";
import SelectClient from "../common/SelectClient";
import { useNavigate } from "react-router-dom";
const RequiredIndicator = () => {
  return <Text as="span" color="red.500" ml={1}>*</Text>;
};
const Invoice = () => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedGst, setSelectedGst] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productValue, setProductValue] = useState([]);
  const [methodGSTorCash, setMethodGSTorCash] = useState('gst');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const addServiceRef = useRef(null);

  useEffect(() => {
    if (addServiceRef.current && services.length > 1) addServiceRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [services])

  const fetchClients = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllClients`
      );
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllProducts`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleClientChange = (event) => {
    const _id = event.target.value;
    const selectedClient = clients.find((client) => client._id === _id);
    setSelectedClient(selectedClient);
  };

  // const handleProductSelect = (event) => {
  //   const productId = event.target.value;
  //   const selectedProduct = products.find(
  //     (product) => product._id === productId
  //   );
  //   setSelectedProducts([...selectedProducts, selectedProduct]);
  // };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    if (field === "productId") {
      const selectedProduct = products.find((product) => product._id === value);

      updatedServices[index]["product"] = selectedProduct;
    } else {
      updatedServices[index][field] = value;
    }
    setServices(updatedServices);
  };

  const handleAddService = () => {
    setServices([
      ...services,
      {
        product: "",
        serviceDescription: "",
        duration: "",
        quantity: 1,
        unitPrice: 0,
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const handleRemoveService = (index) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const handleSubmit = async () => {
    const requestData = {
      client_id: selectedClient.client_id,
      gst: parseInt(selectedGst),
      services: services.map((service) => ({
        product: service.product.product,
        serviceDescription: service.serviceDescription,
        duration: service.duration,
        quantity: service.quantity,
        unitPrice: service.product.unitPrice,
        startDate: service.startDate.toISOString(),
        endDate: service.endDate.toISOString(),
      })),
    };
    const requiredFields = [
      { key: 'client_id', label: 'Client' },
      { key: 'gst', label: 'GST' },
      { key: 'services', label: 'Services', isArray: true },
    ];
    const validateForm = (requestData, requiredFields) => {
      for (let { key, label, isArray } of requiredFields) {
        if (isArray ? !requestData[key] || requestData[key].length === 0 : !requestData[key]) {
          return `${label} is required.`;
        }
      }
      return null; // Return null if all required fields are present
    };

    const errorMessage = validateForm(requestData, requiredFields);
    if (errorMessage) {
      toast.error(errorMessage);
      return; // Stop further execution if validation fails
    }

    console.log(requestData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/admin/createInvoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download Invoice slip");
      }

      const pdfBlob = await response.blob();
      const fileURL = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "invoice_slip.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setServices([]);
      setSelectedGst("");
      setProducts([]);
      toast.success("Invoice Slip is downloaded successfully.", {
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/getAllInvoice");
      }, 2000);

    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(
        "Failed to download Invoice slip.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    }
  };
  const formatDate = (date) => {
    if (!date) return ""; // Handle the case where date is null or undefined
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.toLocaleString("default", { month: "short" });
    const year = formattedDate.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <Stack spacing={4}>
      <FormControl maxWidth={300} >
        <FormLabel>Select Brand <RequiredIndicator /></FormLabel>
        <Select placeholder="Select Brand" onChange={handleClientChange}>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.brandName}
            </option>
          ))}
        </Select>
        {/* <SelectClient selectSourceValue={} setSelectSourceValue={} /> */}
      </FormControl>
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
      <FormControl maxWidth={50}>
        <Select
          width={100}
          onChange={(e) => setMethodGSTorCash(e.target.value)}
          value={methodGSTorCash}
        >
          <option value={'cash'}>
            Cash
          </option>
          <option value={'gst'}>
            GST
          </option>
        </Select>
        <RequiredIndicator />
        {methodGSTorCash === 'gst' && (<>
          {/* <FormLabel>GST </FormLabel> */}
          <Input
            type="number"
            placeholder="Enter GST"
            value={selectedGst}
            onChange={(e) => setSelectedGst(e.target.value)}
          />
        </>)}
        {methodGSTorCash === 'cash' && (<>
          {/* <FormLabel>Cash <RequiredIndicator /></FormLabel> */}
          <Input
            type="number"
            placeholder="Enter Cash"
            value={selectedGst}
            onChange={(e) => setSelectedGst(e.target.value)}
          />
        </>)}
      </FormControl>

      {services.length > 0 && (
        <div className="flex items-center max-w-[1200px] overflow-x-scroll pb-10 hide-scroll-bar">
          <div className="flex flex-nowrap">
            {services.map((service, index) => (
              <div key={`card-${index}`} className="inline-block px-3">
                <div className="w-[300px] my-4 px-4 py-6 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <div
                    onClick={() => handleRemoveService(index)}
                    className="flex items-center justify-center w-10 h-10 hover:bg-red-600 transition-all bg-red-500 text-white gap-2 rounded-full mb-4 cursor-pointer"
                  >
                    <FaTrashCan />
                  </div>

                  <FormControl maxWidth={300} >
                    <FormLabel>Select Product <RequiredIndicator /></FormLabel>
                    <Select
                      placeholder="Select product"
                      onChange={(e) =>
                        handleServiceChange(index, "productId", e.target.value)
                      }
                      value={service.productId}
                    >
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.product}
                        </option>
                      ))}
                    </Select>
                    {/* <SelectProduct width={"100%"} selectSourceValue={productValue} setSelectSourceValue={setProductValue} /> */}
                  </FormControl>

                  <div className="flex gap-4 items-center mt-4">
                    <FormControl>
                      <FormLabel>Unit Price<RequiredIndicator /></FormLabel>
                      <Input
                        maxWidth={100}
                        value={service?.product?.unitPrice}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Discount<RequiredIndicator /></FormLabel>
                      <Input
                        maxWidth={50}
                        value={service?.product?.discount}
                      />
                    </FormControl>
                    <FormControl maxWidth={100}>
                      <FormLabel>Total<RequiredIndicator /></FormLabel>
                      <Input
                        value={
                          (service?.product?.unitPrice * service?.quantity
                            + (selectedGst * service?.product?.unitPrice / 100))
                          - (service?.product?.discount * service?.product?.unitPrice / 100)
                        }
                        disabled
                      />
                    </FormControl>
                  </div>

                  <div className="flex gap-4 items-center mt-4">
                    <FormControl maxWidth={100}>
                      <FormLabel>Quantity<RequiredIndicator /></FormLabel>
                      <Input
                        type="number"
                        value={service.quantity}
                        onChange={(e) =>
                          handleServiceChange(index, "quantity", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl maxWidth={100}>
                      <FormLabel>Duration<RequiredIndicator /></FormLabel>
                      <Input
                        type="text"
                        value={service.duration}
                        onChange={(e) =>
                          handleServiceChange(index, "duration", e.target.value)
                        }
                      />
                    </FormControl>
                  </div>

                  <div className="flex gap-4 items-center mt-4">
                    <FormControl maxWidth={100}>
                      <FormLabel>Start Date<RequiredIndicator /></FormLabel>
                      <MyDatePicker
                        className="h-[40px]"
                        selected={service.startDate}
                        onChange={(date) =>
                          handleServiceChange(index, "startDate", date)
                        } // Corrected to use 'date' instead of 'startDate'
                      />
                      <div>{formatDate(service.startDate)}</div>
                    </FormControl>
                    <PiArrowsLeftRightFill size={20} />
                    <FormControl maxWidth={100}>
                      <FormLabel>End Date<RequiredIndicator /></FormLabel>
                      <MyDatePicker
                        className="h-[40px]"
                        selected={service.endDate}
                        onChange={(date) =>
                          handleServiceChange(index, "endDate", date)
                        }
                      // Corrected to use 'date' instead of 'endDate'
                      />
                      <div>{formatDate(service.endDate)}</div>
                    </FormControl>
                  </div>

                  <FormControl mt={4}>
                    <FormLabel>Service Description<RequiredIndicator /></FormLabel>
                    <Input
                      value={service.serviceDescription}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "serviceDescription",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                </div>
              </div>
            ))}
            <div
              onClick={handleAddService}
              ref={addServiceRef}
              className="border-[1px] w-[300px] my-4 transition-all hover:shadow-lg bg-purple-200 hover:bg-purple-300 rounded-lg border-gray-100 text-purple-900 flex flex-col gap-4 items-center justify-center cursor-pointer"
            >
              <FaPlus size={40} />
              Add Service
            </div>
          </div>
        </div>
      )}

      {services.length === 0 && selectedClient && (
        <Button
          onClick={handleAddService}
          variant={"outline"}
          colorScheme="purple"
        >
          Add Service
        </Button>
      )}
      <Button onClick={handleSubmit} colorScheme="purple">
        Create Invoice
      </Button>
    </Stack>
  );
};

export default Invoice;
