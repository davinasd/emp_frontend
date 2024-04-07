import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { format } from 'date-fns';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addEmployeeId } from "../../store/slice/EmployeeSlice";
import { setClientId } from "../../store/slice/ClientSlice";
import { setProjectId } from "../../store/slice/ProjectSlice";
import { useEffect, useState } from "react";
import { Divider, Empty, Tag } from "antd";
import axios from "axios";

const InfoModal = ({ modalFor, data, onClose, isOpen }) => {
  const dispatch = useDispatch();
  const priorityArray = ["low", "medium", "high", "urgent"];
  const [collectedInvoices, setCollectedInvoices] = useState([]);

  useEffect(() => {
    if (modalFor === "project" && data?.employees) {
      const employeeIds = data.employees;
      employeeIds.forEach((id) => {
        dispatch(addEmployeeId(id));
      });
      const clientId = data.client_id;
      dispatch(setClientId(clientId));
    }
    if (modalFor === "slip" && data?.employee_id) {
      const employeeId = data.employee_id;
      dispatch(addEmployeeId(employeeId));
    }
    if (modalFor === "invoice" && data?.client_id) {
      const clientId = data.client_id;
      dispatch(setClientId(clientId));
    }
    if (modalFor === "task" && data?.employee_id) {
      const employeeId = data.employee_id;
      const p = data.project_id;
      const c = data.client_id;
      dispatch(addEmployeeId(employeeId));
      dispatch(setClientId(c));
      dispatch(setProjectId(p));
    }

    if (modalFor === "project" && data && data.client_id) {
      const clientId = data.client_id;
      dispatch(setClientId(clientId));
    }

    if (modalFor === "expense" && data && data.employee_id) {
      const employeeId = data.employee_id;
      dispatch(addEmployeeId(employeeId));
    }
    if (modalFor === "ledger" && data && data.employee_id) {
      const employeeId = data.employee_id;
      dispatch(addEmployeeId(employeeId));
    }
  }, [modalFor, data, dispatch]);

  useEffect(() => {
    const getCollectionHistory = async (invoice_id) => {
      // console.log(data)
      try {
        await axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getAllInvoices`)
          .then((res) => {
            let data = res.data.filter((el) => {
              return el.invoice_id === invoice_id;
            })[0]
            console.log(data);
            setCollectedInvoices(data);
          })
      } catch (error) {
        console.log(`Error getting collection history: ${error}`)
      }
    }

    if (modalFor === "invoice") {
      getCollectionHistory(data?.invoice_id);
    }
  }, [])

  if (modalFor === "manager")
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manager Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Employee Information</h1>
                    {data.name && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Name </Text>
                        <Text className="text-lg capitalize">{data.name}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Position Information</h1>
                    {data.position && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Position </Text>
                        <Text className="text-lg capitalize">{data.position}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Contact Information</h1>
                    {data.email && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Email </Text>
                        <Text className="text-lg">{data.email}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Other Information</h1>
                    {data.requirement && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Requirements </Text>
                        <Text className="text-lg capitalize">{data.requirement}</Text>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Text className="text-md font-bold text-gray-500 mt-2">Additional Information: </Text>
                  <div className="w-full flex gap-2 mt-2">
                  </div>
                  <div className="w-full flex gap-2 mt-2">
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <div className="md:w-1/3 w-full mb-4">
                    <Text fontWeight="bold">Name: </Text>
                    <Text fontSize={"24px"} textTransform={"capitalize"}>{data.name}</Text>
                  </div>
                  <div className="md:w-1/3 w-full">
                    <Text fontWeight="bold">Position: </Text>
                    <Text fontSize={"24px"} textTransform={"capitalize"}>{data.position}</Text>
                  </div>
                  <div className="md:w-1/3 w-full">
                    <Text fontWeight="bold">Department: </Text>
                    <Text fontSize={"24px"} textTransform={"capitalize"}>{data.department}</Text>
                  </div>
                </div>
                <Text fontWeight="bold">Manager ID: </Text>
                <Text mb={4}>{data.manager_id}</Text>
                <Text fontWeight="bold">Email: </Text>
                <Text fontSize={"18px"} mb={4}>{data.email}</Text>
                <div className="flex flex-col md:flex-row md:gap-[150px] gap-4 w-full">
                  <div>
                    <Text fontWeight="bold">Date Of Birth: </Text>
                    <Text fontSize={"18px"}>{data.dob}</Text>
                  </div>
                  <div>
                    <Text fontWeight="bold">Joining Date: </Text>
                    <Text fontSize={"18px"}>{data.joiningDate}</Text>
                  </div>
                </div>
                {/* <Text fontWeight="bold">Permissions:</Text> */}
                {/* {data?.permissions && data.permissions.length > 0 ? (
                  data.permissions.map((permission, index) => (
                    <Text key={index}>{permission}</Text>
                  ))
                ) : (
                  <Text color="red">No permissions</Text>
                )} */}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

  if (modalFor === "employee")
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data?.title} {data?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Employee Information</h1>
                    {data.name && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Name </Text>
                        <Text className="text-lg capitalize">{data.name}</Text>
                      </>
                    )}
                    {data.gender && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Gender </Text>
                        <Text className="text-lg capitalize">{data.gender}</Text>
                      </>
                    )}
                    {data.dob && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">DOB </Text>
                        <Text className="text-lg capitalize">{data.dob}</Text>
                      </>
                    )}
                    {data.joiningDate && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Joining Date </Text>
                        <Text className="text-lg capitalize">{data.joiningDate}</Text>
                      </>
                    )}
                    {data.probationPeriod && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Probation Period </Text>
                        <Text className="text-lg capitalize">{data.probationPeriod}</Text>
                      </>
                    )}
                    {data.leavingDate && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Leaving Date </Text>
                        <Text className="text-lg capitalize">{data.leavingDate}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Position Information</h1>
                    {data.position && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Position </Text>
                        <Text className="text-lg capitalize">{data.position}</Text>
                      </>
                    )}
                    {data.type && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Type </Text>
                        <Text className="text-lg capitalize">{data.type}</Text>
                      </>
                    )}
                    {data.designation && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Designation </Text>
                        <Text className="text-lg capitalize">{data.designation}</Text>
                      </>
                    )}
                    {data.department && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Department </Text>
                        <Text className="text-lg capitalize">{data.department}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Contact Information</h1>
                    {data.email && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Email </Text>
                        <Text className="text-lg">{data.email}</Text>
                      </>
                    )}
                    {data.contactNo && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Contact </Text>
                        <Text className="text-lg">{data.contactNo}</Text>
                      </>
                    )}
                    {data.permanentAddress && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Permanent Address </Text>
                        <Text className="text-lg">{data.permanentAddress}</Text>
                      </>
                    )}
                    {data.correspondenceAddress && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Correspondance Address </Text>
                        <Text className="text-lg">{data.correspondenceAddress}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Other Information</h1>
                    {data.requirement && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Requirements </Text>
                        <Text className="text-lg capitalize">{data.requirement}</Text>
                      </>
                    )}
                    {data.aadharNumber && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Aadhar </Text>
                        <Text className="text-lg capitalize">{data.aadharNumber}</Text>
                      </>
                    )}
                    {data.panNumber && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">PAN </Text>
                        <Text className="text-lg capitalize">{data.panNumber}</Text>
                      </>
                    )}
                    {data.bankDetails && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Bank Details </Text>
                        <Text className="text-lg capitalize">Name: {data.bankDetails.bankName}</Text>
                        <Text className="text-lg capitalize">Acc no: {data.bankDetails.bankAccountNo}</Text>
                        <Text className="text-lg capitalize">IFSC: {data.bankDetails.bankIfscCode}</Text>
                        <Text className="text-lg capitalize">Type: {data.bankDetails.type}</Text>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Text className="text-md font-bold text-gray-500 mt-2">Additional Information: </Text>
                  <div className="w-full flex gap-2 mt-2">
                    <Text className="text-lg font-bold">Permissions</Text>
                    {data?.permissions?.map((item) => (<Tag key={item} className="text-lg">{item}</Tag>))}
                  </div>
                  <div className="w-full flex gap-2 mt-2">
                    <Text className="text-lg font-bold">Guardian Details</Text>
                    {data?.guardianDetails &&
                      data.guardianDetails.map &&
                      data.guardianDetails.map((item, index) => (
                        <div key={index}>
                          {item.guardianName && (
                            <Text>Name: {item.guardianName}</Text>
                          )}
                          {item.guardianContactNo && (
                            <Text>Contact: {item.guardianContactNo}</Text>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  if (modalFor === "leave")
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data?.employee_name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Leave Information</h1>
                    {data.type && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Type </Text>
                        <Text className="text-lg capitalize">{data.type}</Text>
                      </>
                    )}
                    {data.startDate && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Start Date </Text>
                        <Text className="text-lg">{new Date(data.startDate).toLocaleDateString('en-GB')}</Text>
                      </>
                    )}
                    {data.endDate && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">End Date </Text>
                        <Text className="text-lg">{new Date(data.endDate).toLocaleDateString('en-GB')}</Text>
                      </>
                    )}
                    {data.createdAt && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Application Date</Text>
                        <Text className="text-lg">{new Date(data.createdAt).toLocaleDateString('en-GB')}</Text>
                      </>
                    )}
                    {data.status && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Status </Text>
                        <Text className="text-lg capitalize">{data.status}</Text>
                      </>
                    )}
                    {data.reason && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Reason </Text>
                        <Text className="text-lg capitalize">{data.reason}</Text>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  if (modalFor === "client")
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>{data?.title} {data?.clientName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Task Information</h1>
                    {data.clientName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Name </Text>
                        <Text className="text-lg capitalize">{data.clientName}</Text>
                      </>
                    )}
                    {data.clientBirthday && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Name </Text>
                        <Text className="text-lg capitalize">{data.clientBirthday}</Text>
                      </>
                    )}
                    {data.workStartDate && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Work Start Date </Text>
                        <Text className="text-lg capitalize">{data.workStartDate}</Text>
                      </>
                    )}
                    {data.city && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">City </Text>
                        <Text className="text-lg capitalize">{data.city}</Text>
                      </>
                    )}
                    {data.state && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">State </Text>
                        <Text className="text-lg capitalize">{data.state}</Text>
                      </>
                    )}
                    {data.pincode && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Pincode </Text>
                        <Text className="text-lg capitalize">{data.pincode}</Text>
                      </>
                    )}
                    {data.country && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Country </Text>
                        <Text className="text-lg capitalize">{data.country}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Brand Information</h1>
                    {data.brandName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Brand Name </Text>
                        <Text className="text-lg capitalize">{data.brandName}</Text>
                      </>
                    )}
                    {data.companyName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Company Name </Text>
                        <Text className="text-lg capitalize">{data.companyName}</Text>
                      </>
                    )}
                    {data.enquiryDate && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Enquiry Date </Text>
                        <Text className="text-lg capitalize">{data.enquiryDate}</Text>
                      </>
                    )}
                    {data.buisnessAddress && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Business Address </Text>
                        <Text className="text-lg capitalize">{data.buisnessAddress}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Contact Information</h1>
                    {(data.email1 || data.email2) && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Emails </Text>
                        <Text className="text-lg">{data.email1}</Text>
                        <Text className="text-lg">{data.email2}</Text>
                      </>
                    )}
                    {(data.phone1 || data.phone2) && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Phone </Text>
                        <Text className="text-lg">{data.phone1}</Text>
                        <Text className="text-lg">{data.phone2}</Text>
                      </>
                    )}
                    {data.website && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Website </Text>
                        <Text className="text-lg">{data.website}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Other Information</h1>
                    {data.requirement && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Requirements </Text>
                        <Text className="text-lg capitalize">{data.requirement}</Text>
                      </>
                    )}
                    {data.source && data.source.length > 0 && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Source </Text>
                        <ul>
                          {data.source.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {data.singleFile && (
                      <div>
                        <Text fontWeight="bold">Single File: </Text>
                        <Button
                          as="a"
                          href={`${import.meta.env.VITE_API_BASE}/uploads/${data.singleFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          textDecoration="none"
                          _hover={{ textDecoration: "none" }}
                          mb={2}
                          variant="solid"
                        >
                          View Single File
                        </Button>
                      </div>
                    )}
                    {Array.isArray(data.multipleFiles) &&
                      data.multipleFiles.length > 0 ? (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Multiple Files</Text>
                        {data.multipleFiles.map((file, index) => (
                          <div key={index}>
                            <Button
                              as="a"
                              href={`${import.meta.env.VITE_API_BASE}/uploads/${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              textDecoration="none"
                              _hover={{ textDecoration: "none" }}
                              mr={2}
                              mb={2}
                              variant="outline"
                              colorScheme="purple"
                              mt={2}
                            >
                              View File {index + 1}
                            </Button>
                          </div>
                        ))}
                      </>) : (
                      <Text fontWeight="bold">No files provided</Text>
                    )}
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Text className="text-md font-bold text-gray-500 mt-2">Additional Information: </Text>
                  <Text className="text-lg">{data.additionalInformation}</Text>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

  if (modalFor === "project") {
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Project Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && ( // Check if data exists
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  <h2 className="text-lg mr-2">Get:</h2>
                  <Link to={`/GetEmp`}>
                    <Button colorScheme="green">Get Emp details</Button>
                  </Link>
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Project Information</h1>
                    {data.projectName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Project Name </Text>
                        <Text className="text-lg capitalize">{data.projectName}</Text>
                      </>
                    )}
                    {data.brandName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Brand Name </Text>
                        <Text className="text-lg capitalize">{data.brandName}</Text>
                      </>
                    )}
                    {data.priority && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Priority </Text>
                        <Text className="text-lg capitalize">{data.priority}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Other Information</h1>
                    {data.startDate && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Start Date </Text>
                        <Text className="text-lg">{data.startDate}</Text>
                      </>
                    )}
                    {data.deadline && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Deadline </Text>
                        <Text className="text-lg">{data.deadline}</Text>
                      </>
                    )}
                    {data.tags && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Tags </Text>
                        {data.tags.length > 0 && ( // Check if tags exist and have length greater than 0
                          <div>
                            <Text fontWeight="bold">Tags: </Text>
                            {data.tags.map((tag, index) => (
                              <Text key={index}>{tag.tagName}</Text>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Text className="text-md font-bold text-gray-500 mt-2">Additional Information: </Text>
                  <div className="w-full flex gap-2 mt-2">
                    {data?.description}
                  </div>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  if (modalFor === "invoice") {
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invoice Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  <h2 className="text-lg mr-2">Get:</h2>
                  <Link to={`/GetClient`}>
                    <Button colorScheme="green">Client details</Button>
                  </Link>
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Basic Information</h1>
                    {data.date1 && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Date </Text>
                        <Text className="text-lg capitalize">{data.date1}</Text>
                      </>
                    )}
                    {data.time1 && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Time </Text>
                        <Text className="text-lg capitalize">{data.time1}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Collection History</h1>
                    {collectedInvoices.collectionHistory.length > 0 ? 
                    collectedInvoices.collectionHistory.map((item, idx) => (
                      <div key={`his-${idx}`}>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Collection {idx+1} </Text>
                        <Text className="text-lg capitalize">{item.amountCollected}</Text>
                      </div>
                    )) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md max-w-[190px] px-3 py-1 mb-4">Service Information: </h1>
                  {data.services && (
                    <div className="grid grid-cols-2">
                      {data.services.map((service, index) => (
                        <div key={index}>
                          <Text className="text-xl font-bold text-gray-600">Service {index + 1} </Text>
                          <Text className="text-sm font-bold text-gray-500 mt-1">Invoice </Text>
                          <Text className="text-lg capitalize">{service.product}</Text>
                          <Text className="text-sm font-bold text-gray-500 mt-1">Description </Text>
                          <Text className="text-lg capitalize">{service.serviceDescription}</Text>
                          <Text className="text-sm font-bold text-gray-500 mt-1">Duration </Text>
                          <Text className="text-lg capitalize">{service.duration}</Text>
                          <Text className="text-sm font-bold text-gray-500 mt-1">Quantity </Text>
                          <Text className="text-lg capitalize">{service.quantity}</Text>
                          <Text className="text-sm font-bold text-gray-500 mt-1">Unit Price </Text>
                          <Text className="text-lg capitalize">{service.unitPrice}</Text>
                          <Text className="text-sm font-bold text-gray-500 mt-1">Start Date </Text>
                          <Text className="text-lg capitalize">{service.startDate}</Text>
                          <Text className="text-sm font-bold text-gray-500 mt-1">End Date </Text>
                          <Text className="text-lg capitalize">{service.endDate}</Text>
                        </div>
                      ))}
                    </div>)}
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  if (modalFor === "letter")
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>{data?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  {data.singleFile ? (
                    <>
                      <h2 className="text-lg mr-2">View:</h2>
                      <Button
                        as="a"
                        href={`${import.meta.env.VITE_API_BASE}/uploads/${data.singleFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        textDecoration="none"
                        _hover={{ textDecoration: "none" }}
                        mb={2}
                        variant="solid"
                        colorScheme="green"
                      >
                        View Letter
                      </Button>
                    </>
                  ) : (
                    <Text fontWeight="bold">No Letter Provided</Text>
                  )}
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Letter Information</h1>
                    {data.name && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Name </Text>
                        <Text className="text-lg capitalize">{data.name}</Text>
                      </>
                    )}
                    {data.createdAt && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Date </Text>
                        <Text className="text-lg capitalize">{new Date(data.createdAt).toLocaleDateString('en-GB')}</Text>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  if (modalFor === "lead")
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data?.title} {data?.clientName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Lead Information</h1>
                    {data.companyName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Company Name </Text>
                        <Text className="text-lg capitalize">{data.companyName}</Text>
                      </>
                    )}
                    {data.brandName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Brand Name </Text>
                        <Text className="text-lg capitalize">{data.brandName}</Text>
                      </>
                    )}
                    {data.clientName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Client Name </Text>
                        <Text className="text-lg capitalize">{data.clientName}</Text>
                      </>
                    )}
                    {data.gender && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Gender </Text>
                        <Text className="text-lg capitalize">{data.gender}</Text>
                      </>
                    )}
                    {data.enquiryDate && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Enquiry Date </Text>
                        <Text className="text-lg capitalize">{data.enquiryDate}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Contact Information</h1>
                    {(data.email1 || data.email2) && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Emails </Text>
                        <Text className="text-lg capitalize">{data.email1}</Text>
                        <Text className="text-lg capitalize">{data.email2}</Text>
                      </>
                    )}
                    {(data.phone1 || data.phone2) && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Phone </Text>
                        <Text className="text-lg capitalize">{data.phone1}</Text>
                        <Text className="text-lg capitalize">{data.phone2}</Text>
                      </>
                    )}
                    {data.businessAddress && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Business Address </Text>
                        <Text className="text-lg capitalize">{data.businessAddress}</Text>
                      </>
                    )}
                    {data.billingAddress && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Billing Address </Text>
                        <Text className="text-lg capitalize">{data.billingAddress}</Text>
                      </>
                    )}
                    {data.city && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">City </Text>
                        <Text className="text-lg capitalize">{data.city}</Text>
                      </>
                    )}
                    {data.state && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">State </Text>
                        <Text className="text-lg capitalize">{data.state}</Text>
                      </>
                    )}
                    {data.country && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Country </Text>
                        <Text className="text-lg capitalize">{data.country}</Text>
                      </>
                    )}
                    {data.pincode && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Pincode </Text>
                        <Text className="text-lg capitalize">{data.pincode}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Other Information</h1>
                    {data.website && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Website </Text>
                        <Text className="text-lg capitalize">{data.website}</Text>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Text className="text-md font-bold text-gray-500 mt-2">Additional Information: </Text>
                  <div className="w-full flex gap-2 mt-2">
                    {data.additionalInformation && (
                      <Text className="text-lg capitalize">{data.additionalInformation}</Text>
                    )}
                  </div>
                  <div className="w-full flex gap-2 mt-2">
                    {data.status && (
                      <Text className="text-lg capitalize">Status: {data.status}</Text>
                    )}
                  </div>
                  <div className="w-full flex gap-2 mt-2">
                    {data.sourceInformation && (
                      <Text className="text-lg capitalize">Source Information: {data.sourceInformation}</Text>
                    )}
                  </div>
                  <div className="w-full flex gap-2 mt-2">
                    {data.source && data.source.length > 0 && (
                      <div>
                        <ul>
                          {data.source.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="w-full flex gap-2 mt-2">
                    {data.requirement && data.requirement.length > 0 && (
                      <div>
                        <ul>
                          {data.requirement.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="w-full flex gap-2 mt-2">
                    {data.singleFile && (
                      <div>
                        <Text fontWeight="bold">Single File: </Text>
                        <Button
                          as="a"
                          href={`${import.meta.env.VITE_API_BASE}/uploads/${data.singleFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          textDecoration="none"
                          _hover={{ textDecoration: "none" }}
                          mb={2}
                          variant="solid"
                        >
                          View Single File
                        </Button>
                      </div>
                    )}
                    {Array.isArray(data.multipleFiles) &&
                      data.multipleFiles.length > 0 ? (
                      <div>
                        <Text fontWeight="bold">Files Provided: </Text>
                        {data.multipleFiles.map((file, index) => (
                          <div key={index}>
                            <Button
                              as="a"
                              href={`${import.meta.env.VITE_API_BASE}/uploads/${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              textDecoration="none"
                              _hover={{ textDecoration: "none" }}
                              mb={2}
                              variant="solid"
                            >
                              View File {index + 1}
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Text fontWeight="bold">No files provided</Text>
                    )}
                  </div>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

  if (modalFor === "task")
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>{data?.brandName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  <h2 className="text-lg mr-2">Get:</h2>
                  <Link to={`/GetProject`}>
                    <Button colorScheme="green">Project details</Button>
                  </Link>
                  <Link to={`/GetEmp`}>
                    <Button colorScheme="green">EMP details</Button>
                  </Link>
                  <Link to={`/GetClient`}>
                    <Button colorScheme="green">Client details</Button>
                  </Link>
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Task Information</h1>
                    <Text className="text-sm font-bold text-gray-500 mt-3">Brand Name </Text>
                    <Text className="text-lg capitalize">{data.brandName}</Text>
                    <Text className="text-sm font-bold text-gray-500 mt-2">Task ID: </Text>
                    <Text className="text-lg">{data.task_id}</Text>
                    <Text className="text-sm font-bold text-gray-500 mt-2">Priority </Text>
                    <Text className="text-lg capitalize">
                      {priorityArray[data.priority] || data.priority}
                      {/* <div className={`h-2 w-2 rounded-full ${data.priority === 0 && "bg-red-400"
                        } ${data.priority === 1 && "bg-orange-300"
                        } ${data.priority === 2 && "bg-blue-300"
                        } ${data.priority === 3 && "bg-gray-300"
                        }`} /> */}
                    </Text>
                    <Text className="text-sm font-bold text-gray-500 mt-2">Status: </Text>
                    <Text className="text-lg capitalize">{data.status}</Text>
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">General Information</h1>
                    <Text className="text-sm font-bold text-gray-500 mt-3">Start Date: </Text>
                    <Text className="text-lg">{data.startDate}</Text>
                    <Text className="text-sm font-bold text-gray-500 mt-2">Deadline: </Text>
                    <Text className="text-lg">{data.deadline}</Text>
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Text className="text-md font-bold text-gray-500 mt-2">Description: </Text>
                  <Text className="text-lg">{data.description}</Text>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  if (modalFor === "expense")
    return (
      <Modal
        size={"4xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>{data?.name || "Expense"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  <h2 className="text-lg mr-2">Get:</h2>
                  <Link to={`/GetEmp`}>
                    <Button colorScheme="green">Employee</Button>
                  </Link>
                  <Divider type="vertical" />
                  {/* <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">General Information</h1>
                    <Text className="text-sm font-bold text-gray-500 mt-3">Amount </Text>
                    <Text className="text-lg capitalize">{data?.amountReceived}</Text>
                    <Text className="text-sm font-bold text-gray-500 mt-2">Created At: </Text>
                    <Text className="text-lg">{data?.createdAt}</Text>
                    <Text className="text-sm font-bold text-gray-500 mt-2">Date: </Text>
                    <Text className="text-lg capitalize">{data?.date1}</Text>
                    <Text className="text-sm font-bold text-gray-500 mt-2">Time: </Text>
                    <Text className="text-lg capitalize">{data?.time1}</Text>
                    <Text className="text-sm font-bold text-gray-500 mt-2">Total Spent: </Text>
                    <Text className="text-lg capitalize">{data?.totalSpent}</Text>
                    <Text className="text-sm font-bold text-gray-500 mt-2">Employee: </Text>
                    <Text className="text-lg capitalize">{data?.totalSpent}</Text>
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Other Information</h1>
                    {data?.categories?.map((cat, index) => (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Category {index + 1}: </Text>
                        <Text className="text-lg">{cat.supplyTagName}</Text>
                      </>
                    ))}
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Text className="text-md font-bold text-gray-500 mt-2">Description: </Text>
                  <Text className="text-lg">{data.description}</Text>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

  if (modalFor === "slip") {
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Slip Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  <h2 className="text-lg mr-2">Get:</h2>
                  <Link to={`/GetProject`}>
                    <Button colorScheme="green">Project details</Button>
                  </Link>
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Employee Information</h1>
                    {data.name && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Name </Text>
                        <Text className="text-lg capitalize">{data.name}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Position Information</h1>
                    {data.position && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Position </Text>
                        <Text className="text-lg capitalize">{data.position}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Contact Information</h1>
                    {data.email && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Email </Text>
                        <Text className="text-lg">{data.email}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Other Information</h1>
                    {data.requirement && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Requirements </Text>
                        <Text className="text-lg capitalize">{data.requirement}</Text>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Text className="text-md font-bold text-gray-500 mt-2">Additional Information: </Text>
                  <div className="w-full flex gap-2 mt-2">
                  </div>
                  <div className="w-full flex gap-2 mt-2">
                  </div>
                </div>
                <div>
                  <Link to={`/GetEmp`}>
                    <Button>Get EMP details</Button>
                  </Link>
                  <Text fontWeight="bold">Slip History of Employee:</Text>

                  <Link to={`/GetEmpSlip`}>
                    <Button>Get Slip details</Button>
                  </Link>
                  <Text fontWeight="bold">Basic Pay: </Text>
                  <Text>{data.basicPay}</Text>
                  <Text fontWeight="bold">Travel Pay: </Text>
                  <Text>{data.travelPay}</Text>
                  <Text fontWeight="bold">Bonus: </Text>
                  <Text>{data.bonus}</Text>
                  <Text fontWeight="bold">Paid Leave: </Text>
                  <Text>{data.paidLeave}</Text>
                  <Text fontWeight="bold">Total Income: </Text>
                  <Text>{data.totalIncome}</Text>
                  <Text fontWeight="bold">TDS: </Text>
                  <Text>{data.tds}</Text>
                  <Text fontWeight="bold">Total Leaves: </Text>
                  <Text>{data.totalLeaves}</Text>
                  <Text fontWeight="bold">Advance Salary</Text>
                  <Text>{data.advanceSalary}</Text>
                  <Text fontWeight="bold">Total Deductions: </Text>
                  <Text>{data.totalDeductions}</Text>
                  <Text fontWeight="bold">Net Salary: </Text>
                  <Text>{data.netSalary}</Text>
                  <Text fontWeight="bold">Slip ID: </Text>
                  <Text>{data.slip_id}</Text>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }


  if (modalFor === "ledger") {
    return (
      <Modal
        size={"6xl"}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ledger Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <>
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end">
                  <h2 className="text-lg mr-2">Get:</h2>
                  <Link to={`/GetEmp`}>
                    <Button colorScheme="green">Employee</Button>
                  </Link>
                  {/* <Divider type="vertical" />
                  <Menu>
                    <MenuButton as={Button} variant={"outline"} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleTaskDelete()}>
                          <DeleteIcon mr={2} /> Delete
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="w-full flex items-center" onClick={() => handleChangeTaskStatus()}>
                          <CheckCircleIcon mr={2} /> Change Status
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </div>
                <Divider />
                <div className="flex gap-10">
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">General Information</h1>
                    {data.brandName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Brand Name </Text>
                        <Text className="text-lg capitalize">{data.brandName}</Text>
                      </>
                    )}
                    {data.clientName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Client Name </Text>
                        <Text className="text-lg capitalize">{data.clientName}</Text>
                      </>
                    )}
                    {data.companyName && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Company Name </Text>
                        <Text className="text-lg capitalize">{data.companyName}</Text>
                      </>
                    )}
                    {data.createdAt && (
                      <>
                        <Text className="text-sm font-bold text-gray-500 mt-3">Created At </Text>
                        <Text className="text-lg capitalize">{format(new Date(data.createdAt), "dd/MM/yyyy")}</Text>
                      </>
                    )}
                  </div>
                  <div className="max-w-[200px] md:max-w-[300px]">
                    <h1 className="text-lg font-semibold bg-gray-100 text-gray-500 rounded-md w-full px-3 py-1 mb-4">Finance Information</h1>
                    <Text className="text-sm font-bold text-gray-500 mt-3">Paid </Text>
                    <Text className="text-lg capitalize">{data?.paid}</Text>
                    <Text className="text-sm font-bold text-gray-500 mt-3">Received </Text>
                    <Text className="text-lg capitalize">{data?.received}</Text>
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Text className="text-md font-bold text-gray-500 mt-2">Additional Information: </Text>
                  <div className="w-full flex items-center justify-between gap-2 mt-2 max-w-[450px]">
                    <div className="flex items-center gap-2">
                    <Text className="font-bold">Date: </Text>
                    <Text className="text-lg capitalize">{data?.date1}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                    <Text className="font-bold">Time: </Text>
                    <Text className="text-lg capitalize">{data?.time1}</Text>
                    </div>
                  </div>
                  <div className="w-full flex items-center gap-2 mt-2">
                    <Text className="font-bold">Description: </Text>
                    <Text className="text-lg capitalize">{data?.description}</Text>
                  </div>
                </div>
                <div>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
};

export default InfoModal;
