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

const GetAllCompletedTask = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getAllCompletedTask`
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
        `${import.meta.env.VITE_API_BASE
        }/api/admin/updateTaskStatus/${taskId}/${statusNo}`
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllCompletedTask`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityChange = async (taskId, statusNo) => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_BASE
        }/api/admin/updateTaskPriority/${taskId}/${statusNo}`
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllCompletedTask`
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
        `${import.meta.env.VITE_API_BASE
        }/api/admin/deleteTaskById/${deleteTaskId}`
      );
      toast.success("Successfully deleted Task");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllCompletedTask`
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="purple.500" />
      </div>
    );
  }

  console.log(tasks)

  return (
    <>
      <div className="w-full p-8 md:block flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Task Information</h1>
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
                            (priorityArray[task.priority] === "urgent" || task.priority.toLowerCase() === "urgent") ? "red" :
                              ((priorityArray[task.priority] === "high" || task.priority.toLowerCase() === "high") ? "orange.500" :
                                (priorityArray[task.priority] === "medium" || task.priority.toLowerCase() === "medium") ? "gold" :
                                  "green.300")
                          }
                          _hover={{ color: "black" }}
                          fontWeight={"bold"}
                          textTransform={"capitalize"}
                          color={"white"}
                        >
                          {priorityArray[task.priority] || task.priority}
                        </MenuButton>
                        <MenuList>
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
                            (priorityArray[task.priority] === "urgent" || task.priority.toLowerCase() === "urgent") ? "red" :
                              ((priorityArray[task.priority] === "high" || task.priority.toLowerCase() === "high") ? "orange.500" :
                                (priorityArray[task.priority] === "medium" || task.priority.toLowerCase() === "medium") ? "gold" :
                                  "green.300")
                          }
                          fontWeight={"bold"}
                          textTransform={"capitalize"}
                          color={"white"}
                        >
                          {priorityArray[task.priority] || task.priority}
                        </MenuButton>
                        <MenuList>
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

export default GetAllCompletedTask;
