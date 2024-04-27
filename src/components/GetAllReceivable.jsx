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
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

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
        `${
          import.meta.env.VITE_API_BASE
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

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
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

        <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-4 items-center mb-5">
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

          <div className="flex items-center justify-end mb-2">
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
            <Button
              className="ml-2"
              size={"sm"}
              colorScheme="gray"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

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
              <Th fontWeight="bold" className="md:table-cell hidden">
                S. No.
              </Th>
              <Th fontWeight="bold">Client Name</Th>
              <Th fontWeight="bold" className="md:table-cell hidden">
                Brand Name
              </Th>
              <Th fontWeight="bold" className="md:table-cell hidden">
                Company Name
              </Th>
              <Th fontWeight="bold" className="md:table-cell hidden">
                Total Amount
              </Th>
              <Th fontWeight="bold" className="md:table-cell hidden">
                Amount
              </Th>
              <Th fontWeight="bold" className="md:table-cell hidden">
                Balance Due
              </Th>
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
                    <Td className="md:table-cell hidden">
                      {receivable.brandName}
                    </Td>
                    <Td className="md:table-cell hidden">
                      {receivable.companyName}
                    </Td>
                    <Td className="md:table-cell hidden">
                      {receivable.totalAmount}
                    </Td>
                    <Td className="md:table-cell hidden">
                      {receivable.amount}
                    </Td>
                    <Td className="md:table-cell hidden">
                      {receivable.balanceDue}
                    </Td>
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
                          onClick={() =>
                            handleUpdateReceivable(receivable.rec_id)
                          }
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
                    <Td className="md:table-cell hidden">
                      {receivable.brandName}
                    </Td>
                    <Td className="md:table-cell hidden">
                      {receivable.companyName}
                    </Td>
                    <Td className="md:table-cell hidden">
                      {receivable.totalAmount}
                    </Td>
                    <Td className="md:table-cell hidden">
                      {receivable.amount}
                    </Td>
                    <Td className="md:table-cell hidden">
                      {receivable.balanceDue}
                    </Td>
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
                          onClick={() =>
                            handleUpdateReceivable(receivable.rec_id)
                          }
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
