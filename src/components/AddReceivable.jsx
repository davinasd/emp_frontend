import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import MyDatePicker from "./common/MyDatePicker";
import { formatDate } from "@fullcalendar/core";
import SelectSupply from "./common/SelectSupply";
import { useState } from "react";
import axios from "axios";

const AddReceivable = () => {
  const toast = useToast();
  const currDate = new Date();
  const currTime =
    currDate.getHours() +
    ":" +
    currDate.getMinutes() +
    ":" +
    currDate.getSeconds();
  const [receivables, setReceivables] = useState([]);
  const [newReceivable, setNewReceivable] = useState({
    clientName: "",
    brandName: "",
    companyName: "",
    totalAmount: 0,
    amount: 0,
    balanceDue: 0,
  });
  const [selectSupplies, setSelectSupplies] = useState([]);

  const RequiredIndicator = () => {
    return (
      <Text as="span" color="red.500" ml={1}>
        *
      </Text>
    );
  };

  const fetchreceivable = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/GetAllReceivable`
      );
      setReceivables(response.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  // console.log(receivables)

  const handleAddReceivable = async () => {
    try {
      if (newReceivable.length === 0) {
        toast({
          title: "Error",
          description: "Please fill all the fields",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/admin/addReceivable`,
          newReceivable
        );
        setNewReceivable({
          clientName: "",
          brandName: "",
          companyName: "",
          totalAmount: 0,
          amount: 0,
          balanceDue: 0,
        });
        fetchReceivable();
      }
    } catch (error) {
      console.error("Error adding source:", error);
    }
  };

  const handleReceivableChange = (field, value) => {
    let updatedService = { ...newReceivable };
    const selectedreceivable = receivables.find(
      (product) => product._id === value
    );
    updatedService["categories"] = selectedreceivable;
    setNewReceivable(updatedService);
  };

  // const handleReceivableSelectChange = (e) => {
  //     const selectedIds = Array.from(
  //         e.target.selectedOptions,
  //         (option) => option.value
  //     );
  //     setNewReceivable({
  //         ...newReceivable,
  //         employees: [...newReceivable.categories, ...selectedIds],
  //     });
  //     document.getElementById("employees").value = "";
  // }

  console.log(selectSupplies);

  return (
    <Box
      mx="auto"
      borderWidth="1px"
      borderRadius="lg"
      p="4"
      boxShadow="lg"
      m="4"
    >
      <h1 className="text-2xl font-semibold">Add Receivable</h1>
      <p className="font-light mb-4">
        Fill the below form to add a new receivable
      </p>
      <div className="flex flex-col gap-3 max-w ">
        <FormControl className="basis-2/4">
          <FormLabel>
            Client Name
            <RequiredIndicator />{" "}
          </FormLabel>
          <Input
            placeholder="Client Name"
            value={newReceivable.clientName}
            onChange={(e) =>
              setNewReceivable({
                ...newReceivable,
                clientName: e.target.value,
              })
            }
          />
        </FormControl>

        <FormControl className="basis-2/4">
          <FormLabel>
            Brand Name
            <RequiredIndicator />{" "}
          </FormLabel>
          <Input
            placeholder="Brand Name"
            value={newReceivable.brandName}
            onChange={(e) =>
              setNewReceivable({
                ...newReceivable,
                brandName: e.target.value,
              })
            }
          />
        </FormControl>

        <FormControl className="basis-2/4">
          <FormLabel>
            Company Name
            <RequiredIndicator />{" "}
          </FormLabel>
          <Input
            placeholder="Company Name"
            value={newReceivable.companyName}
            onChange={(e) =>
              setNewReceivable({
                ...newReceivable,
                companyName: e.target.value,
              })
            }
          />
        </FormControl>

        <div className="flex flex-row ">
          <FormControl>
            <FormLabel>
              Total Amount
              <RequiredIndicator />{" "}
            </FormLabel>
            <Input
              placeholder="Total Amount"
              value={newReceivable?.totalAmount}
              onChange={(e) =>
                setNewReceivable({
                  ...newReceivable,
                  totalAmount: e.target.value,
                })
              }
              maxWidth={100}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              Amount
              <RequiredIndicator />{" "}
            </FormLabel>
            <Input
              placeholder="Amount"
              value={newReceivable?.amount}
              onChange={(e) =>
                setNewReceivable({
                  ...newReceivable,
                  amount: e.target.value,
                })
              }
              maxWidth={100}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              Balance Due
              <RequiredIndicator />{" "}
            </FormLabel>
            <Input
              placeholder="Balance Due"
              value={newReceivable?.balanceDue}
              onChange={(e) =>
                setNewReceivable({
                  ...newReceivable,
                  balanceDue: e.target.value,
                })
              }
              maxWidth={100}
            />
          </FormControl>
        </div>

        {/* <Select onChange={handleRecReceivableSelectChange} size="md" value="">
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
      <Button mt={4} colorScheme="purple" onClick={handleAddReceivable}>
        Create Receivable
      </Button>
    </Box>
  );
};

export default AddReceivable;
