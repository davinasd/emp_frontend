import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <Flex direction="column" align="center" justify="center" p={5}>
      <Heading mb={4}>Dashboard</Heading>
      <Flex wrap="wrap" justify="center" gap={6}>
        {/* Profile Management Card */}
        <Box w="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} textAlign="center">
          <Heading fontSize="xl">Profile Management</Heading>
          <Text mt={4}>Manage your profile settings</Text>
          <Button mt={6} colorScheme="blue" as={Link} to="/employeeById">
            Manage Profile
          </Button>
        </Box>

        {/* Change Password Card */}
        <Box w="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} textAlign="center">
          <Heading fontSize="xl">Change Password</Heading>
          <Text mt={4}>Update your password regularly</Text>
          <Button mt={6} colorScheme="teal" as={Link} to="/changePassword">
            Change Password
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Settings;
