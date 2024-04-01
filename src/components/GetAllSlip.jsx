import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
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
import { DownloadIcon, DeleteIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { IoMdEye } from "react-icons/io";

const GetAllSlip = () => {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [deleteSlipId, setDeleteSlipId] = useState(null); // State to store the slip id to be deleted
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false); // State to manage the delete confirmation dialog

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getAllSlips`
        );
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (project) => {
    setSelectedProject(project);
    setIsOpen(true);
  };

  async function axiosDownloadFile(url, fileName) {
    setDownloading(true);
    return axios({
      url,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement("a");

        anchorElement.href = href;
        anchorElement.download = fileName;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
        setDownloading(false);
      })
      .catch((error) => {
        console.log("error: ", error);
        setDownloading(false);
      });
  }

  const handleDownload = (id, index) => {
    const url = `${
      import.meta.env.VITE_API_BASE
    }/api/admin/downloadSalarySlip/${id}`;
    axiosDownloadFile(url, `${id}.pdf`);
    setDownloading(index);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="purple.500" />
      </div>
    );
  }

  const handleDeleteConfirmation = (projectId) => {
    setDeleteSlipId(projectId); // Set the slip id to be deleted
    setIsDeleteAlertOpen(true); // Open the delete confirmation dialog
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false); // Close the delete confirmation dialog
  };

  const handleDeleteSlip = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE
        }/api/admin/deleteSlipById/${deleteSlipId}`
      );
      toast.success("Successfully deleted Slip");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/admin/getAllSlips`
      );
      setProjects(response.data);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  console.log(projects)

  return (
    <>
      <div className="w-full p-8 md:block flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Slip Information</h1>

        <Link to="/createSlip">
          <Button
            colorScheme="blue"
            onClick={() => setIsOpen(true)}
            _hover={{ bg: "blue.600" }}
            mb="6"
            className="flex gap-2 items-center"
          >
            <GoPlus /> Create Slip
          </Button>
        </Link>

        {projects.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No Slip Assigned</span>}
          />
        ) : (
          <TableContainer
            formFor="slip"
            searchText={searchText}
            setSearchText={setSearchText}
            setFilteredData={setFilteredProjects}
            data={projects}
          >
            <Thead position="sticky" top={0} zIndex={10} bg={"#F1F5F9"}>
              <Tr>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  S. No.
                </Th>
                <Th fontWeight="bold">Employee name</Th>
                <Th fontWeight="bold" className="md:table-cell hidden">Basic Pay</Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Travel Pay
                </Th>

                <Th fontWeight="bold" className="md:table-cell hidden">
                  Bonus
                </Th>

                <Th fontWeight="bold">Action</Th>
                <Th fontWeight="bold"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {searchText !== ""
                ? filteredProjects.map((project, index) => (
                  <Tr key={project._id}>
                  <Td className="md:table-cell hidden">{index + 1}</Td>
                  <Td>{project.name}</Td>
                  <Td className="md:table-cell hidden">{project.basicPay}</Td>
                  <Td className="md:table-cell hidden">
                    {project.travelPay}
                  </Td>
                  <Td className="md:table-cell hidden">{project.bonus}</Td>
                  <Td className="flex gap-2 flex-col md:flex-row">
                    <Button
                      size={"sm"}
                      colorScheme="purple"
                      onClick={() => handleMoreInfo(project)}
                    >
                      <IoMdEye />
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      isLoading={index === downloading}
                      colorScheme="purple"
                      onClick={() => handleDownload(project.slip_id, index)}
                    >
                      <DownloadIcon />
                    </Button>
                  </Td>
                  <Td>
                    {" "}
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      colorScheme="red"
                      onClick={() =>
                        handleDeleteConfirmation(project.slip_id)
                      } // Open delete confirmation dialog
                    >
                      <DeleteIcon />
                    </Button>
                  </Td>
                </Tr>
                  ))
                : projects.map((project, index) => (
                    <Tr key={project._id}>
                      <Td className="md:table-cell hidden">{index + 1}</Td>
                      <Td>{project.name}</Td>
                      <Td className="md:table-cell hidden">{project.basicPay}</Td>
                      <Td className="md:table-cell hidden">
                        {project.travelPay}
                      </Td>
                      <Td className="md:table-cell hidden">{project.bonus}</Td>
                      <Td className="flex gap-2 flex-col md:flex-row">
                        <Button
                          size={"sm"}
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(project)}
                        >
                          <IoMdEye />
                        </Button>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          isLoading={index === downloading}
                          colorScheme="purple"
                          onClick={() => handleDownload(project.slip_id, index)}
                        >
                          <DownloadIcon />
                        </Button>
                      </Td>
                      <Td>
                        {" "}
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          colorScheme="red"
                          onClick={() =>
                            handleDeleteConfirmation(project.slip_id)
                          } // Open delete confirmation dialog
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
        modalFor="slip"
        data={selectedProject}
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={undefined}
        onClose={handleDeleteCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Slip
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this slip? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteSlip} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default GetAllSlip;
