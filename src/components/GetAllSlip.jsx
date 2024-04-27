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
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
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

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  console.log(projects);

  return (
    <>
      <div className="w-full p-8 md:block flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Slip Information</h1>

        <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-4 items-center mb-5">
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
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Basic Pay
                </Th>
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
                      <Td className="md:table-cell hidden">
                        {project.basicPay}
                      </Td>
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
                      <Td className="md:table-cell hidden">
                        {project.basicPay}
                      </Td>
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
