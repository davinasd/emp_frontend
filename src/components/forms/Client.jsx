import {
  FormControl,
  FormLabel,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import { Select } from "antd";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { toast } from "react-toastify";
import SelectSource from "../common/SelectSource";
import MyDatePicker from "../common/MyDatePicker";
import SelectTag from "../common/SelectTag";
import { useNavigate } from "react-router-dom";
const Client = () => {
  const singleFileRef = useRef();
  const [projectData, setProjectData] = useState({
    enquiryDate: new Date(),
    title: "",
    gender: "",
    clientBirthday: "",
    clientAnniversary: "",
    companyAnniversary: "",
    sourceInformation: "",
    workStartDate: "",
    source: [],
    companyName: "",
    clientName: "",
    brandName: "",
    phone1: "",
    phone2: "",
    email1: "",
    email2: "",
    website: "",
    businessAddress: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    requirement: "",
    additionalInformation: "",
    singleFile: null,
    multipleFiles: [],
  });
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  // const [tags, setTags] = useState([]);
  const [selectSourceValue, setSelectSourceValue] = useState([]);
  const [selectedTagValue, setSelectedTagValue] = useState([]);

  const handleSelectOption = (name, value) => {
    setProjectData({ ...projectData, [name]: value });
  };


  const RequiredIndicator = () => {
    return <Text as="span" color="red.500" ml={1}>*</Text>;
  };


  useEffect(() => {
    setProjectData((prev) => ({
      ...prev,
      source: selectSourceValue,
      requirement: selectedTagValue,
    }));
  }, [selectSourceValue, selectedTagValue]);

  // const removeTagById = (tagToRemove) => {
  //   setProjectData({
  //     ...projectData,
  //     source: projectData.source.filter((tag) => tag !== tagToRemove),
  //   });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };
  // const getTagNameById = (id) => {
  //   const tag = tags.find((tag) => tag.source_tag_id === id);
  //   return tag ? tag.sourceTagName : "Unknown Tag";
  // };

  // const handleTagChange = (e) => {
  //   const selectedTags = Array.from(
  //     e.target.selectedOptions,
  //     (option) => option.value
  //   );

  //   const selectedTagNames = selectedTags.map((tagId) => getTagNameById(tagId));
  //   console.log(selectedTagNames);

  //   setProjectData({
  //     ...projectData,
  //     source: [...projectData.source, ...selectedTagNames],
  //   });
  // };
  const handleSelectChange = (setSelected, name, value) => {
    setSelected(value);
    setProjectData({ ...projectData, [name]: value });
  };
  const handleSingleFileChange = (e) => {
    setProjectData({ ...projectData, singleFile: e.target.files[0] });
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
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

  const handleSubmit = (e) => {
    console.log(projectData);
    e.preventDefault();

    const formData = new FormData();

    Object.entries(projectData).forEach(([key, value]) => {
      if (key === "source" && Array.isArray(value)) {
        value.forEach((sourceItem, index) => {
          formData.append(`${key}[${index}]`, sourceItem);
        });
      } else if (key === "requirement" && Array.isArray(value)) {
        value.forEach((sourceItem, index) => {
          formData.append(`${key}[${index}]`, sourceItem);
        });
      } else if (key === "multipleFiles" && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          formData.append("multipleFiles", value[i]);
        }
      } else if (value !== "" && value !== null) {
        formData.append(key, value);
      }
    });

    const requiredFields = [
      { key: 'brandName', label: 'Brand Name' },
      { key: 'gender', label: 'Gender' },
      { key: 'title', label: 'Title' },
      { key: 'enquiryDate', label: 'Enquiry Date' },
      { key: 'source', label: 'Source', isArray: true },
      { key: 'clientName', label: 'Client Name' },
      { key: 'companyName', label: 'Company Name' },
      { key: 'phone1', label: 'Phone 1' }
    ];

    for (let { key, label, isArray } of requiredFields) {
      if (isArray ? !projectData[key] || projectData[key].length === 0 : !projectData[key]) {
        toast.error(`${label} is required.`);
        return;
      }
    }
    console.log(formData.brandName
    );
    axios
      .post(
        `${import.meta.env.VITE_API_BASE}/api/admin/createClient`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message, {
            autoClose: 2000,
          });
          setProjectData({
            enquiryDate: new Date(),
            title: "",
            gender: "",
            clientBirthday: "",
            clientAnniversary: "",
            companyAnniversary: "",
            sourceInformation: "",
            workStartDate: "",
            source: [],
            companyName: "",
            clientName: "",
            brandName: "",
            phone1: "",
            phone2: "",
            email1: "",
            email2: "",
            website: "",
            businessAddress: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            requirement: "",
            additionalInformation: "",
            singleFile: null,
            multipleFiles: [],
          });
          setTimeout(() => {
            navigate("/getAllClient");
          }, 2000);
        } else {
          toast.success(response.data.message, {
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.response.data.message);
      });
  };
  const formatDate = (date) => {
    if (!date) return ""; // Handle the case where date is null or undefined
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.toLocaleString("default", { month: "short" });
    const year = formattedDate.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <FormControl id="enquiryDate" >
                <FormLabel>Enquiry Date</FormLabel>
                <MyDatePicker
                    selected={projectData.enquiryDate}
                    onChange={(date) =>
                        setProjectData({ ...projectData, enquiryDate: date })
                    }
                    defaultValue={moment()}
                    format={"DD/MM/YYYY"}
                />
            </FormControl>
                */}
      <div className="hidden md:block">
        <Tabs>
          <TabList>
            <Tab>Client Information</Tab>
            <Tab>Address Information</Tab>
            <Tab>Personal Information</Tab>
            <Tab>Additional Information</Tab>
            <Tab>Files Information</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="flex gap-2 items-center mb-4">
                <FormControl id="workStartDate" maxWidth={150}>
                  <FormLabel>Work Start Date</FormLabel>
                  <MyDatePicker
                    className="h-[40px]"
                    selected={projectData.workStartDate}
                    onChange={(date) =>
                      setProjectData({ ...projectData, workStartDate: date })
                    }
                    format={"DD/MM/YYYY"}
                  />
                </FormControl>
                <div className="mt-[28px]">{formatDate(projectData.workStartDate)}</div>
              </div>

              <div className="flex gap-3 mb-4">
                <FormControl id="title" maxWidth={130}>
                  <FormLabel>
                    Title <RequiredIndicator />
                  </FormLabel>
                  <Select
                    style={{ width: "100%", height: "40px" }}
                    placeholder="Select Title"
                    onChange={(value) => handleSelectOption("title", value)}
                  >
                    <Select.Option value="Mr.">Mr.</Select.Option>
                    <Select.Option value="Mrs.">Mrs.</Select.Option>
                  </Select>
                </FormControl>
                <FormControl id="clientName">
                  <FormLabel>
                    Client Name
                    <RequiredIndicator />
                  </FormLabel>
                  <Input name="clientName" onChange={handleChange} />
                </FormControl>

                <FormControl id="gender" mr={3} maxWidth={100}>
                  <FormLabel>
                    Gender <RequiredIndicator />
                  </FormLabel>
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
              </div>
              <div className="flex gap-3 mb-4">
                <FormControl id="brandName">
                  <FormLabel>
                    Brand Name <RequiredIndicator />{" "}
                  </FormLabel>
                  <Input name="brandName" onChange={handleChange} />
                </FormControl>
                <FormControl id="companyName">
                  <FormLabel>
                    Company Name <RequiredIndicator />
                  </FormLabel>
                  <Input name="companyName" onChange={handleChange} />
                </FormControl>
              </div>
              <div className="flex gap-3 mb-4">
                <FormControl id="tags" maxWidth={250}>
                  <FormLabel>
                    Source <RequiredIndicator />{" "}
                  </FormLabel>
                  <Flex>
                    <SelectSource
                      selectSourceValue={selectSourceValue}
                      setSelectSourceValue={setSelectSourceValue}
                    />
                  </Flex>
                </FormControl>
                <FormControl id="sourceInformation">
                  <FormLabel>Source Information</FormLabel>
                  <Input name="sourceInformation" onChange={handleChange} />
                </FormControl>
              </div>

              <div className="flex gap-3 mb-4">
                <FormControl id="phone1">
                  <FormLabel>
                    Phone Number 1 <RequiredIndicator />{" "}
                  </FormLabel>
                  <Input name="phone1" onChange={handleChange} />
                </FormControl>

                <FormControl id="phone2">
                  <FormLabel>Phone Number 2</FormLabel>
                  <Input name="phone2" onChange={handleChange} />
                </FormControl>
                <FormControl id="website">
                  <FormLabel>Website</FormLabel>
                  <Input name="website" onChange={handleChange} />
                </FormControl>
              </div>

              <div className="flex gap-3 mb-3">
                <FormControl id="email1">
                  <FormLabel>Email 1</FormLabel>
                  <Input name="email1" onChange={handleChange} />
                </FormControl>
                <FormControl id="email2">
                  <FormLabel>Email 2</FormLabel>
                  <Input name="email2" onChange={handleChange} />
                </FormControl>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="flex gap-3 mb-4 flex-col md:flex-row">
                <FormControl id="country">
                  <FormLabel>Country</FormLabel>
                  <CountryDropdown
                    name="country"
                    value={selectedCountry}
                    onChange={(e) =>
                      handleSelectChange(setSelectedCountry, "country", e)
                    }
                    className="border-[0.375px] rounded-md max-w-[200px] h-[40px]"
                  />
                </FormControl>
                <FormControl id="state">
                  <FormLabel>State</FormLabel>
                  <RegionDropdown
                    country={selectedCountry}
                    name="state"
                    value={selectedState}
                    onChange={(e) =>
                      handleSelectChange(setSelectedState, "state", e)
                    }
                    className="border-[0.375px] rounded-md h-[40px] max-w-24"
                  />
                </FormControl>
                <FormControl id="city">
                  <FormLabel>City</FormLabel>
                  <Input
                    name="city"
                    onChange={handleChange}
                    value={projectData.city}
                  />
                </FormControl>
                <FormControl id="pincode">
                  <FormLabel>Pincode</FormLabel>
                  <Input
                    name="pincode"
                    onChange={handleChange}
                    value={projectData.pincode}
                  />
                </FormControl>
              </div>
              <FormControl id="businessAddress" className="w-1/2">
                <FormLabel>Business Address</FormLabel>
                <Input
                  name="businessAddress"
                  onChange={handleChange}
                  h="5rem"
                  value={projectData.businessAddress}
                />
              </FormControl>
              <Button type="submit" colorScheme="purple" className="mt-5">
                Create Client
              </Button>
            </TabPanel>

            <TabPanel>
              <div className="flex gap-3">
                <FormControl id="clientBirthday">
                  <FormLabel>Client Birthday</FormLabel>
                  <div className="flex gap-2 items-center">
                    <MyDatePicker
                      className="h-[40px]"
                      selected={projectData.clientBirthday}
                      onChange={(date) =>
                        setProjectData({ ...projectData, clientBirthday: date })
                      }
                      format={"DD/MM/YYYY"}
                    />
                    <div>{formatDate(projectData.clientBirthday)}</div>
                  </div>
                </FormControl>

                <FormControl id="clientAnniversary">
                  <FormLabel>Client Anniversary</FormLabel>
                  <div className="flex gap-2 items-center">
                    <MyDatePicker
                      className="h-[40px]"
                      selected={projectData.clientAnniversary}
                      onChange={(date) =>
                        setProjectData({
                          ...projectData,
                          clientAnniversary: date,
                        })
                      }
                      format={"DD/MM/YYYY"}
                    />
                    <div>{formatDate(projectData.clientAnniversary)}</div>
                  </div>
                </FormControl>
                <FormControl id="companyAnniversary">
                  <FormLabel>Company Anniversary</FormLabel>
                  <div className="flex gap-2 items-center">
                    <MyDatePicker
                      className="h-[40px]"
                      selected={projectData.companyAnniversary}
                      onChange={(date) =>
                        setProjectData({
                          ...projectData,
                          companyAnniversary: date,
                        })
                      }
                      format={"DD/MM/YYYY"}
                    />
                    <div>{formatDate(projectData.companyAnniversary)}</div>
                  </div>
                </FormControl>
              </div>
              <Button type="submit" colorScheme="purple" className="mt-5">
                Create Client
              </Button>
            </TabPanel>
            <TabPanel>
              <div className="flex flex-col gap-3">
                <FormControl id="requirement" className="w-1/2">
                  <FormLabel>Requirement</FormLabel>
                  {/* <Input
                                        name="requirement"
                                        onChange={handleChange}
                                        className="h-16"
                                    /> */}
                  <SelectTag
                    selectTagValue={selectedTagValue}
                    setSelectTagValue={setSelectedTagValue}
                  />
                </FormControl>
                <FormControl id="additionalInformation" className="w-1/2">
                  <FormLabel>Additional Information</FormLabel>
                  <Input
                    name="additionalInformation"
                    onChange={handleChange}
                    h="5rem"
                    value={projectData.additionalInformation}
                  />
                </FormControl>
              </div>
              <Button type="submit" colorScheme="purple" className="mt-5">
                Create Client
              </Button>
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
                {projectData.multipleFiles.map((file, index) => (
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
              <Button type="submit" colorScheme="purple" className="mt-5">
                Create Client
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
              <div className="flex gap-2">
                <FormControl id="companyAnniversary" maxWidth={150}>
                  <FormLabel>Work Start Date</FormLabel>
                  <MyDatePicker
                    className="h-[40px]"
                    selected={projectData.workStartDate}
                    onChange={(date) =>
                      setProjectData({ ...projectData, workStartDate: date })
                    }
                    format={"DD/MM/YYYY"}
                  />
                </FormControl>
              </div>
              <div>{formatDate(projectData.workStartDate)}</div>
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex gap-3 mb-2">
                  <FormControl id="title" maxWidth={130}>
                    <FormLabel>
                      Title <RequiredIndicator />
                    </FormLabel>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select Title"
                      onChange={(value) => handleSelectOption("title", value)}
                    >
                      <Select.Option value="Mr.">Mr.</Select.Option>
                      <Select.Option value="Mrs.">Mrs.</Select.Option>
                    </Select>
                  </FormControl>
                  <FormControl id="clientName">
                    <FormLabel>
                      Client Name <RequiredIndicator />
                    </FormLabel>
                    <Input name="clientName" onChange={handleChange} />
                  </FormControl>
                </div>

                <FormControl id="brandName" mb={3}>
                  <FormLabel>
                    Brand Name <RequiredIndicator />{" "}
                  </FormLabel>
                  <Input name="brandName" onChange={handleChange} />
                </FormControl>
                <FormControl id="companyName" mb={3}>
                  <FormLabel>
                    Company Name <RequiredIndicator />{" "}
                  </FormLabel>
                  <Input name="companyName" onChange={handleChange} />
                </FormControl>

                <FormControl id="phone1">
                  <FormLabel>
                    Phone Number 1 <RequiredIndicator />{" "}
                  </FormLabel>
                  <Input name="phone1" onChange={handleChange} />
                </FormControl>
                <FormControl id="phone2">
                  <FormLabel>Phone Number 2</FormLabel>
                  <Input name="phone2" onChange={handleChange} />
                </FormControl>
              </div>
              <FormControl id="tags" maxWidth={250} mr={3}>
                <FormLabel>
                  Source <RequiredIndicator />{" "}
                </FormLabel>
                <Flex>
                  <SelectSource
                    selectSourceValue={selectSourceValue}
                    setSelectSourceValue={setSelectSourceValue}
                  />
                </Flex>
              </FormControl>

              <FormControl id="sourceInformation">
                <FormLabel>Source Information</FormLabel>
                <Input name="sourceInformation" onChange={handleChange} />
              </FormControl>
              <FormControl id="gender" maxWidth={100} mr={3}>
                <FormLabel>
                  Gender <RequiredIndicator />{" "}
                </FormLabel>
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

              <div className="flex flex-col gap-3">
                <FormControl id="email1">
                  <FormLabel>Email 1</FormLabel>
                  <Input name="email1" onChange={handleChange} />
                </FormControl>
                <FormControl id="email2">
                  <FormLabel>Email 2</FormLabel>
                  <Input name="email2" onChange={handleChange} />
                </FormControl>
                <FormControl id="website">
                  <FormLabel>Website</FormLabel>
                  <Input name="website" onChange={handleChange} />
                </FormControl>
              </div>
              <Button type="submit" colorScheme="purple" className="mt-5">
                Create Client
              </Button>
            </TabPanel>
            <TabPanel>
              <div className="flex gap-3 mb-3 flex-col md:flex-row">
                <FormControl id="country">
                  <FormLabel>Country</FormLabel>
                  <CountryDropdown
                    name="country"
                    value={selectedCountry}
                    onChange={(e) =>
                      handleSelectChange(setSelectedCountry, "country", e)
                    }
                    className="border-[0.375px] rounded-md max-w-[200px] h-[2rem]"
                  />
                </FormControl>
                <FormControl id="state">
                  <FormLabel>State</FormLabel>
                  <RegionDropdown
                    country={selectedCountry}
                    name="state"
                    value={selectedState}
                    onChange={(e) =>
                      handleSelectChange(setSelectedState, "state", e)
                    }
                    className="border-[0.375px] rounded-md h-[2rem] max-w-24"
                  />
                </FormControl>
                <FormControl id="city">
                  <FormLabel>City</FormLabel>
                  <Input name="city" onChange={handleChange} />
                </FormControl>
                <FormControl id="pincode">
                  <FormLabel>Pincode</FormLabel>
                  <Input name="pincode" onChange={handleChange} />
                </FormControl>
              </div>
              <FormControl id="businessAddress" className="w-1/2">
                <FormLabel>Business Address</FormLabel>
                <Input
                  name="businessAddress"
                  onChange={handleChange}
                  h="5rem"
                />
              </FormControl>
              <div className="flex flex-col mt-3 gap-3">
                <FormControl id="gst" mb={3}>
                  <FormLabel>GST</FormLabel>
                  <Input name="gst" onChange={handleChange} />
                </FormControl>
              </div>
              <FormControl id="billingAddress" className="w-1/2">
                <FormLabel>Billing Address</FormLabel>
                <Input name="billingAddress" onChange={handleChange} h="5rem" />
              </FormControl>
              <div className="flex flex-col mt-3 gap-3">
                <FormControl id="requirement" className="w-1/2">
                  <FormLabel>Requirement</FormLabel>
                  <SelectTag
                    selectTagValue={selectedTagValue}
                    setSelectTagValue={setSelectedTagValue}
                  />
                </FormControl>
                <FormControl id="additionalInformation" className="w-1/2">
                  <FormLabel>Additional Information</FormLabel>
                  <Input
                    name="additionalInformation"
                    onChange={handleChange}
                    h="5rem"
                  />
                </FormControl>
              </div>
              <div className="flex gap-3">
                <FormControl id="clientBirthday">
                  <FormLabel>Client Birthday</FormLabel>
                  <MyDatePicker
                    className="h-[40px]"
                    selected={projectData.clientBirthday}
                    onChange={(date) =>
                      setProjectData({ ...projectData, clientBirthday: date })
                    }
                    format={"DD/MM/YYYY"}
                  />
                  <div>{formatDate(projectData.clientBirthday)}</div>
                </FormControl>

                <FormControl id="clientAnniversary">
                  <FormLabel>Client Anniversary</FormLabel>
                  <MyDatePicker
                    className="h-[40px]"
                    selected={projectData.clientAnniversary}
                    onChange={(date) =>
                      setProjectData({
                        ...projectData,
                        clientAnniversary: date,
                      })
                    }
                    format={"DD/MM/YYYY"}
                  />
                  <div>{formatDate(projectData.clientAnniversary)}</div>
                </FormControl>
                <FormControl id="companyAnniversary">
                  <FormLabel>Company Anniversary</FormLabel>
                  <MyDatePicker
                    selected={projectData.companyAnniversary}
                    onChange={(date) =>
                      setProjectData({
                        ...projectData,
                        companyAnniversary: date,
                      })
                    }
                    format={"DD/MM/YYYY"}
                  />
                  <div>{formatDate(projectData.companyAnniversary)}</div>
                </FormControl>
              </div>
              <div className="flex mt-3 gap-3">
                {projectData.singleFile && (
                  <div>
                    <p>Single File: {projectData.singleFile.name}</p>
                    <Button onClick={handleDeleteSingleFile}>Delete</Button>
                  </div>
                )}
                <FormControl mb="4">
                  <FormLabel>Single File</FormLabel>
                  <Input type="file" onChange={handleSingleFileChange} />
                </FormControl>
              </div>
              <div className="flex gap-3">
                {/* Display multiple files */}
                {projectData.multipleFiles &&
                  projectData.multipleFiles.map((file, index) => (
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
              <Button type="submit" colorScheme="purple" className="mt-5">
                Create Client
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </form>
  );
};

export default Client;