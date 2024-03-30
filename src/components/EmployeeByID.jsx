import { Box, Card, CardBody, Divider, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EmployeeById = () => {
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const employee_id = userData ? userData.employee_id : null;
  const [employee, setEmployeeDetail] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      if (employee_id) { // Checking if we have an ID
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE}/api/admin/getEmployeeByID/${employee_id}`
          );
          const data = await response.json();
          setEmployeeDetail(data);
        } catch (error) {
          console.error("Error fetching employee detail:", error);
        }
      }
    };

    fetchEmployeeDetail();
  }, [employee_id]);

  return (
    <Box overflow="hidden" p="4">
      {employee ? (
              <><div className="w-[40px] h-[40px] flex items-center justify-center bg-purple-500 rounded-full text-white">
              </div><div className="flex flex-col md:flex-row gap-3 w-full">
                      <Card bg={"purple.100"} className="md:w-1/3 w-full">
                          <CardBody>
                              <Heading pb={4} size="xs">
                                  Name:
                              </Heading>
                              <Text fontSize={28} textTransform={"capitalize"}>
                                  {employee.title} {employee.name || "No data"}
                              </Text>
                          </CardBody>
                      </Card>
                      <Card className="md:w-1/3 w-full">
                          <CardBody>
                              <Heading pb={4} size="xs">
                                  Position:
                              </Heading>
                              <Divider mb={5} />
                              <Text fontSize={18} textTransform={"capitalize"}>
                                  {employee.position || "No data"}
                              </Text>
                          </CardBody>
                      </Card>
                      <Card className="md:w-1/3 w-full">
                          <CardBody>
                              <Heading pb={4} size="xs">
                                  Type:
                              </Heading>
                              <Divider mb={5} />
                              <Text fontSize={18} textTransform={"capitalize"}>
                                  {employee.type || "No data"}
                              </Text>
                          </CardBody>
                      </Card>
                  </div><div className="flex flex-col md:flex-row gap-3 w-full mt-4">
                      <Card className="md:w-1/2 w-full">
                          <CardBody>
                              <Heading pb={4} size="xs">
                                  General Information:
                              </Heading>
                              <Divider mb={5} />
                              {employee.gender && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Gender{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.gender}
                                      </Text>{" "}
                                  </>
                              )}
                              {employee.dob && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          DOB{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.dob}
                                      </Text>{" "}
                                  </>
                              )}
                              {employee.position && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Position{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.position}
                                      </Text>
                                  </>
                              )}
                              {employee.gender && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Gender{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.gender}
                                      </Text>
                                  </>
                              )}
                              {employee.department && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Department{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.department}
                                      </Text>
                                  </>
                              )}
                              {employee.email && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Email{" "}
                                      </Text>
                                      <Text className="text-lg">{employee.email}</Text>
                                  </>
                              )}
                              {employee.manager_id && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Manager ID{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.manager_id}
                                      </Text>
                                  </>
                              )}
                              {employee.leavingDate && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Leaving Date{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.leavingDate}
                                      </Text>
                                  </>
                              )}
                              {/* {employee.permissions.length > 0 && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Permissions{" "}
                                      </Text>
                                      {employee.permissions.map((permission, index) => (
                                          <Text
                                              key={`permission-${index}`}
                                              className="text-lg capitalize"
                                          >
                                              {permission}
                                          </Text>
                                      ))}
                                  </>
                              )} */}
                          </CardBody>
                      </Card>
                      <Card className="md:w-1/2 w-full">
                          <CardBody>
                              <Heading pb={4} size="xs">
                                  Other Information:
                              </Heading>
                              <Divider mb={5} />
                              {employee.joiningDate && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Joining Date{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.joiningDate}
                                      </Text>
                                  </>
                              )}
                              {employee.contactNo && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Contact Number{" "}
                                      </Text>
                                      <Text className="text-lg">{employee.contactNo}</Text>
                                  </>
                              )}
                              {employee.probationPeriod && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Probation Period{" "}
                                      </Text>
                                      <Text className="text-lg">
                                          {employee.probationPeriod}
                                      </Text>
                                  </>
                              )}
                              {employee.aadharNumber && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Aadhar Number{" "}
                                      </Text>
                                      <Text className="text-lg">{employee.aadharNumber}</Text>
                                  </>
                              )}
                              {employee.panNumber && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          PAN Number{" "}
                                      </Text>
                                      <Text className="text-lg">{employee.panNumber}</Text>
                                  </>
                              )}
                              {employee.permanentAddress && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Permanent Address{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.permanentAddress}
                                      </Text>
                                  </>
                              )}
                              {employee.correspondenceAddress && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Correspondence Address{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          {employee.correspondenceAddress}
                                      </Text>
                                  </>
                              )}
                              {employee.guardianDetails && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Guardian Details{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          Name: {employee.guardianDetails.guardianName}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          Contact: {employee.guardianDetails.guardianContactNo}
                                      </Text>
                                  </>
                              )}
                              {employee.bankDetails && (
                                  <>
                                      <Text className="text-sm font-bold text-gray-500 mt-3">
                                          Bank Details{" "}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          Name: {employee.bankDetails.bankName}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          Account no: {employee.bankDetails.bankAccountNo}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          IFSC: {employee.bankDetails.bankIfscCode}
                                      </Text>
                                      <Text className="text-lg capitalize">
                                          Type: {employee.bankDetails.type}
                                      </Text>
                                  </>
                              )}
                          </CardBody>
                      </Card>
                  </div></>
      ) : (
        <Text>No employee details available</Text>
      )}
    </Box>
  );
};

export default EmployeeById;
