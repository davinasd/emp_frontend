import { Box, Flex, Heading, Text, Button, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Switch, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Settings = () => {
  const toast = useToast();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const employee_id = userData ? userData.employee_id : null;

  const [currentUserData, setCurrentUserData] = useState();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [noPermission, setNoPermission] = useState(false);

  const handlePermissionChange = async (permissionName, isSelected) => {
    let updatedPermissions;

    if (isSelected) {
      // Add the permission to the list
      if (permissionName === "none") {
        setNoPermission(true);
        updatedPermissions = [];
      } else {
        setNoPermission(false);
        updatedPermissions = [
          ...selectedPermissions,
          { name: permissionName, value: permissionName }
        ];
      }
    } else {
      // Remove the permission from the list
      updatedPermissions = selectedPermissions.filter(
        (perm) => perm.name !== permissionName
      );
    }

    // Update the state
    setSelectedPermissions(updatedPermissions);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE}/api/admin/employees/EditPermission/${employee_id}`,
        { permissions: updatedPermissions }
      );
      toast({
        title: "Success",
        description: "Updated user permission",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating permission:", error);
      toast({
        title: "Error",
        description: "Failed to update user permission.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getEmployeeByID/${employee_id}`);
        setCurrentUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchUserData();
  }, [])

  useEffect(() => {
    setSelectedPermissions(currentUserData?.permissions);
  }, [currentUserData])

  return (
    <Flex direction="column" p={5} gap={4}>
      <Heading mb={6}>Dashboard</Heading>
      <Flex wrap="wrap" gap={6} mb={4}>
        {/* Profile Management Card */}
        <Box w="md" borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} textAlign="left">
          <Heading fontSize="xl">Profile Management</Heading>
          <Text mt={4}>Manage your profile settings</Text>
          <Button mt={6} colorScheme="blue" as={Link} to="/employeeById">
            Manage Profile
          </Button>
        </Box>

        {/* Change Password Card */}
        <Box w="md" borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} textAlign="left">
          <Heading fontSize="xl">Change Password</Heading>
          <Text mt={4}>Update your password regularly</Text>
          <Button mt={6} colorScheme="teal" as={Link} to="/changePassword">
            Change Password
          </Button>
        </Box>
      </Flex>
      <div className='flex flex-col mb-4 w-full'>
        <h1 className="text-md font-semibold text-gray-700 text-left self-start mb-3">Permissions</h1>
        <Accordion allowToggle>
          <AccordionItem borderBottom={"none"}>
            <h2>
              <AccordionButton className="w-full py-4 px-2 text-lg font-semibold flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-all">
                Manage Permissions
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} pt={0}>
              <div
                className="w-full py-2 text-md font-semibold border-b border-t flex items-center justify-between"
              >
                None <Switch size='md' isChecked={selectedPermissions?.length === 0} onChange={(e) => handlePermissionChange("none", e.target.checked)} />
              </div>
              <div
                className="w-full py-2 text-md font-semibold border-b border-t flex items-center justify-between"
              >
                Read <Switch size='md' isChecked={!noPermission && selectedPermissions?.some(i => i.value.includes('read'))} onChange={(e) => handlePermissionChange("read", e.target.checked)} />
              </div>
              <div
                className="w-full py-2 text-md font-semibold border-b border-t flex items-center justify-between"
              >
                Write <Switch size='md' isChecked={!noPermission && selectedPermissions?.some(i => i.value.includes('write'))} onChange={(e) => handlePermissionChange("write", e.target.checked)} />
              </div>
              <div
                className="w-full py-2 text-md font-semibold border-b border-t flex items-center justify-between"
              >
                Update <Switch size='md' isChecked={!noPermission && selectedPermissions?.some(i => i.value.includes('update'))} onChange={(e) => handlePermissionChange("update", e.target.checked)} />
              </div>
              <div
                className="w-full py-2 text-md font-semibold border-b border-t flex items-center justify-between"
              >
                Delete <Switch size='md' isChecked={!noPermission && selectedPermissions?.some(i => i.value.includes('delete'))} onChange={(e) => handlePermissionChange("delete", e.target.checked)} />
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>

      <div className='flex flex-col mb-4 w-full'>
        <h1 className="text-md font-semibold text-gray-700 text-left self-start mb-3">Employee</h1>
        <Link to={"/createEmp"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Create Employee</Link>
        <Link to={"/getAllEmp"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">All Employees</Link>
        <Link to={"/employeeById"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Update Employee</Link>
      </div>

      <div className='flex flex-col mb-4 w-full'>
        <h1 className="text-md font-semibold text-gray-700 text-left self-start mb-3">Create</h1>
        <Link to={"/createEmp"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Employee</Link>
        <Link to={"/createInvoice"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Invoice</Link>
        <Link to={"/createProject"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Project</Link>
        <Link to={"/createClient"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Client</Link>
        <Link to={"/createClient"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Client</Link>
        <Link to={"/createLeave"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Leave</Link>
        <Link to={"/createLead"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Lead</Link>
        <Link to={"/createTask"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Task</Link>
        <Link to={"/createSlip"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Slip</Link>
        <Link to={"/createLetter"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Letter</Link>
        <Link to={"/createExpense"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Expense</Link>
        <Link to={"/createLedger"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Ledger</Link>
        <Link to={"/createHoliday"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Holiday</Link>
        <Link to={"/createReceivable"} className="w-full py-4 px-2 text-lg font-semibold border-b border-t flex items-center cursor-pointer hover:bg-gray-100 transition-all">Receivable</Link>
      </div>


      {/* <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={onPermissionModalClose}
      /> */}
    </Flex>
  );
};

export default Settings;
