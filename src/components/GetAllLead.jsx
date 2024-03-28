import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import axios from "axios";
import InfoModal from "./common/InfoModal";
import TableContainer from "./common/TableContainer";
import { DeleteIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLeadId } from "../store/slice/LeadSlice";
import { Link } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";

const GetAllLead = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLeadId, setDeleteLeadId] = useState(null); // State to store the lead id to be deleted
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false); // State to manage the delete confirmation dialog
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getAllLeads`
        );
        setLeads(response.data);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading to false in case of error too
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (lead) => {
    setSelectedLead(lead);
  };

  const handleStatusChange = async (leadId, statusNo) => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_BASE
        }/api/admin/updateLeadStatus/${leadId}/${statusNo}`
      );
      // Fetch data again after updating status
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllLeads`
      );
      setLeads(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response.data.message);
    }
  };

  const handleDeleteConfirmation = (leadId) => {
    setDeleteLeadId(leadId); // Set the lead id to be deleted
    setIsDeleteAlertOpen(true); // Open the delete confirmation dialog
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false); // Close the delete confirmation dialog
  };

  const handleDeleteLead = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE
        }/api/admin/deleteLeadById/${deleteLeadId}`
      );
      toast.success("Successfully deleted Lead");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllLeads`
      );
      setLeads(response.data);
      setIsDeleteAlertOpen(false); // Close the delete confirmation dialog after successful deletion
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleUpdateClient = (leadId) => {
    dispatch(setLeadId(leadId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="purple.500" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full pt-4">
        {leads.length === 0 ? (
          <p className="text-red-500 text-lg">No Lead Available</p>
        ) : (
          <TableContainer
            formFor="lead"
            searchText={searchText}
            setSearchText={setSearchText}
            setFilteredData={setFilteredLeads}
            data={leads}
          >
            <Thead position="sticky" top={0} bg={"#F1F5F9"} zIndex={10}>
              <Tr>
                <Th fontWeight="bold">S. No.</Th>
                <Th fontWeight="bold">Company Name</Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Brand Name
                </Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Status
                </Th>
                <Th fontWeight="bold">Action</Th>
                <Th fontWeight="bold"></Th>
              </Tr>
            </Thead>
            <Tbody maxHeight={100}>
              {searchText !== ""
                ? filteredLeads.map((lead, index) => (
                  <Tr key={lead._id}>
                    <Td>{index + 1}</Td>
                    <Td>{lead.companyName}</Td>
                    <Td className="md:table-cell hidden">{lead.brandName}</Td>
                    <Td className="md:table-cell hidden">
                      {lead.status === 0 && "Raw"}
                      {lead.status === 1 && "In-Progress"}
                      {lead.status === 2 && "Converted"}
                      {lead.status === 3 && "Lost"}
                      <Menu>
                        <MenuButton
                          size={"sm"}
                          as={Button}
                          variant={"outline"}
                        >
                          <div className="flex gap-2 items-center">
                            {lead.status === "Raw" || lead.status === 0 ? (
                              <div className="h-3 w-3 rounded-full bg-red-600" />
                            ) : lead.status === "In Progress" || lead.status === 1 ? (
                              <div className="h-3 w-3 rounded-full bg-yellow-400" />
                            ) : lead.status === "Converted" || lead.status === 2 ? (
                              <div className="h-3 w-3 rounded-full bg-blue-600" />
                            ) : (
                              <div className="h-3 w-3 rounded-full bg-green-600" />
                            )}{" "}
                            {lead.status}
                          </div>
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(lead.lead_id, 0)
                            }
                          >
                            Raw
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(lead.lead_id, 1)
                            }
                          >
                            In-Progress
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(lead.lead_id, 2)
                            }
                          >
                            Converted
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(lead.lead_id, 3)
                            }
                          >
                            Lost
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                    <Td>
                      <Button
                        size={"sm"}
                        colorScheme="purple"
                        onClick={() => handleMoreInfo(lead)}
                      >
                        <IoMdEye />
                      </Button>

                      <Link to="/UpdateLead">
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          colorScheme="blue"
                          ml={2}
                          onClick={() => handleUpdateClient(lead.lead_id)}
                        >
                          <MdModeEditOutline size={18} />
                        </Button>
                      </Link>
                    </Td>
                    <Td>
                      {" "}
                      <Button
                        size={"sm"}
                        variant={"outline"}
                        colorScheme="red"
                        ml={2}
                        p={0}
                        onClick={() => handleDeleteConfirmation(lead.lead_id)} // Open delete confirmation dialog
                      >
                        <DeleteIcon />
                      </Button>
                    </Td>
                  </Tr>
                ))
                : leads.map((lead, index) => (
                  <Tr key={lead._id}>
                    <Td>{index + 1}</Td>
                    <Td>{lead.companyName}</Td>
                    <Td className="md:table-cell hidden">{lead.brandName}</Td>
                    <Td className="md:table-cell hidden">
                      <Menu>
                        <MenuButton
                          size={"sm"}
                          as={Button}
                          variant={"outline"}
                        >
                          <div className="flex gap-2 items-center">
                            {(lead.status.toLowerCase() === "raw" || lead.status === 0) ? (
                              <div className="h-3 w-3 rounded-full bg-red-600" />
                            ) : (lead.status.toLowerCase() === "in-progress" || lead.status === 1) ? (
                              <div className="h-3 w-3 rounded-full bg-yellow-400" />
                            ) : (lead.status.toLowerCase() === "converted" || lead.status === 2) ? (
                              <div className="h-3 w-3 rounded-full bg-blue-600" />
                            ) : (
                              <div className="h-3 w-3 rounded-full bg-green-600" />
                            )}{" "}
                            {lead.status}
                          </div>
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(lead.lead_id, 0)
                            }
                          >
                            Raw
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(lead.lead_id, 1)
                            }
                          >
                            In-Progress
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(lead.lead_id, 2)
                            }
                          >
                            Converted
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(lead.lead_id, 3)
                            }
                          >
                            Lost
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                    <Td>
                      <Button
                        size={"sm"}
                        colorScheme="purple"
                        onClick={() => handleMoreInfo(lead)}
                      >
                        <IoMdEye />
                      </Button>

                      <Link to="/UpdateLead">
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          colorScheme="blue"
                          ml={2}
                          p={0}
                          onClick={() => handleUpdateClient(lead.lead_id)}
                        >
                          <MdModeEditOutline size={18} />
                        </Button>
                      </Link>
                    </Td>
                    <Td>
                      {" "}
                      <Button
                        size={"sm"}
                        variant={"outline"}
                        colorScheme="red"
                        ml={2}
                        onClick={() => handleDeleteConfirmation(lead.lead_id)} // Open delete confirmation dialog
                      >
                        <DeleteIcon />
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </TableContainer>
        )}
      </div>

      <InfoModal
        modalFor="lead"
        data={selectedLead}
        onClose={() => setSelectedLead(null)}
        isOpen={selectedLead !== null}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={undefined}
        onClose={handleDeleteCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Lead
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this lead? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteLead} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default GetAllLead;
