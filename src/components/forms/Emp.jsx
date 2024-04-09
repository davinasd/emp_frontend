import {
  FormControl,
  FormLabel,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Select as ChakraSelect,
} from "@chakra-ui/react";
import { Input, Select } from "antd";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import MyDatePicker from "../common/MyDatePicker";
import { convertDateFormatString, converDateStringFormat } from "../../helpers";

const Emp = () => {
  const singleFileRef = useRef();
  const [projectData, setProjectData] = useState({
    type: "",
    name: "",
    gender: "",
    contactNo: "",
    title: "",
    dob: "",
    position: "",
    designation: "",
    department: "",
    email: "",
    password: "",
    joiningDate: "",
    manager_id: "",
    probationPeriod: "",
    leavingDate: "",
    aadharNumber: "",
    panNumber: "",
    permanentAddress: "",
    correspondenceAddress: "",
    singleFile: null,
    multipleFiles: [],
    guardianDetails: {
      guardianName: "",
      guardianContactNo: "",
      relation: "",
    },
    bankDetails: {
      bankName: "",
      bankAccountNo: "",
      bankIfscCode: "",
      type: "",
    },
  });

  // const [tags, setTags] = useState([]);
  const [managers, setManagers] = useState([]);

  const joiningDate = `${projectData?.joiningDate?._d}`.slice(4, 15);

  // const removeTagById = (tagToRemove) => {
  //   setProjectData({
  //     ...projectData,
  //     source: projectData.source.filter((tag) => tag !== tagToRemove),
  //   });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.'); // Split the name to get mainKey and subKey
    if (subKey) {
      // If subKey exists, it means it's a nested object
      setProjectData({
        ...projectData,
        [mainKey]: {
          ...projectData[mainKey], // Preserve other fields of the main object
          [subKey]: value // Update the value of the nested field
        }
      });
    } else {
      // If no subKey, update the mainKey directly
      setProjectData({ ...projectData, [mainKey]: value });
    }
  };
  
  const handleSelectOption = (name, value) => {
    setProjectData({ ...projectData, [name]: value });
  };

  // const getTagNameById = (id) => {
  //   const tag = tags.find((tag) => tag.source_tag_id === id);
  //   return tag ? tag.sourceTagName : "Unknown Tag";
  // };
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE}/api/admin/getManagersAllDetails`)
      .then((response) => {
        setManagers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }, []);



  const handleTagChange = (e) => {
    const selectedTags = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    // Fetch tag names for selected tag IDs
    const selectedTagNames = selectedTags.map((tagId) => getTagNameById(tagId));
    console.log(selectedTagNames);

    // Update projectData with tag names
    setProjectData({
      ...projectData,
      source: [...projectData.source, ...selectedTagNames],
    });
  };
  const handleSelectChange = (setSelected, name, value) => {
    setProjectData({ ...projectData, [name]: value });
  };
  const handleSingleFileChange = (e) => {
    setProjectData({ ...projectData, singleFile: e.target.files[0] });
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setProjectData({
      ...projectData,
      multipleFiles: [...projectData.multipleFiles, ...files],
    });
  };
  const handleDeleteSingleFile = () => {
    singleFileRef.current.value = ""; // Clear the file input if necessary
    const { singleFile, ...newData } = projectData;
    setProjectData({ ...newData, singleFile: null }); // Set singleFile to null to clear it
  };

  const handleDeleteMultipleFile = (index) => {
    const updatedFiles = [...projectData.multipleFiles];
    updatedFiles.splice(index, 1);
    setProjectData({ ...projectData, multipleFiles: updatedFiles });
  };
  const RequiredIndicator = () => {
    return <Text as="span" color="red.500" ml={1}>*</Text>;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(projectData).forEach(([key, value]) => {
      if (key === "singleFile" || key === "multipleFiles") {
        if (value) {
          formData.append(key, value);
        }
      } else if (key === "dob" || key === "joiningDate") {
        // Handle dob and joiningDate separately
        const dateValue = value instanceof Date ? value.toISOString() : value; // Convert to ISO string if it's a Date object
        formData.append(key, dateValue);
      } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
        // Handle nested objects recursively
        handleNestedObject(formData, key, value);
      } else if (value !== "" && value !== null) {
        // Check if value is not null before appending to FormData
        formData.append(key, value);
      }
    });
    
    // Helper function to handle nested objects recursively
    function handleNestedObject(formData, key, value) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (typeof subValue === "object" && subValue !== null && !(subValue instanceof File)) {
          handleNestedObject(formData, `${key}[${subKey}]`, subValue);
        } else {
          // Check if subValue is not null before appending to FormData
          if (subValue !== null) {
            formData.append(`${key}[${subKey}]`, subValue);
          }
        }
      });
    }
    axios
      .post(`${import.meta.env.VITE_API_BASE}/api/admin/createEmployee`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          console.error("Failed to create project");
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.response.data.message);
      });
  };


  const handleSelectManager = (e) => {
    const selectedManagerId = e.target.value;
    setProjectData({ ...projectData, manager_id: selectedManagerId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="hidden md:block">
        <Tabs>
          <TabList>
            <Tab>Employee Information</Tab>
            <Tab>Address Information</Tab>
            <Tab>Guardian Information</Tab>
            <Tab>Bank Information</Tab>
            <Tab>Files Information</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="flex gap-3 mb-3">
                <FormControl id="title" maxWidth={100}>
                  <FormLabel>Title <RequiredIndicator /> </FormLabel>
                  <Select
                    style={{ width: "100%", height: "40px" }}
                    placeholder="Select Title"
                    onChange={(value) => handleSelectOption("title", value)}
                  >
                    <Select.Option value="Mr.">Mr.</Select.Option>
                    <Select.Option value="Mrs.">Mrs.</Select.Option>
                  </Select>
                </FormControl>

                <FormControl id="employeeName" >
                  <FormLabel>Employee Name <RequiredIndicator /> </FormLabel>
                  <Input style={{ height: 40 }} name="name" onChange={handleChange} />
                </FormControl>

                <FormControl id="gender" maxWidth={100} >
                  <FormLabel>Gender <RequiredIndicator /> </FormLabel>
                  <Select
                    style={{ width: "100%", height: "40px" }}
                    name="gender"
                    onChange={(value) => handleSelectOption("gender", value)}
                    placeholder="Select gender"
                  >
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                    <Select.Option value="Others">Others</Select.Option>
                  </Select>
                </FormControl>

                <FormControl id="contactNo" >
                  <FormLabel>Contact Number<RequiredIndicator /> </FormLabel>
                  <Input style={{ height: 40 }} name="contactNo" onChange={handleChange} />
                </FormControl>
                <FormControl id="dob" maxWidth={150} >
                  <FormLabel>DOB<RequiredIndicator /> </FormLabel>
                  <MyDatePicker
                    className="mb-1 h-[40px]"
                    selected={projectData.dob}
                    onChange={(date) =>
                      setProjectData({ ...projectData, dob: date })
                    }
                    format={"DD/MM/YYYY"}
                  />
                  <br />
                  {projectData?.dob?._d && <>{convertDateFormatString(projectData?.dob?._d)}</>}
                </FormControl>
              </div>

              <div className="flex gap-3 mb-4">
                <FormControl id="position" maxWidth={150}>
                  <FormLabel>Position<RequiredIndicator /> </FormLabel>
                  <Select
                    style={{ width: "100%", height: "40px" }}
                    name="position"
                    onChange={(value) => handleSelectOption("position", value)}
                    placeholder="Select Position"
                  >
                    <Select.Option value="superadmin">Superadmin</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                  </Select>

                </FormControl>
                <FormControl id="designation" >
                  <FormLabel>Designation<RequiredIndicator /> </FormLabel>
                  <Input
                    name="designation"
                    onChange={handleChange}
                    style={{ height: 40 }}
                  />
                </FormControl>
              </div>

              <div className="flex gap-3 mb-3">
                <FormControl id="department" maxWidth={500}>
                  <FormLabel>Department<RequiredIndicator /> </FormLabel>
                  <Input name="department" onChange={handleChange} style={{ height: 40 }} />
                </FormControl>
                <FormControl id="email" maxWidth={350}>
                  <FormLabel>Email<RequiredIndicator /> </FormLabel>
                  <Input name="email" onChange={handleChange} style={{ height: 40 }} />
                </FormControl>
                <FormControl id="password" maxWidth={350} >
                  <FormLabel>Password<RequiredIndicator /> </FormLabel>
                  <Input name="password" onChange={handleChange} style={{ height: 40 }} />
                </FormControl>
              </div>

              <div className="flex gap-3 mb-3">
                <FormControl id="joiningDate" maxWidth={300} >
                  <FormLabel>Joining Date<RequiredIndicator /> </FormLabel>
                  <div className="flex gap-2 items-center">
                    <MyDatePicker
                      className="mb-1 h-[40px]"
                      selected={projectData.joiningDate}
                      onChange={(date) =>
                        setProjectData({ ...projectData, joiningDate: date })
                      }
                      format={"DD/MM/YYYY"}
                    />
                    {projectData?.joiningDate?._d && <>{converDateStringFormat(joiningDate)}</>}
                  </div>
                </FormControl>
                <FormControl id="manager_id" >
                  <FormLabel>Assigned Manager</FormLabel>
                  <ChakraSelect
                    onChange={handleSelectManager}
                    value={projectData.manager_id}
                  >
                    <option value="">Select Manager</option>
                    {managers.map((manager, index) => (
                      <option key={`manager-${index}`} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </ChakraSelect>
                </FormControl>

                <FormControl id="type" maxWidth={200} >
                  <FormLabel>Employment Type<RequiredIndicator /> </FormLabel>
                  <Select
                    style={{ width: "100%", height: 40 }}
                    name="type"
                    onChange={(value) => handleSelectOption("type", value)}
                    placeholder="Select Type"
                  >
                    <Select.Option value="Full-Time">Full-Time</Select.Option>
                    <Select.Option value="Part-Time">Part-Time</Select.Option>
                  </Select>
                </FormControl>
              </div>
              <div className="flex gap-3 mb-3">
                <FormControl id="aadharNumber" >
                  <FormLabel>Aadhar Number<RequiredIndicator /> </FormLabel>
                  <Input name="aadharNumber" onChange={handleChange} />
                </FormControl>
                <FormControl id="panNumber" >
                  <FormLabel>Pan Number<RequiredIndicator /> </FormLabel>
                  <Input name="panNumber" onChange={handleChange} />
                </FormControl>
                <FormControl id="probationPeriod" >
                  <FormLabel>Probation Period<RequiredIndicator /> </FormLabel>
                  <Input name="probationPeriod" onChange={handleChange} />
                </FormControl>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="flex gap-3">
                <FormControl id="permanentAddress" className="w-1/2" >
                  <FormLabel>Permanent Address<RequiredIndicator /> </FormLabel>
                  <Input
                    name="permanentAddress"
                    onChange={handleChange}
                    className="h-16"
                  />
                </FormControl>
                <FormControl id="correspondenceAddress" className="w-1/2" >
                  <FormLabel>Correspondence Address<RequiredIndicator /> </FormLabel>
                  <Input
                    name="correspondenceAddress"
                    onChange={handleChange}
                    className="h-16"
                  />
                </FormControl>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="flex gap-3">
                <FormControl id="guardianDetails.relation">
                  <FormLabel>Relation<RequiredIndicator /></FormLabel>
                  <Input
                    name="guardianDetails.relation"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="guardianDetails.guardianName" >
                  <FormLabel>Guardian Name<RequiredIndicator /> </FormLabel>
                  <Input
                    name="guardianDetails.guardianName"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="guardianDetails.guardianContactNo">
                  <FormLabel>Guardian Contact Number<RequiredIndicator /> </FormLabel>
                  <Input
                    name="guardianDetails.guardianContactNo"
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="flex gap-3 mb-4">
                <FormControl id="bankDetails.bankName" >
                  <FormLabel>Bank Name<RequiredIndicator />  </FormLabel>
                  <Input name="bankDetails.bankName" onChange={handleChange} />
                </FormControl>
                <FormControl id="bankDetails.bankAccountNo">
                  <FormLabel>Bank Account Number<RequiredIndicator />  </FormLabel>
                  <Input
                    name="bankDetails.bankAccountNo"
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
              <div className="flex gap-3">
                <FormControl id="bankDetails.bankIfscCode">
                  <FormLabel>Bank IFSC Code <RequiredIndicator /> </FormLabel>
                  <Input
                    name="bankDetails.bankIfscCode"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="bankDetails.type">
                  <FormLabel>Bank Type <RequiredIndicator /> </FormLabel>
                  <Input name="bankDetails.type" onChange={handleChange} />
                </FormControl>
                <FormControl id="bankDetails.branch">
                  <FormLabel>Branch Name<RequiredIndicator /> </FormLabel>
                  <Input name="bankDetails.branch" onChange={handleChange} />
                </FormControl>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="flex gap-3">
                {projectData.singleFile && (
                  <div>
                    <p>Single File: {projectData.singleFile.name}</p>
                    <Button onClick={handleDeleteSingleFile}>Delete</Button>
                  </div>
                )}

                <FormControl mb="4">
                  <FormLabel>Single File</FormLabel>
                  <Input
                    type="file"
                    ref={singleFileRef}
                    onChange={handleSingleFileChange}
                  />
                </FormControl>
              </div>
              <div className="flex gap-3">
                {projectData?.multipleFiles?.map((file, index) => (
                  <div key={index}>
                    <p>
                      File {index + 1}: {file.name}
                    </p>
                    <Button onClick={() => handleDeleteMultipleFile(index)}>
                      Delete
                    </Button>
                  </div>
                ))}
                <FormControl mb="4" id="multipleFiles">
                  <FormLabel>Multiple Files</FormLabel>
                  <Input
                    type="file"
                    multiple
                    onChange={handleMultipleFilesChange}
                  />
                </FormControl>
              </div>
              <Button type="submit" colorScheme="purple" className="mt-5">
                Create Employee
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <div className="block md:hidden">
        <Tabs>
          <TabList>
            <Tab>Personal Information</Tab>
            <Tab>Other Information</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="flex flex-col gap-3 mb-3">
                <FormControl id="title" maxWidth={130}>
                  <FormLabel>Title<RequiredIndicator /> </FormLabel>
                  <Select
                    placeholder="Select Title"
                    onChange={(value) => handleSelectOption("title", value)}
                  ></Select>
                  <Select.Option name="title" value="Mr.">
                    Mr.
                  </Select.Option>
                  <Select.Option name="title" value="Mrs.">
                    Mrs.
                  </Select.Option>
                </FormControl>

                <FormControl id="employeeName">
                  <FormLabel>Employee Name<RequiredIndicator /> </FormLabel>
                  <Input name="name" onChange={handleChange} />
                </FormControl>

                <FormControl id="gender" maxWidth={150}>
                  <FormLabel>Gender<RequiredIndicator /> </FormLabel>
                  <Select
                    style={{ width: "100%" }}
                    name="gender"
                    onChange={(value) => handleSelectOption("gender", value)}
                    placeholder="Select gender"
                  >
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                    <Select.Option value="Others">Others</Select.Option>
                  </Select>
                </FormControl>

                <FormControl id="contactNo">
                  <FormLabel>Contact Number<RequiredIndicator /> </FormLabel>
                  <Input name="contactNo" onChange={handleChange} />
                </FormControl>
                <FormControl id="dob" maxWidth={150}>
                  <FormLabel>DOB<RequiredIndicator /> </FormLabel>
                  <MyDatePicker
                    selected={projectData.dob}
                    onChange={(date) =>
                      setProjectData({ ...projectData, dob: date })
                    }
                    format={"DD/MM/YYYY"}
                  />
                  {projectData?.dob?._d && <>{convertDateFormatString(projectData?.dob?._d)}</>}
                </FormControl>
              </div>
              <div className="flex gap-3 mb-3">
                <FormControl id="position" >
                  <FormLabel>Position<RequiredIndicator /> </FormLabel>
                  <Select
                    style={{ width: "100%", height: "40px" }}
                    name="position"
                    onChange={(e) => handleSelectOption("position", e)}
                    placeholder="Select Position"
                  >
                    <Select.Option value="superadmin">Superadmin</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                  </Select>
                </FormControl>

              </div>
              \
              <div className="flex flex-col gap-3 mb-3">
                <FormControl id="department" maxWidth={500} >
                  <FormLabel>Department<RequiredIndicator /></FormLabel>
                  <Input name="department" onChange={handleChange} />
                </FormControl>
                <FormControl id="email" maxWidth={350} >
                  <FormLabel>Email<RequiredIndicator /></FormLabel>
                  <Input name="email" onChange={handleChange} />
                </FormControl>
                <FormControl id="password" maxWidth={350}>
                  <FormLabel>Password<RequiredIndicator /></FormLabel>
                  <Input name="password" onChange={handleChange} />
                </FormControl>
              </div>

              <div className="flex gap-3">
                <FormControl id="joiningDate" maxWidth={300}>
                  <FormLabel>Joining Date<RequiredIndicator /></FormLabel>
                  <MyDatePicker
                    selected={projectData.joiningDate}
                    onChange={(date) =>
                      setProjectData({ ...projectData, joiningDate: date })
                    }
                    format={"DD/MM/YYYY"}
                  />
                  {projectData?.joiningDate?._d && <>{joiningDate}</>}
                </FormControl>
                <FormControl id="manager_id">
                  <FormLabel>Assigned Manager</FormLabel>
                  <select
                    onChange={handleSelectManager}
                    value={projectData.manager_id}
                  >
                    <option value="">Select Manager</option>
                    {managers.map((manager, index) => (
                      <option key={`manager-${index}`} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="flex gap-3 mb-3 flex-col md:flex-row">
                <FormControl id="permanentAddress" className="w-1/2">
                  <FormLabel>Permanent Address<RequiredIndicator /></FormLabel>
                  <Input
                    name="permanentAddress"
                    onChange={handleChange}
                    className="h-16"
                  />
                </FormControl>
                <FormControl id="correspondenceAddress" className="w-1/2">
                  <FormLabel>Correspondence Address<RequiredIndicator /></FormLabel>
                  <Input
                    name="correspondenceAddress"
                    onChange={handleChange}
                    className="h-16"
                  />
                </FormControl>
                <FormControl id="guardianDetails.relation">
                  <FormLabel>Relation<RequiredIndicator /></FormLabel>
                  <Input
                    name="guardianDetails.relation"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="guardianDetails.guardianName">
                  <FormLabel>Guardian Name<RequiredIndicator /></FormLabel>
                  <Input
                    name="guardianDetails.guardianName"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="guardianDetails.guardianContactNo">
                  <FormLabel>Guardian Contact Number<RequiredIndicator /></FormLabel>
                  <Input
                    name="guardianDetails.guardianContactNo"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="bankDetails.bankName">
                  <FormLabel>Bank Name<RequiredIndicator /></FormLabel>
                  <Input name="bankDetails.bankName" onChange={handleChange} />
                </FormControl>
                <FormControl id="bankDetails.bankAccountNo">
                  <FormLabel>Bank Account Number<RequiredIndicator /> </FormLabel>
                  <Input
                    name="bankDetails.bankAccountNo"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="bankDetails.bankIfscCode">
                  <FormLabel>Bank IFSC Code<RequiredIndicator /> </FormLabel>
                  <Input
                    name="bankDetails.bankIfscCode"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="bankDetails.type">
                  <FormLabel>Bank Type <RequiredIndicator /></FormLabel>
                  <Input name="bankDetails.type" onChange={handleChange} />
                </FormControl>
                <FormControl id="bankDetails.branch">
                  <FormLabel>Branch Name<RequiredIndicator /> </FormLabel>
                  <Input name="bankDetails.branch" onChange={handleChange} />
                </FormControl>
                <div className="flex gap-3">
                  {projectData.singleFile && (
                    <div>
                      <p>Single File: {projectData.singleFile.name}</p>
                      <Button onClick={handleDeleteSingleFile}>Delete</Button>
                    </div>
                  )}

                  <FormControl mb="4">
                    <FormLabel>Single File</FormLabel>
                    <Input
                      type="file"
                      ref={singleFileRef}
                      onChange={handleSingleFileChange}
                    />
                  </FormControl>
                </div>
                <div className="flex gap-3">
                  {projectData?.multipleFiles?.map((file, index) => (
                    <div key={index}>
                      <p>
                        File {index + 1}: {file.name}
                      </p>
                      <Button onClick={() => handleDeleteMultipleFile(index)}>
                        Delete
                      </Button>
                    </div>
                  ))}
                  <FormControl mb="4">
                    <FormLabel>Multiple Files</FormLabel>
                    <Input
                      type="file"
                      multiple
                      onChange={handleMultipleFilesChange}
                    />
                  </FormControl>
                </div>
              </div>

              <Button type="submit" colorScheme="purple" className="mt-5">
                Create Employee
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </form>
  );
};

export default Emp;