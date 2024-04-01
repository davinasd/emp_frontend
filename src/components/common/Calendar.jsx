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

    // console.log(empSpecialDates)

    const empEvents = empSpecialDates.filter((date) => {
      return (
        date.dob === formattedDate ||
        date.joiningDate === formattedDate
      );
    });

    const clientListData = events.map((event) => {
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

    const empListData = empEvents.map((event) => {
      let eventType = "emp";
      if (event.dob === formattedDate) {
        eventType = "Emp DOB";
      } else if (event.joiningDate === formattedDate) {
        eventType = "Emp Joining Date";
      }
      return {
        type: "success",
        employee: `${event.name} `,
        eventType: eventType,
      };
    })
    return { clientListData, empListData };
  }

  const dateCellRender = (value) => {
    const { clientListData, empListData } = getListData(value);
    // console.log(`emp: ${empListData}`)
    return (
      <>
        <ul className="events">
          {clientListData?.map((item, index) => (
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
        {empListData?.length > 0 && (
          <>
            <h4 className="text-lg font-semibold">Events</h4>
            <ul>
              {empListData?.map((item, index) => (
                <>
                  {item.eventType === "client" ? "Client" : item.eventType === "emp" && "Employee"}
                  <li key={index}>
                    <Badge
                      status={item.type}
                      text={
                        <>
                          Client: {item.dob}
                          <br />
                          Brand: {item.joiningDate}
                        </>
                      }
                    />
                  </li >
                </>
              ))}
            </ul>
          </>
        )}
      </>
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
