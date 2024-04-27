import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
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
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import TableContainer from "./common/TableContainer";
import { MdModeEditOutline } from "react-icons/md";
import { DeleteIcon } from "@chakra-ui/icons";

const GetAllHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Correct: useNavigate is called at the top level

  const [deleteHolidayId, setDeleteHolidayId] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredHolidays, setFilteredHolidays] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getAllHolidays`
        );
        setHolidays(response.data.holidays);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching holidays:", error);
        setIsLoading(false);
      }
    }
    fetchHolidays();
  }, []);
  const handleUpdateHoliday = (calendar_id) => {
    // Navigate to the update page, passing the calendar_id as a parameter
    navigate(`/updateHoliday/${calendar_id}`);
  };

  const handleDeleteHoliday = async (calender_id) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/deleteHoliday/${calender_id}`
      );
      toast.success("Holiday successfully deleted");
      // Fetch the updated list of holidays
      const updatedHolidays = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllHolidays`
      );
      setHolidays(updatedHolidays.data.holidays);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Failed to delete holiday");
    }
  };

  const handleDeleteConfirmation = (holidayId) => {
    setDeleteHolidayId(holidayId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
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
      <div className="w-full p-6">
        <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-4 items-center mb-5">
          <Link to="/createHoliday">
            <Button
              colorScheme="blue"
              _hover={{ bg: "blue.600" }}
              mb="2"
              className="flex gap-2 items-center"
            >
              <GoPlus /> Add a Holiday
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

        {holidays.length === 0 ? (
          <p className="text-red-500 text-lg">No Holidays Available</p>
        ) : (
          <TableContainer
            formFor="holiday"
            searchText={searchText}
            setSearchText={setSearchText}
            setFilteredData={setFilteredHolidays}
            data={holidays}
          >
            <Thead position="sticky" top={0} bg={"#F1F5F9"} zIndex={10}>
              <Tr>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  S. No.
                </Th>
                <Th fontWeight="bold">Title</Th>
                <Th fontWeight="bold">Date</Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Type
                </Th>
                <Th fontWeight="bold">Action</Th>
                <Th fontWeight="bold"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {searchText !== ""
                ? filteredHolidays?.map((holiday, index) => (
                    <Tr key={holiday._id}>
                      <Td className="md:table-cell hidden">{index + 1}</Td>
                      <Td>{holiday.title}</Td>
                      <Td>{holiday.date}</Td>
                      <Td className="md:table-cell hidden">{holiday.type}</Td>
                      <Td>
                        <Button
                          colorScheme="green"
                          onClick={() =>
                            handleUpdateHoliday(holiday.calender_id)
                          }
                        >
                          Update
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          onClick={() =>
                            handleDeleteConfirmation(holiday.calender_id)
                          }
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))
                : holidays.map((holiday, index) => (
                    <Tr key={holiday._id}>
                      <Td className="md:table-cell hidden">{index + 1}</Td>
                      <Td>{holiday.title}</Td>
                      <Td>{holiday.date}</Td>
                      <Td className="md:table-cell hidden">{holiday.type}</Td>
                      <Td>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          colorScheme="blue"
                          ml={2}
                          p={0}
                          onClick={() =>
                            handleUpdateHoliday(holiday.calender_id)
                          }
                        >
                          <MdModeEditOutline size={18} />
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          colorScheme="red"
                          ml={50}
                          onClick={() =>
                            handleDeleteConfirmation(holiday.calender_id)
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
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={undefined}
        onClose={handleDeleteCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Holiday
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this holiday?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteHoliday(deleteHolidayId)}
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

export default GetAllHolidays;
