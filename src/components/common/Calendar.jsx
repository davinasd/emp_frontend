import { useEffect, useState } from "react";
import { Card } from "@chakra-ui/react";
import { Badge, Calendar } from "antd";
import axios from "axios";

const CalendarComponent = () => {
  const [specialDates, setSpecialDates] = useState([]);
  const [empSpecialDates, setEmpSpecialDates] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    fetchSpecialDates();
    fetchEmpSpecialDates();fetchHolidays();
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
  const fetchHolidays = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllHolidays`
      );
      setHolidays(response.data.holidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
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
    const holidayEvents = holidays.filter((holiday) => {
      if(holiday.date === formattedDate)
      {console.log(holiday.date)
    }

      return holiday.date === formattedDate;
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
    const holidayListData = holidayEvents.map((holiday) => {
      let eventType = "Holiday";

      return {
        type: "error",
        eventType:eventType,
        holidayTitle: holiday.title
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
    return { clientListData, empListData,holidayListData };
  }

  const dateCellRender = (value) => {
    const { clientListData, empListData, holidayListData } = getListData(value);
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
        {empListData?.map((item, index) => (
  <>
    {item.eventType === "emp" ? "Employee" : "Client"}
    <li key={index}>
      <Badge
        status={item.type}
        text={
          <>
            Employee: {item.employee}
            <br />
            Event Type: {item.eventType}
          </>
        }
      />
    </li >
  </>
))}

{holidayListData?.map((item, index) => (
  <>
    {item.eventType === "Holiday" }
    <li key={index}>
      <Badge
        status={item.type}
        text={
          <>
            Holiday: {item.holidayTitle}
            <br />
            Event Type: {item.eventType}
          </>
        }
      />
    </li >
  </>
))}


      </>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <Card p={4}>
      <Calendar cellRender={cellRender} />
    </Card>
  );
};

export default CalendarComponent;
