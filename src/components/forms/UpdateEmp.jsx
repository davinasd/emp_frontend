import {
    FormControl,
    FormLabel,
    Button,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Input,
    Box,
    Select as ChakraSelect
} from "@chakra-ui/react";
import { Select } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import MyDatePicker from "../common/MyDatePicker";
import { useSelector, useDispatch } from "react-redux";
import { converDateStringFormat, convertDateFormatString } from "../../helpers";
import { useNavigate } from "react-router-dom";
import ViewLeadByBrand from "../common/ViewLeadByBrand";
import { clearEmployeeId, selectEmployeeIds } from "../../store/slice/EmployeeSlice";
import moment from "moment";

const UpdateEmp = () => {
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
        fetchData();
    }, [clientId]);

    const fetchData = async () => {
        await axios.get(
            `${import.meta.env.VITE_API_BASE
            }/api/admin/getEmployeeByID/${clientId}`
        )
            .then((response) => {
                const clientData = response.data;
                setClient(clientData);
                setProjectData((prev) => {
                    return {
                        // Populate client with fetched data
                        name: clientData?.name || prev.name,
                        gender: clientData?.gender || prev.gender,
                        contactNo: clientData?.contactNo || prev.contactNo,
                        type: clientData?.type || prev.type,
                        dob: clientData?.dob || prev.dob,
                        position: clientData?.position || prev.position,
                        department: clientData?.department || prev.department,
                        designation: clientData?.designation || prev.designation,
                        manager_id: clientData?.manager_id || prev.manager_id,
                        email: clientData?.email || prev.email,
                        joiningDate: clientData?.joiningDate || prev.joiningDate,
                        probationPeriod: clientData?.probationPeriod || prev.probationPeriod,
                        leavingDate: clientData?.leavingDate || prev.leavingDate,
                        aadharNumber: clientData?.aadharNumber || prev.aadharNumber,
                        panNumber: clientData?.panNumber || prev.panNumber,
                        permanentAddress: clientData?.permanentAddress || prev.permanentAddress,
                        correspondenceAddress: clientData?.correspondenceAddress || prev.correspondenceAddress,
                        title: clientData?.title || prev.title,
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
                    }
                });

                setSelectSourceValue(clientData.source);
                setSelectedTagValue(clientData.requirement);
                dispatch(clearEmployeeId);
            })
        // .catch((error) => {
        //     console.log(`Error fetching emp: ${error}`);
        //     toast.error("Failed to fetch employee details");
        // })
    }
    const dob = projectData.enquiryDate ? moment(projectData.dob, 'DD-MM-YY') : null;
    const renderJoiningDate = projectData.enquiryDate ? moment(projectData.joiningDate, 'DD-MM-YY') : null;

    const [selectSourceValue, setSelectSourceValue] = useState([]);
    const [selectedTagValue, setSelectedTagValue] = useState([]);

    const [viewLeadByBrand, setViewLeadByBrand] = useState(false);

    if (!projectData) {
        toast.error("Failed to fetch employee details");
    }

    useEffect(() => {
        setProjectData((prev) => ({
            ...prev,
            source: selectSourceValue,
            requirement: selectedTagValue,
        }));
    }, [selectSourceValue, selectedTagValue]);

    // const handleSingleFileChange = (e) => {
    //     setProjectData({ ...projectData, singleFile: e.target.files[0] });
    // };

    // const handleMultipleFilesChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     console.log(files);
    //     setProjectData({
    //         ...projectData,
    //         multipleFiles: [...projectData.multipleFiles, ...files],
    //     });
    // };

    // const handleDeleteSingleFile = () => {
    //     singleFileRef.current.value = "";
    //     const { singleFile, ...newData } = projectData;
    //     setProjectData({ ...newData });
    // };

    // const handleDeleteMultipleFile = (index) => {
    //     console.log(multipleFileRef.current.value);
    //     const updatedFiles = [...projectData.multipleFiles];
    //     updatedFiles.splice(index, 1);
    //     multipleFileRef.current.value = "";
    //     console.log(multipleFileRef.current.value);
    //     setProjectData({ ...projectData, multipleFiles: updatedFiles });
    // };
    // const [tags, setTags] = useState([]);
    // const [managers, setManagers] = useState([]);
    // useEffect(() => {
    //     axios
    //         .get(`${import.meta.env.VITE_API_BASE}/api/admin/getManagersAllDetails`)
    //         .then((response) => {
    //             setManagers(response.data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching clients:", error);
    //         });
    // }, []);

    const joiningDate = `${projectData?.joiningDate?._d}`.slice(4, 15);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProjectData({ ...projectData, [name]: value });
    };
    const handleSelectOption = (name, value) => {
        setProjectData({ ...projectData, [name]: value });
    };

    const handleSelectManager = (e) => {
        const selectedManagerId = e.target.value;
        setProjectData({ ...projectData, manager_id: selectedManagerId });
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

    console.log(projectData)

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
                        <h1 className="text-2xl font-semibold">{client.name}</h1>
                    </div>

                    <ViewLeadByBrand open={viewLeadByBrand} setOpen={setViewLeadByBrand} brandName={projectData.brandName} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="hidden md:block">
                        <Tabs>
                            <TabList>
                                <Tab>Employee Information</Tab>
                                <Tab>Address Information</Tab>
                                <Tab>Guardian Information</Tab>
                                <Tab>Bank Information</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <div className="flex gap-3 mb-3">
                                        <FormControl id="title" maxWidth={100}>
                                            <FormLabel>Title </FormLabel>
                                            <Select
                                                style={{ width: "100%", height: "40px" }}
                                                placeholder="Select Title"
                                                value={projectData?.title}
                                                onChange={(value) => handleSelectOption("title", value)}
                                            >
                                                <Select.Option value="Mr.">Mr.</Select.Option>
                                                <Select.Option value="Mrs.">Mrs.</Select.Option>
                                            </Select>
                                        </FormControl>

                                        <FormControl id="employeeName" >
                                            <FormLabel>Employee Name </FormLabel>
                                            <Input style={{ height: 40 }} name="name" value={projectData?.name} onChange={handleChange} />
                                        </FormControl>

                                        <FormControl id="gender" maxWidth={100} >
                                            <FormLabel>Gender </FormLabel>
                                            <Select
                                                style={{ width: "100%", height: "40px" }}
                                                name="gender"
                                                value={projectData?.gender}
                                                onChange={(value) => handleSelectOption("gender", value)}
                                                placeholder="Select gender"
                                            >
                                                <Select.Option value="Male">Male</Select.Option>
                                                <Select.Option value="Female">Female</Select.Option>
                                                <Select.Option value="Others">Others</Select.Option>
                                            </Select>
                                        </FormControl>

                                        <FormControl id="contactNo" >
                                            <FormLabel>Contact Number </FormLabel>
                                            <Input style={{ height: 40 }} name="contactNo" value={projectData?.contactNo} onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="dob" maxWidth={150} >
                                            <FormLabel>DOD </FormLabel>
                                            <MyDatePicker
                                                className="mb-1 h-[40px]"
                                                value={dob}
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
                                            <FormLabel>Position </FormLabel>
                                            <Select
                                                style={{ width: "100%", height: "40px" }}
                                                name="position"
                                                value={projectData?.position}
                                                onChange={(value) => handleSelectOption("position", value)}
                                                placeholder="Select Position"
                                            >
                                                <Select.Option value="0">Superadmin</Select.Option>
                                                <Select.Option value="1">Admin</Select.Option>
                                                <Select.Option value="2">User</Select.Option>
                                                <Select.Option value="3">Manager</Select.Option>
                                            </Select>
                                        </FormControl>
                                        <FormControl id="designation" >
                                            <FormLabel>Designation </FormLabel>
                                            <Input
                                                name="designation"
                                                value={projectData?.designation}
                                                onChange={handleChange}
                                                style={{ height: 40 }}
                                            />
                                        </FormControl>
                                    </div>

                                    <div className="flex gap-3 mb-3">
                                        <FormControl id="department" maxWidth={500}>
                                            <FormLabel>Department </FormLabel>
                                            <Input name="department" onChange={handleChange} value={projectData?.department} style={{ height: 40 }} />
                                        </FormControl>
                                        <FormControl id="email" maxWidth={350}>
                                            <FormLabel>Email </FormLabel>
                                            <Input name="email" onChange={handleChange} value={projectData?.email} style={{ height: 40 }} />
                                        </FormControl>
                                        <FormControl id="password" maxWidth={350} >
                                            <FormLabel>Password </FormLabel>
                                            <Input name="password" onChange={handleChange} style={{ height: 40 }} />
                                        </FormControl>
                                    </div>

                                    <div className="flex gap-3 mb-3">
                                        <FormControl id="joiningDate" maxWidth={300} >
                                            <FormLabel>Joining Date </FormLabel>
                                            <div className="flex gap-2 items-center">
                                                <MyDatePicker
                                                    className="mb-1 h-[40px]"
                                                    value={renderJoiningDate}
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
                                                {/* {managers.map((manager, index) => (
                                                    <option key={`manager-${index}`} value={manager.id}>
                                                        {manager.name}
                                                    </option>
                                                ))} */}
                                            </ChakraSelect>
                                        </FormControl>

                                        <FormControl id="type" maxWidth={200} >
                                            <FormLabel>Employment Type </FormLabel>
                                            <Select
                                                style={{ width: "100%", height: 40 }}
                                                name="type"
                                                value={projectData.type}
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
                                            <FormLabel>Aadhar Number </FormLabel>
                                            <Input name="aadharNumber" value={projectData?.aadharNumber} onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="panNumber" >
                                            <FormLabel>Pan Number </FormLabel>
                                            <Input name="panNumber" value={projectData?.panNumber} onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="probationPeriod" >
                                            <FormLabel>Probation Period </FormLabel>
                                            <Input name="probationPeriod" value={projectData?.probationPeriod} onChange={handleChange} />
                                        </FormControl>
                                    </div>
                                    <Button type="submit" colorScheme="purple" className="mt-5">
                                        Update Employee
                                    </Button>
                                </TabPanel>
                                <TabPanel>
                                    <div className="flex gap-3">
                                        <FormControl id="permanentAddress" className="w-1/2" >
                                            <FormLabel>Permanent Address </FormLabel>
                                            <Input
                                                name="permanentAddress"
                                                value={projectData?.permanentAddress}
                                                onChange={handleChange}
                                                className="h-16"
                                            />
                                        </FormControl>
                                        <FormControl id="correspondenceAddress" className="w-1/2" >
                                            <FormLabel>Correspondence Address </FormLabel>
                                            <Input
                                                name="correspondenceAddress"
                                                value={projectData?.correspondenceAddress}
                                                onChange={handleChange}
                                                className="h-16"
                                            />
                                        </FormControl>
                                    </div>
                                    <Button type="submit" colorScheme="purple" className="mt-5">
                                        Update Employee
                                    </Button>
                                </TabPanel>

                                <TabPanel>
                                    <div className="flex gap-3">
                                        <FormControl id="guardianDetails.relation">
                                            <FormLabel>Relation</FormLabel>
                                            <Input
                                                name="guardianDetails.relation"
                                                value={projectData?.guardianDetails?.relation}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl id="guardianDetails.guardianName" >
                                            <FormLabel>Guardian Name </FormLabel>
                                            <Input
                                                name="guardianDetails.guardianName"
                                                value={projectData?.guardianDetails?.guardianName}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl id="guardianDetails.guardianContactNo">
                                            <FormLabel>Guardian Contact Number </FormLabel>
                                            <Input
                                                name="guardianDetails.guardianContactNo"
                                                value={projectData?.guardianDetails?.guardianContactNo}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                    </div>
                                    <Button type="submit" colorScheme="purple" className="mt-5">
                                        Update Employee
                                    </Button>
                                </TabPanel>

                                <TabPanel>
                                    <div className="flex gap-3 mb-4">
                                        <FormControl id="bankDetails.bankName" >
                                            <FormLabel>Bank Name  </FormLabel>
                                            <Input name="bankDetails.bankName" value={projectData?.bankDetails?.bankName} onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="bankDetails.bankAccountNo">
                                            <FormLabel>Bank Account Number  </FormLabel>
                                            <Input
                                                name="bankDetails.bankAccountNo"
                                                value={projectData?.bankDetails?.bankAccountNo}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-3">
                                        <FormControl id="bankDetails.bankIfscCode">
                                            <FormLabel>Bank IFSC Code </FormLabel>
                                            <Input
                                                name="bankDetails.bankIfscCode"
                                                value={projectData?.bankDetails?.bankIfscCode}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl id="bankDetails.type">
                                            <FormLabel>Bank Type </FormLabel>
                                            <Input name="bankDetails.type" value={projectData?.bankDetails?.type} onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="bankDetails.branch">
                                            <FormLabel>Branch Name </FormLabel>
                                            <Input name="bankDetails.branch" value={projectData?.bankDetails?.branchName} onChange={handleChange} />
                                        </FormControl>
                                    </div>
                                    <Button type="submit" colorScheme="purple" className="mt-5">
                                        Update Employee
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
                                            <FormLabel>Titl </FormLabel>
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
                                            <FormLabel>Employee Nam </FormLabel>
                                            <Input name="name" onChange={handleChange} />
                                        </FormControl>

                                        <FormControl id="gender" maxWidth={150}>
                                            <FormLabel>Gende </FormLabel>
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
                                            <FormLabel>Contact Numbe </FormLabel>
                                            <Input name="contactNo" onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="dob" maxWidth={150}>
                                            <FormLabel>DO </FormLabel>
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
                                            <FormLabel>Positio </FormLabel>
                                            <Input name="position" onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="designation">
                                            <FormLabel>Designatio</FormLabel>
                                            <Input
                                                name="designation"
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                    </div>
                                    \
                                    <div className="flex flex-col gap-3 mb-3">
                                        <FormControl id="department" maxWidth={500} >
                                            <FormLabel>Departmen</FormLabel>
                                            <Input name="department" onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="email" maxWidth={350} >
                                            <FormLabel>Emai</FormLabel>
                                            <Input name="email" onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="password" maxWidth={350}>
                                            <FormLabel>Passwor</FormLabel>
                                            <Input name="password" onChange={handleChange} />
                                        </FormControl>
                                    </div>

                                    <div className="flex gap-3">
                                        <FormControl id="joiningDate" maxWidth={300}>
                                            <FormLabel>Joining Dat</FormLabel>
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
                                                {/* {managers.map((manager, index) => (
                                                    <option key={`manager-${index}`} value={manager.id}>
                                                        {manager.name}
                                                    </option>
                                                ))} */}
                                            </select>
                                        </FormControl>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="flex gap-3 mb-3 flex-col md:flex-row">
                                        <FormControl id="permanentAddress" className="w-1/2">
                                            <FormLabel>Permanent Addres</FormLabel>
                                            <Input
                                                name="permanentAddress"
                                                onChange={handleChange}
                                                className="h-16"
                                            />
                                        </FormControl>
                                        <FormControl id="correspondenceAddress" className="w-1/2">
                                            <FormLabel>Correspondence Addres</FormLabel>
                                            <Input
                                                name="correspondenceAddress"
                                                onChange={handleChange}
                                                className="h-16"
                                            />
                                        </FormControl>
                                        <FormControl id="guardianDetails.relation">
                                            <FormLabel>Relatio</FormLabel>
                                            <Input
                                                name="guardianDetails.relation"
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl id="guardianDetails.guardianName">
                                            <FormLabel>Guardian Nam</FormLabel>
                                            <Input
                                                name="guardianDetails.guardianName"
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl id="guardianDetails.guardianContactNo">
                                            <FormLabel>Guardian Contact Numbe</FormLabel>
                                            <Input
                                                name="guardianDetails.guardianContactNo"
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl id="bankDetails.bankName">
                                            <FormLabel>Bank Nam</FormLabel>
                                            <Input name="bankDetails.bankName" onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="bankDetails.bankAccountNo">
                                            <FormLabel>Bank Account Numbe </FormLabel>
                                            <Input
                                                name="bankDetails.bankAccountNo"
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl id="bankDetails.bankIfscCode">
                                            <FormLabel>Bank IFSC Cod </FormLabel>
                                            <Input
                                                name="bankDetails.bankIfscCode"
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl id="bankDetails.type">
                                            <FormLabel>Bank Type</FormLabel>
                                            <Input name="bankDetails.type" onChange={handleChange} />
                                        </FormControl>
                                        <FormControl id="bankDetails.branch">
                                            <FormLabel>Branch Nam </FormLabel>
                                            <Input name="bankDetails.branch" onChange={handleChange} />
                                        </FormControl>
                                    </div>

                                    <Button type="submit" colorScheme="purple" className="mt-5">
                                        Create Employee
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