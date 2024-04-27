import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import axios from "axios";
import InfoModal from "./common/InfoModal";
import { GoPlus } from "react-icons/go";
import TableContainer from "./common/TableContainer";
import { Link } from "react-router-dom";
import { Empty } from "antd";
import { toast } from "react-toastify";
import { DeleteIcon } from "@chakra-ui/icons";
import { priorityArray } from "../helpers";
import { IoMdEye } from "react-icons/io";

const GetAllCompletedProject = () => {
  const [projects, setProjects] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  async function fetchData() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllCompletedProjects`
      );
      setProjects(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleMoreInfo = (project) => {
    setSelectedProject(project);
    onOpen();
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/deleteProjectById/${deleteProjectId}`
      );
      toast.success("Successfully deleted Project");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllCompletedProjects`
      );
      setProjects(response.data);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDeleteConfirmation = (projectId) => {
    setDeleteProjectId(projectId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
  };

  const handleStatusChange = async (id, statusNo) => {
    try {
      await axios.get(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/updateProjectStatus/${id}/${statusNo}`
      );
      // Fetch data again after updating status
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllCompletedProjects`
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response.data.message);
    }
  };
  const handlePriorityChange = async (id, priority) => {
    try {
      await axios.get(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/updateProjectPriority/${id}/${priority}`
      );
      // Fetch data again after updating status
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllCompletedProjects`
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error updating priority:", error);
      alert(error.response.data.message);
    }
  };

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="purple.500" />
      </div>
    );
  }

  console.log(projects);

  return (
    <>
      <div className="w-full p-8 md:block flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Project Information</h1>

        <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-4 items-center mb-5">
          <Link to="/CreateProject">
            <Button
              colorScheme="blue"
              onClick={onOpen}
              _hover={{ bg: "blue.600" }}
              mb="6"
              className="flex gap-2 items-center"
            >
              <GoPlus /> Add a Project
            </Button>
          </Link>

          <div className="flex items-center justify-end mb-2">
            <select
              className="px-2 py-1 border mr-1 rounded-lg"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="" disabled>
                Select Financial Year
              </option>
              <option value="2025">2025-2026</option>
              <option value="2024">2024-2025</option>
              <option value="2023">2023-2024</option>
              <option value="2022">2022-2023</option>
              <option value="2021">2021-2022</option>
              <option value="2020">2020-2021</option>
              <option value="2020">2019-2020</option>
              <option value="2019">2018-2019</option>
              <option value="2018">2017-2018</option>
              <option value="2017">2016-2017</option>
              <option value="2015">2015-2016</option>
              <option value="2014">2014-2015</option>
              <option value="2013">2013-2014</option>
              <option value="2012">2012-2013</option>
              <option value="2011">2011-2012</option>
            </select>
            {selectedYear && (
              <select
                className="px-2 py-1 border rounded-md"
                defaultValue=""
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="" disabled>
                  Select Month
                </option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            )}
            <Button
              className="ml-2"
              size={"sm"}
              colorScheme="gray"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No Projects Assigned</span>}
          />
        ) : (
          <TableContainer
            formFor="project"
            searchText={searchText}
            setSearchText={setSearchText}
            setFilteredData={setFilteredProjects}
            data={projects}
          >
            <Thead position="sticky" top={0} bg={"#F1F5F9"} zIndex={10}>
              <Tr>
                <Th fontWeight="bold">S. No.</Th>
                <Th fontWeight="bold">Project Name</Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Priority
                </Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Status
                </Th>
                <Th fontWeight="bold">Action</Th>
                <Th fontWeight="bold"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {searchText !== ""
                ? filteredProjects.map((project, index) => (
                    <Tr key={project._id}>
                      <Td>{index + 1}</Td>
                      <Td>{project.projectName}</Td>
                      <Td className={`md:table-cell hidden capitalize`}>
                        <Menu>
                          {/* <MenuButton
                          size={"sm"}
                          as={Button}
                          variant={"outline"}
                        >
                          <div
                            className={`
                                  p-1 text-center flex gap-2 items-center capitalize
                                  ${project.priority.toLowerCase() === "high" && "text-red-500"}
                                  ${project.priority.toLowerCase() === "medium" && "text-blue-500"}
                                  ${project.priority.toLowerCase() === "low" && "text-green-500"}
                                  font-bold
                                `}
                            style={{
                              backgroundColor: "transparent", // Set background color to transparent
                            }}
                          >
                            {project?.priority}
                          </div>
                        </MenuButton> */}
                          <MenuButton
                            as={Button}
                            bg={
                              priorityArray[project.priority] === "urgent" ||
                              project.priority.toLowerCase() === "urgent"
                                ? "red"
                                : priorityArray[project.priority] === "high" ||
                                  project.priority.toLowerCase() === "high"
                                ? "orange.500"
                                : priorityArray[project.priority] ===
                                    "medium" ||
                                  project.priority.toLowerCase() === "medium"
                                ? "gold"
                                : "green.300"
                            }
                            _hover={{ color: "black" }}
                            fontWeight={"bold"}
                            textTransform={"capitalize"}
                            color={"white"}
                          >
                            {priorityArray[project.priority] ||
                              project.priority}
                          </MenuButton>
                          <MenuList>
                            {priorityArray.map((priority, index) => (
                              <MenuItem
                                key={index}
                                color={"gray.500"}
                                onClick={() =>
                                  handlePriorityChange(
                                    project.project_id,
                                    index
                                  )
                                }
                              >
                                {priority}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                      </Td>

                      <Td className="md:table-cell hidden">
                        <Menu>
                          <MenuButton
                            px={2}
                            py={1}
                            borderRadius="md"
                            borderWidth="1px"
                            _hover={{ bg: "gray.200" }}
                          >
                            <div className="flex gap-2 items-center">
                              {project.status === "Not Started" ? (
                                <div className="h-3 w-3 rounded-full bg-red-600" />
                              ) : project.status === "In Progress" ? (
                                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                              ) : project.status === "Completed" ? (
                                <div className="h-3 w-3 rounded-full bg-blue-600" />
                              ) : (
                                <div className="h-3 w-3 rounded-full bg-green-600" />
                              )}{" "}
                              {project.status}
                            </div>
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              color={"red.600"}
                              onClick={() =>
                                handleStatusChange(project.project_id, 0)
                              }
                            >
                              Not Started
                            </MenuItem>
                            <MenuItem
                              color={"yellow.400"}
                              onClick={() =>
                                handleStatusChange(project.project_id, 1)
                              }
                            >
                              In Progress
                            </MenuItem>
                            <MenuItem
                              color={"blue.600"}
                              onClick={() =>
                                handleStatusChange(project.project_id, 2)
                              }
                            >
                              Completed
                            </MenuItem>
                            <MenuItem
                              color={"green.600"}
                              onClick={() =>
                                handleStatusChange(project.project_id, 3)
                              }
                            >
                              On Hold
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(project)}
                        >
                          <IoMdEye />
                        </Button>
                      </Td>
                      <Td>
                        {" "}
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          colorScheme="red"
                          ml={2}
                          onClick={() =>
                            handleDeleteConfirmation(project.project_id)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))
                : projects.map((project, index) => (
                    <Tr key={project._id}>
                      <Td>{index + 1}</Td>
                      <Td>{project.projectName}</Td>
                      <Td className={`md:table-cell hidden capitalize`}>
                        <Menu>
                          {/* <MenuButton
                          size={"sm"}
                          as={Button}
                          variant={"outline"}
                        > */}
                          <MenuButton
                            size={"sm"}
                            as={Button}
                            bg={
                              priorityArray[project.priority] === "urgent" ||
                              project.priority.toLowerCase() === "urgent"
                                ? "red"
                                : priorityArray[project.priority] === "high" ||
                                  project.priority.toLowerCase() === "high"
                                ? "orange.500"
                                : priorityArray[project.priority] ===
                                    "medium" ||
                                  project.priority.toLowerCase() === "medium"
                                ? "gold"
                                : "green.300"
                            }
                            fontWeight={"bold"}
                            textTransform={"capitalize"}
                            color={"white"}
                          >
                            {/* <div
                            className={`
                                  p-1 text-center flex gap-2 items-center capitalize
                                  ${project.priority.toLowerCase() === "high" && "text-red-500"}
                                  ${project.priority.toLowerCase() === "medium" && "text-blue-500"}
                                  ${project.priority.toLowerCase() === "low" && "text-green-500"}
                                  font-bold
                                `}
                            style={{
                              backgroundColor: "transparent", // Set background color to transparent
                            }}
                          >
                            {project?.priority}
                          </div> */}
                            {priorityArray[project.priority] ||
                              project.priority}
                          </MenuButton>
                          <MenuList>
                            {priorityArray.map((priority, index) => (
                              <MenuItem
                                key={index}
                                color={"gray.500"}
                                onClick={() =>
                                  handlePriorityChange(
                                    project.project_id,
                                    index
                                  )
                                }
                              >
                                {priority}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                      </Td>

                      <Td className="md:table-cell hidden">
                        <Menu>
                          <MenuButton
                            px={2}
                            py={1}
                            borderRadius="md"
                            borderWidth="1px"
                            _hover={{ bg: "gray.200" }}
                          >
                            <div className="flex gap-2 items-center">
                              {project.status === "Not Started" ? (
                                <div className="h-3 w-3 rounded-full bg-red-600" />
                              ) : project.status === "In Progress" ? (
                                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                              ) : project.status === "Completed" ? (
                                <div className="h-3 w-3 rounded-full bg-blue-600" />
                              ) : (
                                <div className="h-3 w-3 rounded-full bg-green-600" />
                              )}{" "}
                              {project.status}
                            </div>
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              color={"red.600"}
                              onClick={() =>
                                handleStatusChange(project.project_id, 0)
                              }
                            >
                              Not Started
                            </MenuItem>
                            <MenuItem
                              color={"yellow.400"}
                              onClick={() =>
                                handleStatusChange(project.project_id, 1)
                              }
                            >
                              In Progress
                            </MenuItem>
                            <MenuItem
                              color={"blue.600"}
                              onClick={() =>
                                handleStatusChange(project.project_id, 2)
                              }
                            >
                              Completed
                            </MenuItem>
                            <MenuItem
                              color={"green.600"}
                              onClick={() =>
                                handleStatusChange(project.project_id, 3)
                              }
                            >
                              On Hold
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(project)}
                        >
                          <IoMdEye />
                        </Button>
                      </Td>
                      <Td>
                        {" "}
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          colorScheme="red"
                          ml={2}
                          onClick={() =>
                            handleDeleteConfirmation(project.project_id)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
            </Tbody>
          </TableContainer>
        )}
      </div>

      <InfoModal
        modalFor="project"
        data={selectedProject}
        onClose={onClose}
        isOpen={isOpen}
      />

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={undefined}
        onClose={handleDeleteCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Project
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this project?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteProject} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default GetAllCompletedProject;
