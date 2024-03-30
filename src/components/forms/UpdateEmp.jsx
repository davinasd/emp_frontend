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
    Box
} from "@chakra-ui/react";
import { Select } from "antd";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { toast } from "react-toastify";
import SelectSource from "../common/SelectSource";
import MyDatePicker from "../common/MyDatePicker";
import SelectTag from "../common/SelectTag";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { convertDateFormatString } from "../../helpers";
import { useNavigate } from "react-router-dom";
import ViewLeadByBrand from "../common/ViewLeadByBrand";
import { clearEmployeeId, selectEmployeeIds } from "../../store/slice/EmployeeSlice";

const UpdateEmp = () => {
    const singleFileRef = useRef();
    const multipleFileRef = useRef();
    const clientId = useSelector(selectEmployeeIds)[0];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [client, setClient] = useState("");
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
        guardianDetails: {
            guardianName: "",
            guardianContactNo: "",
        },
        bankDetails: {
            bankName: "",
            bankAccountNo: "",
            bankIfscCode: "",
            type: "",
        },
    });

    
    useEffect(() => {
        // console.log(clientId);
        axios.get(
                `${import.meta.env.VITE_API_BASE
                }/api/admin/getEmployeeByID/${clientId}`
            )
            .then((response) => {
                const clientData = response.data;
                setClient(response.data);
                setProjectData(prev => ({
                    ...prev,
                    // Populate client with fetched data
                    type: clientData?.type || prev.type,
                    name: clientData?.name || prev.name,
                    gender: clientData?.gender || prev.gender,
                    contactNo: clientData?.contactNo || prev.contactNo,
                    title: clientData?.title || prev.title,
                    dob: clientData?.dob || prev.dob,
                    position: clientData?.position || prev.position,
                    designation: clientData?.designation || prev.designation,
                    department: clientData?.department || prev.department,
                    email: clientData?.email || prev.email,
                    joiningDate: clientData?.joiningDate || prev.joiningDate,
                    manager_id: clientData?.manager_id || prev.manager_id,
                    probationPeriod: clientData?.probationPeriod || prev.probationPeriod,
                    leavingDate: clientData?.leavingDate || prev.leavingDate,
                    aadharNumber: clientData?.aadharNumber || prev.aadharNumber,
                    panNumber: clientData?.panNumber || prev.panNumber,
                    permanentAddress: clientData?.permanentAddress || prev.permanentAddress,
                    correspondenceAddress: clientData?.correspondenceAddress || prev.correspondenceAddress,
                    guardianDetails: {
                        ...prev.guardianDetails,
                        guardianName: clientData?.guardianDetails?.guardianName || prev.guardianDetails.guardianName,
                        guardianContactNo: clientData?.guardianDetails?.guardianContactNo || prev.guardianDetails.guardianContactNo,
                    },
                    bankDetails: {
                        ...prev.bankDetails,
                        bankName: clientData?.bankDetails?.bankName || prev.bankDetails.bankName,
                        bankAccountNo: clientData?.bankDetails?.bankAccountNo || prev.bankDetails.bankAccountNo,
                        bankIfscCode: clientData?.bankDetails?.bankIfscCode || prev.bankDetails.bankIfscCode,
                        type: clientData?.bankDetails?.type || prev.bankDetails.type,
                    },
                }));

                setSelectedCountry(clientData.country);
                setSelectedState(clientData.state);
                setSelectSourceValue(clientData.source);
                setSelectedTagValue(clientData.requirement);
                dispatch(clearEmployeeId);
            })
            .catch((error) => {
                console.error("Error fetching employee details:", error);
                toast.error("Failed to fetch employee details");
            });
    }, [clientId]);
    const workStartDate = projectData.workStartDate ? moment(projectData.workStartDate, 'DD-MM-YY') : null;
    const clientBirthdayDate = projectData.clientBirthday ? moment(projectData.clientBirthday, 'DD-MM-YY') : null;
    const clientAnniversaryDate = projectData.clientAnniversary ? moment(projectData.clientAnniversary, 'DD-MM-YY') : null;
    const companyAnniversaryDate = projectData.companyAnniversary ? moment(projectData.companyAnniversary, 'DD-MM-YY') : null;


    const [selectedCountry, setSelectedCountry] = useState(projectData.country);
    const [selectedState, setSelectedState] = useState(projectData.state);
    const [selectSourceValue, setSelectSourceValue] = useState([]);
    const [selectedTagValue, setSelectedTagValue] = useState([]);

    const [viewLeadByBrand, setViewLeadByBrand] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
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

    const handleDeleteMultipleFile = (index) => {
        console.log(multipleFileRef.current.value);
        const updatedFiles = [...projectData.multipleFiles];
        updatedFiles.splice(index, 1);
        multipleFileRef.current.value = "";
        console.log(multipleFileRef.current.value);
        setProjectData({ ...projectData, multipleFiles: updatedFiles });
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
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Filter out entries with empty string values
        Object.entries(projectData).forEach(([key, value]) => {
            if (value !== "") {
                formData.append(key, value);
            }
        });

        axios
            .patch(
                `${import.meta.env.VITE_API_BASE}/api/admin/updateEmployee/${clientId}`,
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
                        navigate("/getAllClient");
                    }, 2000);
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
                <div className="flex flex-col mb-4 md:flex-row justify-between gap-4 md:items-center">
                    <div>
                        <h1 className="text-md font-semibold">Update Employee</h1>
                        <h1 className="text-2xl font-semibold">{client.clientName}</h1>
                    </div>

                    <ViewLeadByBrand open={viewLeadByBrand} setOpen={setViewLeadByBrand} brandName={projectData.brandName} />
                </div>

                <form onSubmit={handleSubmit}>
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
                                    <div className="flex gap-3">
                                        <FormControl id="companyAnniversary">
                                            <FormLabel>Work Start Date</FormLabel>
                                            <MyDatePicker
                                                value={workStartDate}
                                                selected={projectData.workStartDate}
                                                onChange={(date) =>
                                                    setProjectData({
                                                        ...projectData,
                                                        workStartDate: date,
                                                    })
                                                }
                                                format={"DD/MM/YYYY"}
                                            />
                                            {workStartDate && (
                                                <p>{convertDateFormatString(workStartDate)}</p>
                                            )}
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-3 mb-2">
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

                                        <FormControl id="brandName">
                                            <FormLabel>Brand Name</FormLabel>
                                            <Input
                                                name="brandName"
                                                onChange={handleChange}
                                                value={projectData.brandName}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-3 my-3">
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
                                        <FormControl id="brandName" maxWidth={250}>
                                            <FormLabel>Source</FormLabel>
                                            <Flex>
                                                <SelectSource
                                                    selectSourceValue={selectSourceValue}
                                                    setSelectSourceValue={setSelectSourceValue}
                                                />
                                            </Flex>
                                        </FormControl>
                                        <FormControl id="brandName">
                                            <FormLabel>Source Information</FormLabel>
                                            <Input
                                                name="sourceInformation"
                                                onChange={handleChange}
                                                value={projectData.sourceInformation}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-3 my-3">
                                        <FormControl id="tags">
                                            <FormControl id="companyName">
                                                <FormLabel>Company Name</FormLabel>
                                                <Input
                                                    name="companyName"
                                                    onChange={handleChange}
                                                    value={projectData.companyName}
                                                />
                                            </FormControl>
                                        </FormControl>

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
                                    </div>

                                    <div className="flex gap-3 mb-3">
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
                                        Update Employee
                                    </Button>
                                </TabPanel>
                                <TabPanel>
                                    <div className="flex gap-3 mb-3 flex-col md:flex-row">
                                        <FormControl id="country">
                                            <FormLabel>Country</FormLabel>
                                            <CountryDropdown
                                                name="country"
                                                value={selectedCountry}
                                                onChange={handleSelectChange(
                                                    setSelectedCountry,
                                                    "selectedCountry"
                                                )}
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
                                    <Button type="submit" colorScheme="purple" className="mt-5">
                                        Update Employee
                                    </Button>
                                </TabPanel>

                                <TabPanel>
                                    <div className="flex gap-3">
                                        <FormControl id="clientBirthday">
                                            <FormLabel>Client Birthday</FormLabel>
                                            <MyDatePicker
                                                value={clientBirthdayDate}
                                                selected={projectData.clientBirthday}
                                                onChange={(date) =>
                                                    setProjectData({
                                                        ...projectData,
                                                        clientBirthday: date,
                                                    })
                                                }
                                                format={"DD/MM/YYYY"}
                                            />
                                            {clientBirthdayDate && (
                                                <p>{convertDateFormatString(clientBirthdayDate)}</p>
                                            )}
                                        </FormControl>
                                        <FormControl id="clientAnniversary">
                                            <FormLabel>Client Anniversary</FormLabel>
                                            <MyDatePicker
                                                value={clientAnniversaryDate}
                                                selected={projectData.clientAnniversary}
                                                onChange={(date) =>
                                                    setProjectData({
                                                        ...projectData,
                                                        clientAnniversary: date,
                                                    })
                                                }
                                                format={"DD/MM/YYYY"}
                                            />
                                            {clientAnniversaryDate && (
                                                <p>{convertDateFormatString(clientAnniversaryDate)}</p>
                                            )}
                                        </FormControl>
                                        <FormControl id="companyAnniversary">
                                            <FormLabel>Company Anniversary</FormLabel>
                                            <MyDatePicker
                                                value={companyAnniversaryDate}
                                                selected={projectData.companyAnniversary}
                                                onChange={(date) =>
                                                    setProjectData({
                                                        ...projectData,
                                                        companyAnniversary: date,
                                                    })
                                                }
                                                format={"DD/MM/YYYY"}
                                            />
                                            {companyAnniversaryDate && (
                                                <p>{convertDateFormatString(companyAnniversaryDate)}</p>
                                            )}
                                        </FormControl>
                                    </div>
                                    <Button type="submit" colorScheme="purple" className="mt-5">
                                        Update Employee
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
                                                className="h-16"
                                                value={projectData.additionalInformation}
                                                h="5rem"
                                            />
                                        </FormControl>
                                    </div>
                                    <Button type="submit" colorScheme="purple" className="mt-5">
                                        Update Employee
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
                                                            <p>{projectData.singleFileView}</p>
                                                            <Button
                                                                as="a"
                                                                href={`${import.meta.env.VITE_API_BASE
                                                                    }/uploads/${projectData.singleFileView}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                textDecoration="none"
                                                                _hover={{ textDecoration: "none" }}
                                                                variant="solid"
                                                                size={"sm"}
                                                            >
                                                                View
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    handleAddSingleFileToRemove(
                                                                        projectData.singleFileView
                                                                    );
                                                                }}
                                                                size={"sm"}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                {projectData?.multipleFilesView?.map((file, index) => (
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
                                            <div className="flex flex-col gap-3">
                                                {/* Display multiple files */}
                                                <FormControl>
                                                    <FormLabel>Multiple Files</FormLabel>
                                                    <Input
                                                        type="file"
                                                        multiple
                                                        ref={multipleFileRef}
                                                        onChange={handleMultipleFilesChange}
                                                    />
                                                </FormControl>
                                                {projectData?.multipleFiles?.length > 0 && (
                                                    <div className="mb-4 bg-gray-200 rounded-md p-2">
                                                        <h2 className="font-semibold text-lg">New files</h2>
                                                        {projectData?.multipleFiles?.map((file, index) => (
                                                            <div key={index} className="flex items-center gap-2">
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
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button type="submit" colorScheme="purple" className="mt-5">
                                            Update Employee
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
                                    <FormControl id="companyAnniversary">
                                        <FormLabel>Work Start Date</FormLabel>
                                        <MyDatePicker
                                            value={workStartDate}
                                            selected={projectData.workStartDate}
                                            onChange={(date) =>
                                                setProjectData({
                                                    ...projectData,
                                                    workStartDate: date,
                                                })
                                            }
                                            format={"DD/MM/YYYY"}
                                        />
                                        {workStartDate && (
                                            <p>{convertDateFormatString(workStartDate)}</p>
                                        )}
                                    </FormControl>
                                    <div className="flex gap-2 mb-2">
                                        <FormControl id="gender">
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
                                        <FormControl id="title">
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
                                    </div>
                                    <FormControl id="clientName">
                                        <FormLabel>Client Name</FormLabel>
                                        <Input
                                            name="clientName"
                                            onChange={handleChange}
                                            value={projectData.clientName}
                                        />
                                    </FormControl>
                                    <FormControl id="brandName">
                                        <FormLabel>Brand Name</FormLabel>
                                        <Input
                                            name="brandName"
                                            onChange={handleChange}
                                            value={projectData.brandName}
                                        />
                                    </FormControl>
                                    <FormControl id="tags">
                                        <FormControl id="companyName">
                                            <FormLabel>Company Name</FormLabel>
                                            <Input
                                                name="companyName"
                                                onChange={handleChange}
                                                value={projectData.companyName}
                                            />
                                        </FormControl>
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
                                    </div>

                                    <FormControl id="tags">
                                        <FormLabel>Source</FormLabel>
                                        <SelectSource
                                            selectSourceValue={selectSourceValue}
                                            setSelectSourceValue={setSelectSourceValue}
                                        />
                                    </FormControl>
                                    <FormControl id="brandName">
                                        <FormLabel>Source Information</FormLabel>
                                        <Input
                                            name="sourceInformation"
                                            onChange={handleChange}
                                            value={projectData.sourceInformation}
                                        />

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
                                    <Button type="submit" colorScheme="purple" className="mt-5">
                                        Update Employee
                                    </Button>
                                </TabPanel>
                                <TabPanel>
                                    <div className="flex gap-3 mb-3 flex-col md:flex-row">
                                        <div className="flex gap-3">
                                            <FormControl id="clientBirthday">
                                                <FormLabel>Client Birthday</FormLabel>
                                                <MyDatePicker
                                                    value={clientBirthdayDate}
                                                    selected={projectData.clientBirthday}
                                                    onChange={(date) =>
                                                        setProjectData({
                                                            ...projectData,
                                                            clientBirthday: date,
                                                        })
                                                    }
                                                    format={"DD/MM/YYYY"}
                                                />
                                                {clientBirthdayDate && (
                                                    <p>{convertDateFormatString(clientBirthdayDate)}</p>
                                                )}
                                            </FormControl>
                                            <FormControl id="clientAnniversary">
                                                <FormLabel>Client Anniversary</FormLabel>
                                                <MyDatePicker
                                                    value={clientAnniversaryDate}
                                                    selected={projectData.clientAnniversary}
                                                    onChange={(date) =>
                                                        setProjectData({
                                                            ...projectData,
                                                            clientAnniversary: date,
                                                        })
                                                    }
                                                    format={"DD/MM/YYYY"}
                                                />
                                                {clientAnniversaryDate && (
                                                    <p>
                                                        {convertDateFormatString(clientAnniversaryDate)}
                                                    </p>
                                                )}
                                            </FormControl>
                                            <FormControl id="companyAnniversary">
                                                <FormLabel>Company Anniversary</FormLabel>
                                                <MyDatePicker
                                                    value={companyAnniversaryDate}
                                                    selected={projectData.companyAnniversary}
                                                    onChange={(date) =>
                                                        setProjectData({
                                                            ...projectData,
                                                            companyAnniversary: date,
                                                        })
                                                    }
                                                    format={"DD/MM/YYYY"}
                                                />
                                                {companyAnniversaryDate && (
                                                    <p>
                                                        {convertDateFormatString(companyAnniversaryDate)}
                                                    </p>
                                                )}
                                            </FormControl>
                                        </div>
                                        <div className="flex gap-3 mb-3 flex-col md:flex-row">
                                            <FormControl id="country">
                                                <FormLabel>Country</FormLabel>
                                                <CountryDropdown
                                                    name="country"
                                                    value={selectedCountry}
                                                    onChange={handleSelectChange(
                                                        setSelectedCountry,
                                                        "selectedCountry"
                                                    )}
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
                                    </div>

                                    <div className="flex flex-col mt-3 gap-3">
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
                                                {projectData?.multipleFilesView?.map((file, index) => (
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
                                            {/* Display single file */}
                                            {projectData.singleFile && (
                                                <div>
                                                    <p>Single File: {projectData.singleFile.name}</p>
                                                    <Button onClick={handleDeleteSingleFile}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="flex gap-3">
                                                <FormControl mb="4">
                                                    <FormLabel>Single File</FormLabel>
                                                    <Input
                                                        type="file"
                                                        ref={singleFileRef}
                                                        onChange={handleSingleFileChange}
                                                    />
                                                </FormControl>
                                            </div>
                                            <div className="flex flex-col-reverse gap-3">
                                                {/* Display multiple files */}
                                                {projectData?.multipleFiles?.map((file, index) => (
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
                                        Update Employee
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

export default UpdateEmp;