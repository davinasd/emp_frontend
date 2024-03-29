import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyDatePicker from "./common/MyDatePicker";
import moment from "moment";

const CreateLeave = () => {
  const [selectedEmployeeInfo, setSelectedEmployeeInfo] = useState(null);
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    employee_id: "",
    type: "",
    startDate: new Date(),
    endDate: "",
    createdAt: new Date(),
    status: ""
  });
  const [tags, setTags] = useState([]);
  const [employee, setEmployee] = useState([]);
  const getEmployeeNameById = (id) => {
    const employee = employees.find((employee) => employee.employee_id === id);
    return employee ? employee.name : "Unknown Employee";
  };
  const getTagNameById = (id) => {
    const tag = tags.find((tag) => tag.tag_id === id);
    return tag ? tag.tagName : "Unknown Tag";
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE}/api/admin/getAllEmployees`)
      .then((response) => {
        setEmployee(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }, []);

  const RequiredIndicator = () => {
    return <Text as="span" color="red.500" ml={1}>*</Text>;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };
  const handleSelectManager = (event) => {
    const selectedEmployeeId = event.target.value;
    const selectedEmployee = employee.find(
      (manager) => manager.employee_id === selectedEmployeeId
    );
    setSelectedEmployeeInfo(selectedEmployee);
    setProjectData({ ...projectData, employee_id: selectedEmployeeId });
  };

  const formatDate = (date) => {
    if (!date) return ""; // Handle the case where date is null or undefined
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.toLocaleString("default", { month: "short" });
    const year = formattedDate.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_API_BASE}/api/admin/createNewLeave`,
        projectData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message, {
            autoClose: 2000,
          });
          setProjectData({
            employee_id: "",
            type: "",
            startDate: new Date(),
            endDate: new Date(),
            createdAt: new Date(),
            status: ""
          });
          setTimeout(() => {
            navigate("/getAllLeaves");
          }, 2000);
        } else {

          toast.success(response.data.message, {
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.data) {
          toast.error(error.response.data.error || error.response.data.message);
        }
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
        <h1 className="text-2xl font-semibold">Add New Leave Request</h1>
        <p className="font-light mb-4">
          Fill the below form to add a new Leave Request
        </p>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="manager_id" isRequired>
              <FormLabel>Select Employee</FormLabel>
              <Select
                onChange={handleSelectManager}
                value={projectData.employee_id}
                maxWidth={300}
              >
                <option value="">Select Employee</option>
                {employee.map((manager) => (
                  <option key={manager.employee_id} value={manager.employee_id}>
                    {manager.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            {selectedEmployeeInfo && (
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Name: {selectedEmployeeInfo.name}</Text>
                <Text fontWeight="bold">
                  Position: {selectedEmployeeInfo.position}
                </Text>
                <Text fontWeight="bold">
                  Department: {selectedEmployeeInfo.department}
                </Text>
              </VStack>
            )}

            <div className="flex flex-col md:flex-row gap-3">
              <FormControl id="type">
                <FormLabel>
                  Type
                  <RequiredIndicator />{" "}
                </FormLabel>
                <Select
                  width={300}
                  name="type"
                  onChange={handleChange}
                  placeholder="Select type"
                  value={projectData.type}
                >
                  <option value="Annual">Annual</option>
                  <option value="Sick">Sick</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Paternity">Paternity</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>
              <FormControl id="startDate">
                <FormLabel>Start Date <RequiredIndicator /> </FormLabel>
                <div className="flex gap-2 items-center">
                  <MyDatePicker
                    className="mb-1 h-[40px]"
                    selected={projectData.startDate}
                    onChange={(date) =>
                      setProjectData({ ...projectData, startDate: date })
                    }
                    defaultValue={moment()}
                    format={"DD/MM/YYYY"}
                    disabledDate={(current) => {
                      return projectData.endDate && current > projectData.endDate;
                    }}
                  />
                  <div>{formatDate(projectData.startDate)}</div>
                </div>
              </FormControl>
              <FormControl id="endDate">
                <FormLabel>End Date <RequiredIndicator /> </FormLabel>
                <div className="flex gap-2 items-center">
                  <MyDatePicker
                    className="mb-1 h-[40px]"
                    selected={projectData.endDate}
                    onChange={(date) =>
                      setProjectData({ ...projectData, endDate: date })
                    }
                    format={"DD/MM/YYYY"}
                    disabledDate={(current) => {
                      return projectData.startDate && current < projectData.startDate;
                    }}
                  />
                  <div>{formatDate(projectData.endDate)}</div>
                </div>
              </FormControl>
              <FormControl id="applicationDate">
                <FormLabel>Application Date <RequiredIndicator /> </FormLabel>
                <div className="flex gap-2 items-center">
                  <MyDatePicker
                    className="mb-1 h-[40px]"
                    selected={projectData.createdAt}
                    onChange={(date) =>
                      setProjectData({ ...projectData, createdAt: date })
                    }
                    defaultValue={moment()}
                    format={"DD/MM/YYYY"}
                  />
                  <div>{formatDate(projectData.createdAt)}</div>
                </div>
              </FormControl>
            </div>

            {/* <div className="flex gap-3">
              <FormControl id="status">
                <FormLabel>
                  Status
                  <RequiredIndicator />{" "}
                </FormLabel>
                <Select
                  width={300}
                  name="status"
                  onChange={handleChange}
                  placeholder="Select Status"
                  value={projectData.status}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>
              </FormControl>
            </div> */}

            <div className="flex gap-3">
              <FormControl id="Reason" isRequired>
                <FormLabel>Reason</FormLabel>
                <Input
                  name="reason"
                  onChange={handleChange}
                  value={projectData.reason}
                />
              </FormControl>
            </div>

            <Button mt={6} type="submit" colorScheme="purple">
              Create Leave Request
            </Button>
          </VStack>
        </form>
      </Box>
    </>

  );
};

export default CreateLeave;
