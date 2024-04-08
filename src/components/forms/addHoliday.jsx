import { useState } from 'react';
import {
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateHoliday = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [holiday, setHoliday] = useState({
    title: '',
    date: new Date(),
    type: '',
  });

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
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/admin/addHoliday`,
        holiday,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast({
          title: 'Holiday created successfully.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

        navigate('/getAllHolidays');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error creating holiday.',
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
        <Text fontSize="2xl" fontWeight="semibold" mb="4">Add New Holiday</Text>
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
              defaultValue={moment()}
              format="YYYY-MM-DD"
            />
          </FormControl>
          <FormControl id="type" mt="4" isRequired>
            <FormLabel>Type</FormLabel>
            <Select
              name="type"
              onChange={handleChange}
              placeholder="Select type"
              value={holiday.type}
            >
              <option value="company">Company</option>
              <option value="public">Public</option>
              <option value="optional">Optional</option>
            </Select>
          </FormControl>
          <Button mt="6" colorScheme="blue" type="submit">
            Create Holiday
          </Button>
        </form>
      </Box>
    </>
  );
};

export default CreateHoliday;
