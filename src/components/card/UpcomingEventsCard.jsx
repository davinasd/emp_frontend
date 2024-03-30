import { useState, useEffect } from "react";
import { Card, CardBody, Divider, Text } from "@chakra-ui/react";
import { RxCalendar } from "react-icons/rx";
import axios from "axios";

const UpcomingClientEventsCard = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  function parseUpcomingEvents(clientData) {
    const eventNames = {
      clientBirthday: 'Client Birthday',
      clientAnniversary: 'Client Anniversary',
      workStartDate: 'Work Start Date',
      companyAnniversary: 'Company Anniversary',
    };
  
    return clientData.upcomingEvents.map((eventKey) => {
      const eventName = eventNames[eventKey];
      const eventDate = clientData[eventKey];
      return `${eventName}: ${eventDate}`;
    });
  }

  console.log(clients);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/specialDates`
        );
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClientSelect = (clientId) => {
    if (selectedClient != clientId) setSelectedClient(clientId);
    else setSelectedClient(null);
  };

  return (
    <Card>
      <CardBody>
        <div className="">
          <h1 className="text-lg flex gap-2 items-center">
            <RxCalendar size={24} color="#ccc" /> Upcoming Events
          </h1>
          <Divider my={6} />
          {clients.map((client) => (
  <div
    key={client._id}
    onClick={() => handleClientSelect(client._id)}
    className="cursor-pointer"
  >
    <div className="text-blue-600 flex justify-between">
      <span>Client: {client.clientName}</span>
      <span>Brand: {client.brandName}</span>
    </div>

    {selectedClient === client._id && (
      <div className="mb-3 mt-1">
        {parseUpcomingEvents(client).map((event, index) => (
          <Text key={index} fontSize="sm">
            {event}
          </Text>
        ))}
      </div>
    )}
  </div>
))}

        </div>
      </CardBody>
    </Card>
  );
};

export default UpcomingClientEventsCard;
