import { useState, useEffect } from 'react';
import {
  Box,
  Button,
    Select,
  useToast,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UpdateHoliday = () => {
  const { calendar_id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [holiday, setHoliday] = useState({
    title: '',
    date: new Date(),
    type: '',
  });

  useEffect(() => {
    // Fetch the existing holiday data
    const fetchHoliday = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getHolidayById/${calendar_id}`);
          const validDate = new Date(response.data.date);
          if (!isNaN(validDate)) { // Check if the date is valid
            setHoliday({
              ...holiday,
              title: response.data.title,
              date: validDate,
              type: response.data.type,
            });
          } else {
            console.error('Invalid date from API');
            // Handle the invalid date case, e.g., set a default date or show an error
          }
        } catch (error) {
          console.error('Error fetching holiday data:', error);
        }
      };
      

    fetchHoliday();
  }, [calendar_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHoliday({ ...holiday, [name]: value });
  };

  const handleDateChange = (date) => {
    setHoliday({ ...holiday, date: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE}/api/admin/updateHoliday/${calendar_id}`,
        holiday,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast({
        title: 'Holiday updated successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      navigate('/getAllHolidays'); 
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast({
        title: 'Error updating holiday.',
        description: error.response?.data?.message || 'An error occurred.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        mx="auto"
        borderWidth="1px"
        borderRadius="lg"
        p="4"
        boxShadow="lg"
        m="4"
      >
        <Text fontSize="2xl" fontWeight="semibold" mb="4">Update Holiday</Text>
        <form onSubmit={handleSubmit}>
          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              onChange={handleChange}
              value={holiday.title}
            />
          </FormControl>
          <FormControl id="date" mt="4" isRequired>
            <FormLabel>Date</FormLabel>
            <DatePicker
              selected={holiday.date}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
            />
          </FormControl>
          <FormControl id="type" mt="4" isRequired>
            <FormLabel>Type</FormLabel>
            <Select
              name="type"
              onChange={handleChange}
              value={holiday.type}
            >
              <option value="company">Company</option>
              <option value="public">Public</option>
              <option value="optional">Optional</option>
              <option value="festive">Festive</option>
            </Select>
          </FormControl>
          <Button mt="6" colorScheme="blue" type="submit">
            Update Holiday
          </Button>
        </form>
      </Box>
    </>
  );
};

export default UpdateHoliday;
