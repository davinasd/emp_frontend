import { useState, useEffect } from "react";
import {
  Table,
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
const GetAllHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Correct: useNavigate is called at the top level

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
      <div className="w-full pt-4">
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
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {holidays.map((holiday) => (
                <Tr key={holiday._id}>
                  <Td>{holiday.title}</Td>
                  <Td>{holiday.date}</Td>
                  <Td>{holiday.type}</Td>
                  <Td>
                    <Button colorScheme="red" onClick={() => handleDeleteHoliday(holiday.calender_id)}>
                      Delete
                    </Button>
                  </Td>
                  <Td>
                    <Button colorScheme="green" onClick={() => handleUpdateHoliday(holiday.calender_id)}>
                      Update
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default GetAllHolidays;
