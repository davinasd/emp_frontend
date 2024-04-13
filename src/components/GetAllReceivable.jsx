import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import InfoModal from "./common/InfoModal";
import { GoPlus } from "react-icons/go";
import TableContainer from "./common/TableContainer";
import { Empty } from "antd";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteIcon } from "@chakra-ui/icons";
// import { setReceivableId } from "../store/slice/ReceivableSlice";
import { useDispatch } from "react-redux";
import { IoMdEye } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { setReceivableId } from "../store/slice/ReceivableSlice";

const GetAllReceivable = () => {
  const [receivables, setReceivables] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReceivable, setSelectedReceivable] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredReceivables, setFilteredReceivables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteReceivableId, setDeleteReceivableId] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getAllReceivable`
        );
        setReceivables(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (receivable) => {
    setSelectedReceivable(receivable);
    onOpen();
  };

  const handleDeleteReceivable = async (receivableId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE
        }/api/admin/deleteReceivableById/${receivableId}`
      );
      toast.success("Successfully deleted Receivable");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllReceivable`
      );
      setReceivables(response.data);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting receivable:", error);
    }
  };

  const handleDeleteConfirmation = (receivableId) => {
    console.log(receivableId);
    setDeleteReceivableId(receivableId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
  };

  const handleUpdateReceivable = (receivableId) => {
    dispatch(setReceivableId(receivableId));
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
      <div className="w-full p-8 md:block flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Receivable Information</h1>
        <Link to="/AddReceivable">
          <Button
            colorScheme="blue"
            _hover={{ bg: "blue.600" }}
            mb="6"
            className="flex gap-2 items-center"
          >
            <GoPlus /> Add a Receivable
          </Button>
        </Link>
        {receivables.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No Receivables Available</span>}
          />
        )}
        <TableContainer
          formFor="receivable"
          searchText={searchText}
          setSearchText={setSearchText}
          setFilteredData={setFilteredReceivables}
          data={receivables}
        >
          <Thead position="sticky" top={0} bg={"#F1F5F9"} zIndex={10}>
            <Tr>
              <Th fontWeight="bold" className="md:table-cell hidden">S. No.</Th>
              <Th fontWeight="bold">Client Name</Th>
              <Th fontWeight="bold" className="md:table-cell hidden">Brand Name</Th>
              <Th fontWeight="bold" className="md:table-cell hidden">Company Name</Th>
              <Th fontWeight="bold" className="md:table-cell hidden">Total Amount</Th>
              <Th fontWeight="bold" className="md:table-cell hidden">Amount</Th>
              <Th fontWeight="bold" className="md:table-cell hidden">Balance Due</Th>
              <Th fontWeight="bold">Action</Th>
              <Th fontWeight="bold"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {searchText !== ""
              ? filteredReceivables.map((receivable, index) => (
                <Tr key={receivable._id}>
                  <Td className="md:table-cell hidden">{index + 1}</Td>
                  <Td>{receivable.receivableName}</Td>
                  <Td className="md:table-cell hidden">{receivable.brandName}</Td>
                  <Td className="md:table-cell hidden">{receivable.companyName}</Td>
                  <Td className="md:table-cell hidden">{receivable.totalAmount}</Td>
                  <Td className="md:table-cell hidden">{receivable.amount}</Td>
                  <Td className="md:table-cell hidden">{receivable.balanceDue}</Td>
                  <Td>
                    <Button
                      size={"sm"}
                      colorScheme="purple"
                      onClick={() => handleMoreInfo(receivable)}
                    >
                      <IoMdEye />
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      colorScheme="red"
                      ml={2}
                      onClick={() =>
                        handleDeleteConfirmation(receivable.rec_id)
                      }
                    >
                      <DeleteIcon />
                    </Button>
                    <Link to="/UpdateReceivable">
                      <Button
                        size={"sm"}
                        variant={"outline"}
                        colorScheme="blue"
                        ml={2}
                        p={0}
                        onClick={() => handleUpdateReceivable(receivable.rec_id)}
                      >
                      <MdModeEditOutline size={18} />
                      </Button>
                    </Link>
                  </Td>
                </Tr>
              ))
              : receivables.map((receivable, index) => (
                <Tr key={receivable._id}>
                  <Td className="md:table-cell hidden">{index + 1}</Td>
                  <Td>{receivable.clientName}</Td>
                  <Td className="md:table-cell hidden">{receivable.brandName}</Td>
                  <Td className="md:table-cell hidden">{receivable.companyName}</Td>
                  <Td className="md:table-cell hidden">{receivable.totalAmount}</Td>
                  <Td className="md:table-cell hidden">{receivable.amount}</Td>
                  <Td className="md:table-cell hidden">{receivable.balanceDue}</Td>
                  <Td>
                    <Button
                      size={"sm"}
                      colorScheme="purple"
                      onClick={() => handleMoreInfo(receivable)}
                    >
                      <IoMdEye />
                    </Button>

                    <Link to="/updateReceivable">
                      <Button
                        size={"sm"}
                        variant={"outline"}
                        colorScheme="blue"
                        ml={2}
                        p={0}
                        onClick={() => handleUpdateReceivable(receivable.rec_id)}
                      >
                        <MdModeEditOutline size={18} />
                      </Button>
                    </Link>
                  </Td>
                  <Td>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      colorScheme="red"
                      ml={50}
                      onClick={() =>
                        handleDeleteConfirmation(receivable.rec_id)
                      }
                    >
                      <DeleteIcon />
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </TableContainer>
      </div>

      <InfoModal
        modalFor="receivable"
        data={selectedReceivable}
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
              Delete Receivable
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this receivable?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteReceivable(deleteReceivableId)}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default GetAllReceivable;
