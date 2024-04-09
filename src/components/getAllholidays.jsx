import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
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

  const [searchText, setSearchText] = useState("");
  const [filteredHolidays, setFilteredHolidays] = useState(null);

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
        `${import.meta.env.VITE_API_BASE}/api/admin/deleteHoliday/${calender_id}`
      );
      toast.success("Holiday successfully deleted");
      // Fetch the updated list of holidays
      const updatedHolidays = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllHolidays`
      );
      setHolidays(updatedHolidays.data.holidays);
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Failed to delete holiday");
    }
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
                <Th fontWeight="bold" className="md:table-cell hidden">S. No.</Th>
                <Th fontWeight="bold">Title</Th>
                <Th fontWeight="bold">
                  Date
                </Th>
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
                      <Button colorScheme="green" onClick={() => handleUpdateHoliday(holiday.calender_id)}>
                        Update
                      </Button>
                    </Td>
                    <Td>
                      <Button colorScheme="red" onClick={() => handleDeleteHoliday(holiday.calender_id)}>
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
                        onClick={() => handleUpdateHoliday(holiday.calender_id)}
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
                        handleDeleteHoliday(holiday.calender_id)
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
    </>
  );
};

export default GetAllHolidays;
