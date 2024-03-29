import { useEffect, useState } from "react";
import { Card } from "@chakra-ui/react";
import { Badge, Calendar } from "antd";
import axios from "axios";

const CalendarComponent = () => {
  const [specialDates, setSpecialDates] = useState([]);
  const [empSpecialDates, setEmpSpecialDates] = useState([]);

  useEffect(() => {
    fetchSpecialDates();
    fetchEmpSpecialDates();
  }, []);

  const fetchSpecialDates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/specialDates`
      );
      setSpecialDates(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEmpSpecialDates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/EmployeespecialDates`
      );
      setEmpSpecialDates(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getListData = (value) => {
    const today = new Date();
    const formattedDate = value.format("DD-MM-YY");

    // Check if the date is before today
    if (value.isBefore(today, "day")) {
      return [];
    }

    const events = specialDates.filter((date) => {
      return (
        date.clientBirthday === formattedDate ||
        date.clientAnniversary === formattedDate ||
        date.workStartDate === formattedDate ||
        date.companyAnniversary === formattedDate
      );
    });

    const empEvents = empSpecialDates.filter((date) => {
      return (
        date.clientBirthday === formattedDate ||
        date.clientAnniversary === formattedDate ||
        date.workStartDate === formattedDate ||
        date.companyAnniversary === formattedDate
      );
    });

    let listData = events.map((event) => {
      let eventType = "client";
      if (event.clientBirthday === formattedDate) {
        eventType = "Client Birthday";
      } else if (event.clientAnniversary === formattedDate) {
        eventType = "Client Anniversary";
      } else if (event.workStartDate === formattedDate) {
        eventType = "Work Start Date";
      } else if (event.companyAnniversary === formattedDate) {
        eventType = "Company Anniversary";
      }
      return {
        type: "success",
        client: `${event.clientName} `,
        brand: `${event.brandName} `,
        eventType: eventType,
      };
    });

    listData = [...listData, empEvents.map((event) => {
      let eventType = "emp";
      if (event.clientBirthday === formattedDate) {
        eventType = "Client Birthday";
      } else if (event.clientAnniversary === formattedDate) {
        eventType = "Client Anniversary";
      } else if (event.workStartDate === formattedDate) {
        eventType = "Work Start Date";
      } else if (event.companyAnniversary === formattedDate) {
        eventType = "Company Anniversary";
      }
      return {
        type: "success",
        client: `${event.clientName} `,
        brand: `${event.brandName} `,
        eventType: eventType,
      };
    })
    ]
    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <>
            {item.eventType === "client" ? "Client" : item.eventType === "emp" && "Employee"}
            <li key={index}>
              <Badge
                status={item.type}
                text={
                  <>
                    Client: {item.client}
                    <br />
                    Brand: {item.brand}
                    <br />
                    Event: {item.eventType}
                  </>
                }
              />
            </li >
          </>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    // For month view, you can customize if needed
    return info.originNode;
  };

  return (
    <Card p={4}>
      <Calendar cellRender={cellRender} />
    </Card>
  );
};

export default CalendarComponent;
