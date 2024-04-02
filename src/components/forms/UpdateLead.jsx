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
  Box,
} from "@chakra-ui/react";
import { Select } from "antd";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { toast } from "react-toastify";
import SelectSource from "../common/SelectSource";
import MyDatePicker from "../common/MyDatePicker";
import SelectTag from "../common/SelectTag";
import { useSelector } from "react-redux";
import { selectLeadId, clearLeadId } from "../../store/slice/LeadSlice";
import moment from "moment";
import { convertDateFormatString } from "../../helpers";
import { useNavigate } from "react-router-dom";

const UpdateLead = () => {
  const singleFileRef = useRef();
  const multipleFileRef = useRef();
  const leadId = useSelector(selectLeadId);
  console.log(leadId);
  const navigate = useNavigate();
  const [client, setClient] = useState("");
  const [projectData, setProjectData] = useState({
    title: "",
    gender: "",
    companyName: "",
    enquiryDate: new Date(),
    source: [],
    sourceInformation: "",
    brandName: "",
    clientName: "",
    phone1: "",
    phone2: "",
    email1: "",
    email2: "",
    website: "",
    gstNo: "",
    businessAddress: "",
    billingAddress: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    requirement: "",
    additionalInformation: "",
    status: "",
    singleFile: null,
    multipleFiles: [],
    singleFileView: null,
    multipleFilesView: [],
    singleFileToRemove: null,
    multipleFilesToRemove: [],
  });
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getLeadDetails/${leadId}`
      )
      .then((response) => {
        const clientData = response.data;
        setClient(response.data);
        setProjectData((projectData) => ({
          ...projectData,
          enquiryDate: clientData?.enquiryDate || projectData.enquiryDate,
          title: clientData?.title || projectData.title,
          gender: clientData?.gender || projectData.gender,
          source: clientData?.source || projectData.source,
          sourceInformation: clientData?.sourceInformation || projectData.sourceInformation,
          companyName: clientData?.companyName || projectData.companyName,
          clientName: clientData?.clientName || projectData.clientName,
          brandName: clientData?.brandName || projectData.brandName,
          phone1: clientData?.phone1 || projectData.phone1,
          phone2: clientData?.phone2 || projectData.phone2,
          email1: clientData?.email1 || projectData.email1,
          email2: clientData?.email2 || projectData.email2,
          website: clientData?.website || projectData.website,
          gstNo: clientData?.gstNo || projectData.gstNo,
          businessAddress: clientData?.businessAddress || projectData.businessAddress,
          billingAddress: clientData?.billingAddress || projectData.billingAddress,
          city: clientData?.city || projectData.city,
          state: clientData?.state || projectData.state,
          pincode: clientData?.pincode || projectData.pincode,
          country: clientData?.country || projectData.country,
          requirement: clientData?.requirement || projectData.requirement,
          additionalInformation:
            clientData?.additionalInformation || projectData.additionalInformation,
          status: clientData?.status || projectData.status,
          singleFileView: clientData?.singleFile || projectData.singleFileView,
          multipleFilesView:
            clientData?.multipleFiles || projectData.multipleFilesView,
          singleFile: null,
          multipleFiles: [],
        }));

        setSelectedCountry(clientData.country);
        setSelectedState(clientData.state);
        setSelectSourceValue(clientData.source);
        setSelectedTagValue(clientData.requirement);
      })

      .catch((error) => {
        console.error("Error fetching client details:", error);
        toast.error("Failed to fetch client details");
      });
  }, [leadId]);

  const enquiryDate = projectData.enquiryDate ? moment(projectData.enquiryDate, 'DD-MM-YY') : null;

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [tags, setTags] = useState([]);
  const [selectSourceValue, setSelectSourceValue] = useState([]);
  const [selectedTagValue, setSelectedTagValue] = useState([]);

  const handleSelectOption = (name, value) => {
    setProjectData({ ...projectData, [name]: value });
  };
  useEffect(() => {
    setProjectData((prev) => ({
      ...prev,
      source: selectSourceValue,
      requirement: selectedTagValue,
    }));
  }, [selectSourceValue, selectedTagValue]);

  const removeTagById = (tagToRemove) => {
    setProjectData({
      ...projectData,
      source: projectData.source.filter((tag) => tag !== tagToRemove),
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };
  const getTagNameById = (id) => {
    const tag = tags.find((tag) => tag.source_tag_id === id);
    return tag ? tag.sourceTagName : "Unknown Tag";
  };

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
  const handleSelectChange = (setSelected, name) => (value) => {
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
    singleFileRef.current.value = "";
    const { singleFile, ...newData } = projectData;
    setProjectData({ ...newData });
  };

  const handleAddSingleFileToRemove = (filename) => {
    projectData.singleFileToRemove = filename;
    projectData.singleFileView = null;
    setProjectData({ ...projectData });
  };
  const handleAddMultipleFilesToRemove = (filename) => {
    const updatedMultipleFilesView = projectData.multipleFilesView.filter(
      (file) => file !== filename
    );

    const updatedMultipleFilesToRemove = [...projectData.multipleFilesToRemove, filename];
    if (!updatedMultipleFilesToRemove.includes(filename)) {
      updatedMultipleFilesToRemove.push(filename);
    }

    setProjectData({
      ...projectData,
      multipleFilesToRemove: updatedMultipleFilesToRemove,
      multipleFilesView: updatedMultipleFilesView,
    });
  };


  const handleDeleteMultipleFile = (index) => {
    multipleFileRef.current.value = "";
    const updatedFiles = [...projectData.multipleFiles];
    updatedFiles.splice(index, 1);
    setProjectData({ ...projectData, multipleFiles: updatedFiles });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    delete projectData.singleFileView;
    delete projectData.multipleFilesView;
    const formData = new FormData();
    Object.entries(projectData).forEach(([key, value]) => {
      if (key === "source" && Array.isArray(value)) {
        value.forEach((sourceItem, index) => {
          formData.append(`${key}[${index}]`, sourceItem);
        });
      } else if (key === "multipleFiles" && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          formData.append('multipleFiles', value[i]);
        }
      } else if (key === "multipleFilesToRemove" && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          formData.append('multipleFilesToRemove', value[i]);
        }
      }

      else if (key === "requirement" && Array.isArray(value)) {
        value.forEach((sourceItem, index) => {
          formData.append(`${key}[${index}]`, sourceItem);
        });
      } else if (value !== "" && value !== undefined) {
        formData.append(key, value);
      }
    });
    console.log(formData)
    axios
      .patch(
        `${import.meta.env.VITE_API_BASE}/api/admin/updateLead/${leadId}`,
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
          setTimeout(() => {
            navigate("/manageLeads");
          }, 2000);
        } else {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.response.data.message);
      });
  };


  return (
    <>
      {" "}
      <Box
        mx="auto"
        borderWidth="1px"
        borderRadius="lg"
        p="4"
        boxShadow="lg"
        m="4"
      >
        <h1 className="text-md font-semibold">Update Lead</h1>
        <h1 className="text-2xl font-semibold mb-3">{client.clientName}</h1>

        <form onSubmit={handleSubmit}>
          <FormControl id="enquiryDate">
            <FormLabel>Enquiry Date</FormLabel>
            <MyDatePicker
              className="mb-1"
              selected={projectData.enquiryDate}
              onChange={(date) =>
                setProjectData({ ...projectData, enquiryDate: date })
              }
              value={enquiryDate}
              format={"DD/MM/YYYY"}
            />
            <br />

            {projectData.enquiryDate && (
              <p>{convertDateFormatString(enquiryDate)}</p>
            )}
          </FormControl>
          <div className="hidden md:block">
            <Tabs>
              <TabList>
                <Tab>Personal Information</Tab>
                <Tab>Address Information</Tab>
                <Tab>Billing Information</Tab>
                <Tab>Additional Information</Tab>
                <Tab>Files Information</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <div className="flex gap-4 mb-3">
                    <FormControl id="title" maxWidth={130}>
                      <FormLabel>Title</FormLabel>
                      <Select
                        placeholder="Select Title"
                        onChange={(value) => handleSelectOption("title", value)}
                        value={projectData.title}
                      >
                        <Select.Option value="Mr.">Mr.</Select.Option>
                        <Select.Option value="Mrs.">Mrs.</Select.Option>
                      </Select>
                    </FormControl>
                    <FormControl id="clientName">
                      <FormLabel>Client Name</FormLabel>
                      <Input
                        name="clientName"
                        onChange={handleChange}
                        value={projectData.clientName}
                      />
                    </FormControl>
                    <FormControl id="tags">
                      <FormLabel>Source</FormLabel>
                      <Flex>
                        <SelectSource
                          selectSourceValue={selectSourceValue}
                          setSelectSourceValue={setSelectSourceValue}
                        />
                      </Flex>
                    </FormControl>
                    <FormControl id="clientName">
                      <FormLabel>Source Information</FormLabel>
                      <Input
                        name="sourceInformation"
                        onChange={handleChange}
                        value={projectData.sourceInformation}
                      />
                    </FormControl>

                    <FormControl id="gender" maxWidth={150}>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        name="gender"
                        onChange={(value) =>
                          handleSelectOption("gender", value)
                        }
                        placeholder="Select gender"
                        value={projectData.gender}
                      >
                        <Select.Option value="Male">Male</Select.Option>
                        <Select.Option value="Female">Female</Select.Option>
                        <Select.Option value="Others">Others</Select.Option>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex gap-4 mb-3">
                    <FormControl id="phone1">
                      <FormLabel>Phone Number 1</FormLabel>
                      <Input
                        name="phone1"
                        onChange={handleChange}
                        value={projectData.phone1}
                      />
                    </FormControl>
                    <FormControl id="phone2">
                      <FormLabel>Phone Number 2</FormLabel>
                      <Input
                        name="phone2"
                        onChange={handleChange}
                        value={projectData.phone2}
                      />
                    </FormControl>
                    <FormControl id="website">
                      <FormLabel>Website</FormLabel>
                      <Input
                        name="website"
                        onChange={handleChange}
                        value={projectData.website}
                      />
                    </FormControl>
                  </div>

                  <div className="flex gap-3">
                    <FormControl id="email1">
                      <FormLabel>Email 1</FormLabel>
                      <Input
                        name="email1"
                        onChange={handleChange}
                        value={projectData.email1}
                      />
                    </FormControl>
                    <FormControl id="email2">
                      <FormLabel>Email 2</FormLabel>
                      <Input
                        name="email2"
                        onChange={handleChange}
                        value={projectData.email2}
                      />
                    </FormControl>
                  </div>
                  <Button type="submit" colorScheme="purple" className="mt-5">
                    Update Lead
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
                      h='5rem'
                      value={projectData.businessAddress}
                    />
                  </FormControl>
                  <Button type="submit" colorScheme="purple" className="mt-5">
                    Update Lead
                  </Button>
                </TabPanel>

                <TabPanel>
                  <div className="flex gap-3">
                    <FormControl id="brandName" mb={3}>
                      <FormLabel>Brand Name</FormLabel>
                      <Input
                        name="brandName"
                        onChange={handleChange}
                        value={projectData.brandName}
                      />
                    </FormControl>
                    <FormControl id="companyName" mb={3}>
                      <FormLabel>Company Name</FormLabel>
                      <Input
                        name="companyName"
                        onChange={handleChange}
                        value={projectData.companyName}
                      />
                    </FormControl>
                    <FormControl id="gst" mb={3}>
                      <FormLabel>GST</FormLabel>
                      <Input
                        name="gstNo"
                        onChange={handleChange}
                        value={projectData.gstNo}
                      />
                    </FormControl>
                  </div>
                  <FormControl id="billingAddress" className="w-1/2">
                    <FormLabel>Billing Address</FormLabel>
                    <Input
                      name="billingAddress"
                      onChange={handleChange}
                      value={projectData.billingAddress}
                      h='5rem'

                    />
                  </FormControl>
                  <Button type="submit" colorScheme="purple" className="mt-5">
                    Update Lead
                  </Button>
                </TabPanel>
                <TabPanel>
                  <FormControl id="requirement" maxWidth={300}>
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
                  <FormControl id="additionalInformation">
                    <FormLabel>Additional Information</FormLabel>
                    <Input
                      name="additionalInformation"
                      onChange={handleChange}
                      className="h-16"
                      value={projectData.additionalInformation}
                      h="5rem"
                    />
                  </FormControl>
                  <Button type="submit" colorScheme="purple" className="mt-5">
                    Update Lead
                  </Button>
                </TabPanel>
                <TabPanel>
                  <div>
                    <div>
                      <h2 className="font-semibold text-lg">Existing Files</h2>
                      <div className="flex gap-3">
                        {projectData.singleFileView && (
                          <div>
                            <div className="flex gap-1">
                              <p>File : {projectData.singleFileView}</p>
                              <Button
                                as="a"
                                href={`${import.meta.env.VITE_API_BASE
                                  }/uploads/${projectData.singleFileView}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                textDecoration="none"
                                _hover={{ textDecoration: "none" }}
                                display="inline-block"
                                variant="solid"
                              >
                                View
                              </Button>
                              <Button
                                onClick={() => {
                                  handleAddSingleFileToRemove(
                                    projectData.singleFileView
                                  );
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {projectData.multipleFilesView.map((file, index) => (
                          <div key={index}>
                            <p>
                              File {index + 1}: {file}
                            </p>
                            <div className="flex gap-1">
                              <Button
                                as="a"
                                href={`${import.meta.env.VITE_API_BASE
                                  }/uploads/${file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                textDecoration="none"
                                _hover={{ textDecoration: "none" }}
                                display="inline-block"
                                mr={2}
                                mb={2}
                                variant="solid"
                              >
                                View
                              </Button>
                              <Button
                                onClick={() => {
                                  handleAddMultipleFilesToRemove(file);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col gap-3 mb-2">
                        <div className="flex gap-3">
                          <FormControl>
                            <FormLabel>Single File</FormLabel>
                            <Input
                              type="file"
                              ref={singleFileRef}
                              onChange={handleSingleFileChange}
                            />
                          </FormControl>
                        </div>
                        {/* Display single file */}
                        {projectData.singleFile && (
                          <div className="mb-4 bg-gray-200 rounded-md p-2">
                            <h2 className="font-semibold text-lg">New files</h2>
                            <div className="flex items-center gap-2">
                              <p>{projectData.singleFile.name}</p>
                              <Button onClick={handleDeleteSingleFile} size={"sm"}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 mb-2">
                        <FormControl>
                          <FormLabel>Multiple Files</FormLabel>
                          <Input
                            type="file"
                            multiple
                            ref={multipleFileRef}
                            onChange={handleMultipleFilesChange}
                          />
                        </FormControl>
                        {/* Display multiple files */}
                        {projectData.multipleFiles.map((file, index) => (
                          <div key={index} className="mb-4 bg-gray-200 rounded-md p-2">
                            <h2 className="font-semibold text-lg">New files</h2>
                            <div className="flex items-center gap-2">
                              <p>
                                File {index + 1}: {file.name}
                              </p>
                              <Button
                                onClick={() => handleDeleteMultipleFile(index)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" colorScheme="purple" className="mt-5">
                      Update Lead
                    </Button>
                  </div>
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
                  <div className="flex gap-2 mb-3">
                    <FormControl id="title" maxWidth={130}>
                      <FormLabel>Title</FormLabel>
                      <Select
                        placeholder="Select Title"
                        onChange={(value) => handleSelectOption("title", value)}
                        value={projectData.title}
                      >
                        <Select.Option value="Mr.">Mr.</Select.Option>
                        <Select.Option value="Mrs.">Mrs.</Select.Option>
                      </Select>
                    </FormControl>
                    <FormControl id="clientName">
                      <FormLabel>Client Name</FormLabel>
                      <Input
                        name="clientName"
                        onChange={handleChange}
                        value={projectData.clientName}
                      />
                    </FormControl>
                  </div>
                  <FormControl id="gender">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      name="gender"
                      onChange={(value) => handleSelectOption("gender", value)}
                      placeholder="Select gender"
                      value={projectData.gender}
                    >
                      <Select.Option value="Male">Male</Select.Option>
                      <Select.Option value="Female">Female</Select.Option>
                      <Select.Option value="Others">Others</Select.Option>
                    </Select>
                  </FormControl>
                  <div className="flex flex-col gap-3 mb-3">
                    <FormControl id="phone1">
                      <FormLabel>Phone Number 1</FormLabel>
                      <Input
                        name="phone1"
                        onChange={handleChange}
                        value={projectData.phone1}
                      />
                    </FormControl>
                    <FormControl id="phone2">
                      <FormLabel>Phone Number 2</FormLabel>
                      <Input
                        name="phone2"
                        onChange={handleChange}
                        value={projectData.phone2}
                      />
                    </FormControl>
                    <FormControl id="website">
                      <FormLabel>Website</FormLabel>
                      <Input
                        name="website"
                        onChange={handleChange}
                        value={projectData.website}
                      />
                    </FormControl>
                  </div>

                  <div className="flex flex-col gap-3">
                    <FormControl id="tags">
                      <FormLabel>Source</FormLabel>
                      <Flex>
                        <SelectSource
                          selectSourceValue={selectSourceValue}
                          setSelectSourceValue={setSelectSourceValue}
                        />
                      </Flex>
                    </FormControl>
                    <FormControl id="clientName">
                      <FormLabel>Source Information</FormLabel>
                      <Input name="sourceInformation" onChange={handleChange} />
                    </FormControl>
                    <FormControl id="email1">
                      <FormLabel>Email 1</FormLabel>
                      <Input
                        name="email1"
                        onChange={handleChange}
                        value={projectData.email1}
                      />
                    </FormControl>
                    <FormControl id="email2">
                      <FormLabel>Email 2</FormLabel>
                      <Input
                        name="email2"
                        onChange={handleChange}
                        value={projectData.email2}
                      />
                    </FormControl>
                    <FormControl id="website">
                      <FormLabel>Website</FormLabel>
                      <Input
                        name="website"
                        onChange={handleChange}
                        value={projectData.website}
                      />
                    </FormControl>
                  </div>
                  <Button type="submit" colorScheme="purple" className="mt-5">
                    Update Lead
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
                  <div className="flex flex-col mt-3 gap-3">
                    <FormControl id="brandName" mb={3}>
                      <FormLabel>Brand Name</FormLabel>
                      <Input
                        name="brandName"
                        onChange={handleChange}
                        value={projectData.brandName}
                      />
                    </FormControl>
                    <FormControl id="companyName" mb={3}>
                      <FormLabel>Company Name</FormLabel>
                      <Input
                        name="companyName"
                        onChange={handleChange}
                        value={projectData.companyName}
                      />
                    </FormControl>
                    <FormControl id="gst" mb={3}>
                      <FormLabel>GST</FormLabel>
                      <Input
                        name="gstNo"
                        onChange={handleChange}
                        value={projectData.gstNo}
                      />
                    </FormControl>
                  </div>
                  <FormControl id="billingAddress" className="w-1/2">
                    <FormLabel>Billing Address</FormLabel>
                    <Input
                      name="billingAddress"
                      onChange={handleChange}
                      h='5rem'
                      value={projectData.billingAddress}
                    />
                  </FormControl>
                  <div className="flex flex-col mt-3 gap-3">
                    <FormControl id="requirement" maxWidth={300}>
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
                    <FormControl id="additionalInformation">
                      <FormLabel>Additional Information</FormLabel>
                      <Input
                        name="additionalInformation"
                        onChange={handleChange}
                        className="h-16"
                        value={projectData.additionalInformation}
                        h="5rem"
                      />
                    </FormControl>
                  </div>
                  <div>
                    <div>
                      <h2>Existing Files</h2>
                      <div className="flex gap-3">
                        {projectData.singleFileView && (
                          <div>
                            <div className="flex gap-1">
                              <p>File : {projectData.singleFileView}</p>
                              <Button
                                as="a"
                                href={`${import.meta.env.VITE_API_BASE
                                  }/uploads/${projectData.singleFileView}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                textDecoration="none"
                                _hover={{ textDecoration: "none" }}
                                display="inline-block"
                                variant="solid"
                              >
                                View
                              </Button>
                              <Button
                                onClick={() => {
                                  handleAddSingleFileToRemove(
                                    projectData.singleFileView
                                  );
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {projectData.multipleFilesView.map((file, index) => (
                          <div key={index}>
                            <p>
                              File {index + 1}: {file}
                            </p>
                            <div className="flex gap-1">
                              <Button
                                as="a"
                                href={`${import.meta.env.VITE_API_BASE
                                  }/uploads/${file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                textDecoration="none"
                                _hover={{ textDecoration: "none" }}
                                display="inline-block"
                                mr={2}
                                mb={2}
                                variant="solid"
                              >
                                View
                              </Button>
                              <Button
                                onClick={() => {
                                  handleAddMultipleFilesToRemove(file);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2>New Files</h2>
                      <div className="flex gap-3">
                        {/* Display single file */}
                        {projectData.singleFile && (
                          <div>
                            <p>Single File: {projectData.singleFile.name}</p>
                            <Button onClick={handleDeleteSingleFile}>
                              Delete
                            </Button>
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
                        {/* Display multiple files */}
                        {projectData.multipleFiles.map((file, index) => (
                          <div key={index}>
                            <p>
                              File {index + 1}: {file.name}
                            </p>
                            <Button
                              onClick={() => handleDeleteMultipleFile(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                        <FormControl mb="4">
                          <FormLabel>Multiple Files</FormLabel>
                          <Input
                            type="file"
                            multiple
                            ref={multipleFileRef}
                            onChange={handleMultipleFilesChange}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" colorScheme="purple" className="mt-5">
                    Update Lead
                  </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </form>
      </Box>
    </>
  );
};

export default UpdateLead;
