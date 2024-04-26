import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
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
import GetTaskByEmp from "./common/GetTaskByEmp";

const GetAllTask = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getAllTasks`
        );
        setTasks(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (task) => {
    setSelectedTask(task);
  };

  const handleStatusChange = async (taskId, statusNo) => {
    try {
      await axios.get(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/updateTaskStatus/${taskId}/${statusNo}`
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllTasks`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityChange = async (taskId, statusNo) => {
    try {
      await axios.get(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/updateTaskPriority/${taskId}/${statusNo}`
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllTasks`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteConfirmation = (taskId) => {
    setDeleteTaskId(taskId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/deleteTaskById/${deleteTaskId}`
      );
      toast.success("Successfully deleted Task");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllTasks`
      );
      setTasks(response.data);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
  };

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  const [getTaskByEmp, setGetTaskByEmp] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="purple.500" />
      </div>
    );
  }

  // console.log(tasks)

  return (
    <>
      <div className="w-full p-8 md:block flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Task Information</h1>

        <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-4 items-center mb-5">
          <div className="flex gap-2">
            <Link to="/CreateTask">
              <Button
                colorScheme="blue"
                _hover={{ bg: "blue.600" }}
                mb="6"
                className="flex gap-2 items-center"
              >
                <GoPlus /> Add a Task
              </Button>
            </Link>
            <Button onClick={() => setGetTaskByEmp(true)} variant={"solid"}>
              Get Task By Employee
            </Button>
          </div>

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

        <GetTaskByEmp open={getTaskByEmp} setOpen={setGetTaskByEmp} />

        {tasks.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No Tasks Assigned</span>}
          />
        ) : (
          <TableContainer
            formFor="brand"
            searchText={searchText}
            setSearchText={setSearchText}
            setFilteredData={setFilteredTasks}
            data={tasks}
          >
            <Thead position="sticky" top={0} bg={"#F1F5F9"} zIndex={10}>
              <Tr>
                <Th fontWeight="bold">S. No.</Th>
                <Th fontWeight="bold">Brand Name</Th>
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
                ? filteredTasks.map((task, index) => (
                    <Tr key={task._id}>
                      <Td>{index + 1}</Td>
                      <Td>
                        <div className="flex gap-2 items-center">
                          {task.brandName}
                        </div>
                      </Td>
                      <Td className={`md:table-cell hidden capitalize`}>
                        <Menu>
                          <MenuButton
                            as={Button}
                            bg={
                              priorityArray[task.priority] === "urgent" ||
                              task.priority.toLowerCase() === "urgent"
                                ? "red"
                                : priorityArray[task.priority] === "high" ||
                                  task.priority.toLowerCase() === "high"
                                ? "orange.500"
                                : priorityArray[task.priority] === "medium" ||
                                  task.priority.toLowerCase() === "medium"
                                ? "gold"
                                : "green.300"
                            }
                            _hover={{ color: "black" }}
                            fontWeight={"bold"}
                            textTransform={"capitalize"}
                            color={"white"}
                          >
                            {priorityArray[task.priority] || task.priority}
                          </MenuButton>
                          <MenuList zIndex={11}>
                            {priorityArray.map((priority, index) => (
                              <MenuItem
                                key={priority}
                                onClick={() =>
                                  handlePriorityChange(task.task_id, index)
                                }
                              >
                                {priority}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                      </Td>

                      {/* <Td className="md:table-cell hidden">
                        <div className="flex gap-2 items-center">
                          {task.status === "Not Started" ? (
                            <div className="h-3 w-3 rounded-full bg-red-600" />
                          ) : task.status === "Working" ? (
                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                          ) : task.status === "Awaited Feedback" ? (
                            <div className="h-3 w-3 rounded-full bg-blue-600" />
                          ) : (
                            <div className="h-3 w-3 rounded-full bg-green-600" />
                          )}{" "}
                          {task.status}
                        </div>
                      </Td> */}
                      <Td className="md:table-cell hidden">
                        {task.status === 0 && "Not Started"}
                        {task.status === 1 && "Working"}
                        {task.status === 2 && "Awaited Feedback"}
                        {task.status === 3 && "Completed"}
                        <Menu>
                          <MenuButton
                            size={"sm"}
                            as={Button}
                            variant={"outline"}
                          >
                            <div className="flex gap-2 items-center">
                              {task.status === "Not Started" ? (
                                <div className="h-3 w-3 rounded-full bg-red-600" />
                              ) : task.status === "Working" ? (
                                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                              ) : task.status === "Awaited Feedback" ? (
                                <div className="h-3 w-3 rounded-full bg-blue-600" />
                              ) : (
                                <div className="h-3 w-3 rounded-full bg-green-600" />
                              )}{" "}
                              {task.status}
                            </div>
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() =>
                                handleStatusChange(task.task_id, 0)
                              }
                            >
                              Not Started
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleStatusChange(task.task_id, 1)
                              }
                            >
                              Working
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleStatusChange(task.task_id, 2)
                              }
                            >
                              Awaited Feedback
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleStatusChange(task.task_id, 3)
                              }
                            >
                              Completed
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(task)}
                        >
                          <IoMdEye />
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          colorScheme="red"
                          ml={2}
                          onClick={() => handleDeleteConfirmation(task.task_id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))
                : tasks.map((task, index) => (
                    <Tr key={task._id}>
                      <Td>{index + 1}</Td>
                      <Td>
                        <div className="flex gap-2 items-center">
                          {task.brandName}
                        </div>
                      </Td>
                      <Td className={`md:table-cell hidden capitalize`}>
                        <Menu>
                          <MenuButton
                            size={"sm"}
                            as={Button}
                            bg={
                              priorityArray[task.priority] === "urgent" ||
                              task.priority.toLowerCase() === "urgent"
                                ? "red"
                                : priorityArray[task.priority] === "high" ||
                                  task.priority.toLowerCase() === "high"
                                ? "orange.500"
                                : priorityArray[task.priority] === "medium" ||
                                  task.priority.toLowerCase() === "medium"
                                ? "gold"
                                : "green.300"
                            }
                            fontWeight={"bold"}
                            textTransform={"capitalize"}
                            color={"white"}
                          >
                            {priorityArray[task.priority] || task.priority}
                          </MenuButton>
                          <MenuList zIndex={11}>
                            {priorityArray.map((priority, index) => (
                              <MenuItem
                                key={priority}
                                onClick={() =>
                                  handlePriorityChange(task.task_id, index)
                                }
                              >
                                {priority}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                      </Td>

                      {/* <Td className="md:table-cell hidden">
                        <div className="flex gap-2 items-center">
                          {task.status === "Not Started" ? (
                            <div className="h-3 w-3 rounded-full bg-red-600" />
                          ) : task.status === "Working" ? (
                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                          ) : task.status === "Awaited Feedback" ? (
                            <div className="h-3 w-3 rounded-full bg-blue-600" />
                          ) : (
                            <div className="h-3 w-3 rounded-full bg-green-600" />
                          )}{" "}
                          {task.status}
                        </div>
                      </Td> */}
                      <Td className="md:table-cell hidden">
                        {task.status === 0 && "Not Started"}
                        {task.status === 1 && "Working"}
                        {task.status === 2 && "Awaited Feedback"}
                        {task.status === 3 && "Completed"}
                        <Menu>
                          <MenuButton
                            size={"sm"}
                            as={Button}
                            variant={"outline"}
                          >
                            <div className="flex gap-2 items-center">
                              {task.status === "Not Started" ? (
                                <div className="h-3 w-3 rounded-full bg-red-600" />
                              ) : task.status === "Working" ? (
                                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                              ) : task.status === "Awaited Feedback" ? (
                                <div className="h-3 w-3 rounded-full bg-blue-600" />
                              ) : (
                                <div className="h-3 w-3 rounded-full bg-green-600" />
                              )}{" "}
                              {task.status}
                            </div>
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() =>
                                handleStatusChange(task.task_id, 0)
                              }
                            >
                              Not Started
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleStatusChange(task.task_id, 1)
                              }
                            >
                              Working
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleStatusChange(task.task_id, 2)
                              }
                            >
                              Awaited Feedback
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleStatusChange(task.task_id, 3)
                              }
                            >
                              Completed
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(task)}
                        >
                          <IoMdEye />
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          colorScheme="red"
                          ml={2}
                          onClick={() => handleDeleteConfirmation(task.task_id)}
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
        modalFor="task"
        data={selectedTask}
        onClose={() => setSelectedTask(null)}
        isOpen={selectedTask !== null}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        onClose={handleDeleteCancel}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Task
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteTask} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default GetAllTask;
