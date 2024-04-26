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
import { format } from "date-fns";
import axios from "axios";
import InfoModal from "./common/InfoModal";
import { GoPlus } from "react-icons/go";
import TableContainer from "./common/TableContainer";
import { Link } from "react-router-dom";
import { Empty } from "antd";
import { DeleteIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLetterId } from "../store/slice/LetterSlice";
import { IoMdEye } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";

const GetAllLetters = () => {
  const [letters, setLetters] = useState([]);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredLetters, setFilteredLetter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [deleteLetterId, setDeleteLetterId] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getAllLetters`
        );
        console.log(response.data); // Check the structure of the response
        setLetters(response.data); // Assuming response.data.data is the array of letters
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (letter) => {
    setSelectedLetter(letter);
    onOpen();
  };

  const handleDeleteLeave = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/deleteLetterById/${deleteLetterId}`
      );
      toast.success("Successfully deleted leave");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllLetters`
      );
      setLetters(response.data);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  const handleDeleteConfirmation = (letterId) => {
    setDeleteLetterId(letterId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
  };
  const handleUpdateLetter = (letterId) => {
    dispatch(setLetterId(letterId));
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
        <h1 className="text-3xl font-bold mb-4">Letter Information</h1>

        <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-4 items-center mb-5">
          <Link to="/createLetter">
            <Button
              colorScheme="blue"
              onClick={onOpen}
              _hover={{ bg: "blue.600" }}
              mb="2"
              className="flex gap-2 items-center"
            >
              <GoPlus /> Create Letter
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

        {letters?.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No Letters</span>}
          />
        ) : (
          <TableContainer
            formFor="letters"
            searchText={searchText}
            setSearchText={setSearchText}
            setFilteredData={setFilteredLetter}
            data={letters}
          >
            <Thead position="sticky" top={0} bg={"#F1F5F9"}>
              <Tr>
                <Th fontWeight="bold">Name</Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Created At
                </Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  File
                </Th>
                <Th fontWeight="bold">Actions</Th>
                <Th fontWeight="bold"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {searchText !== ""
                ? filteredLetters.map((letter) => (
                    <Tr key={letter._id}>
                      <Td>{letter.name}</Td>
                      <Td className="md:table-cell hidden">
                        {format(new Date(letter.createdAt), "dd/MM/yyyy")}
                      </Td>
                      <Td className="md:table-cell hidden">
                        {letter.singleFile && (
                          <div>
                            <Button
                              as="a"
                              href={`${import.meta.env.VITE_API_BASE}/uploads/${
                                letter.singleFile
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              textDecoration="none"
                              _hover={{ textDecoration: "none" }}
                              mb={2}
                              variant="solid"
                            >
                              View
                            </Button>
                          </div>
                        )}
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(letter)}
                        >
                          <IoMdEye />
                        </Button>
                        <Link to="/UpdateLetter">
                          <Button
                            size={"sm"}
                            variant={"outline"}
                            colorScheme="blue"
                            ml={2}
                            p={0}
                            onClick={() => handleUpdateLetter(letter.letter_id)}
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
                          onClick={() =>
                            handleDeleteConfirmation(letter.letter_id)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))
                : letters?.map((letter) => (
                    <Tr key={letter._id}>
                      <Td>{letter.name}</Td>
                      <Td className="md:table-cell hidden">
                        {format(new Date(letter.createdAt), "dd/MM/yyyy")}
                      </Td>
                      <Td className="md:table-cell hidden">
                        {letter.singleFile && (
                          <div>
                            <Button
                              as="a"
                              href={`${import.meta.env.VITE_API_BASE}/uploads/${
                                letter.singleFile
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              textDecoration="none"
                              _hover={{ textDecoration: "none" }}
                              mb={2}
                              variant="solid"
                            >
                              View
                            </Button>
                          </div>
                        )}
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(letter)}
                        >
                          <IoMdEye />
                        </Button>
                        <Link to="/UpdateLetter">
                          <Button
                            size={"sm"}
                            variant={"outline"}
                            colorScheme="blue"
                            ml={2}
                            p={0}
                            onClick={() => handleUpdateLetter(letter.letter_id)}
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
                          onClick={() =>
                            handleDeleteConfirmation(letter.letter_id)
                          }
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
        modalFor="letter"
        data={selectedLetter}
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
              Delete Leave
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this Leave?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteLeave} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default GetAllLetters;
