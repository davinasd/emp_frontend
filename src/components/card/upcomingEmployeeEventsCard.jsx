import { useState, useEffect } from "react";
import { Card, CardBody, Divider, Text } from "@chakra-ui/react";
import { FaCalendarAlt } from "react-icons/fa"; // Corrected import
import axios from "axios";

const UpcomingEmployeeEventsCard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  function parseUpcomingEvents(employeeData) {
    const eventNames = {
      joiningDate: 'Joining Date', 
      dob: 'Date of Birth', 
    };

    return employeeData.upcomingEvents.map((eventKey) => {
      const eventName = eventNames[eventKey];
      const eventDate = employeeData[eventKey];
      return `${eventName}: ${eventDate}`;
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/EmployeespecialDates`
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEmployeeSelect = (employeeId) => {
    if (selectedEmployee !== employeeId) setSelectedEmployee(employeeId);
    else setSelectedEmployee(null);
  };

  return (
    <Card>
      <CardBody>
        <h1 className="text-lg flex gap-2 items-center">
          <FaCalendarAlt size={24} color="#ccc" /> Upcoming Events
        </h1>
        <Divider my={6} />
        {employees.map((employee) => (
          <div
            key={employee._id}
            onClick={() => handleEmployeeSelect(employee._id)}
            className="cursor-pointer"
          >
            <div className="text-blue-600 flex justify-between">
              <span>Employee: {employee.name}</span> {/* Adjusted for employee data */}
            </div>
            {selectedEmployee === employee._id && (
              <div className="mb-3 mt-1">
                {parseUpcomingEvents(employee).map((event, index) => (
                  <Text key={index} fontSize="sm">
                    {event}
                  </Text>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default UpcomingEmployeeEventsCard;
