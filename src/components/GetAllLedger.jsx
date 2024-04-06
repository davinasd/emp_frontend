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
} from "@chakra-ui/react";
import { format } from 'date-fns';
import axios from "axios";
import InfoModal from "./common/InfoModal";
import { GoPlus } from "react-icons/go";
import TableContainer from "./common/TableContainer";
import { Link } from "react-router-dom";
import { Empty } from "antd";
import { DeleteIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLetterId } from "../store/slice/LetterSlice";
import { IoMdEye } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";

const GetAllLedgers = () => {
    const [letters, setLetters] = useState([]);
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [filteredLetters, setFilteredLetter] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteLetterId, setDeleteLetterId] = useState(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE}/api/admin/getAllLedgers`
                );
                console.log(response.data); // Check the structure of the response
                setLetters(response.data); // Assuming response.data.data is the array of letters
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    console.log(letters);


    const handleMoreInfo = (letter) => {
        setSelectedLetter(letter);
        onOpen();
    };

    const handleDeleteLeave = async () => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE}/api/admin/deleteLetterById/${deleteLetterId}`
            );
            toast.success("Successfully deleted leave");
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE}/api/admin/getAllLetters`
            );
            setLetters(response.data);
            setIsDeleteAlertOpen(false);
        } catch (error) {
            console.error("Error deleting leave:", error);
        }
    };

    const handleDeleteConfirmation = (letterId) => {
        setDeleteLetterId(letterId);
        setIsDeleteAlertOpen(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteAlertOpen(false);
    };
    const handleUpdateLetter = (letterId) => {
        dispatch(setLetterId(letterId));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="xl" color="purple.500" />
            </div>
        );
    }

    return (
        <>
            <div className="w-full p-8 md:block flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4">Letter Information</h1>

                <Link to="/createLetter">
                    <Button
                        colorScheme="blue"
                        onClick={onOpen}
                        _hover={{ bg: "blue.600" }}
                        mb="2"
                        className="flex gap-2 items-center"
                    >
                        <GoPlus /> Create Letter
                    </Button>
                </Link>

                {letters?.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span>No Letters</span>}
                    />
                ) : (
                    <TableContainer
                        formFor="letters"
                        searchText={searchText}
                        setSearchText={setSearchText}
                        setFilteredData={setFilteredLetter}
                        data={letters}
                    >
                        <Thead position="sticky" top={0} bg={"#F1F5F9"}>
                            <Tr>
                                <Th fontWeight="bold">Brand Name</Th>
                                <Th fontWeight="bold">Client Name</Th>
                                <Th fontWeight="bold" className="md:table-cell hidden">
                                    Created At
                                </Th>
                                <Th fontWeight="bold" className="md:table-cell hidden">
                                    Paid
                                </Th>
                                <Th fontWeight="bold" className="md:table-cell hidden">
                                    Received
                                </Th>
                                <Th fontWeight="bold">
                                    Actions
                                </Th>
                                <Th fontWeight="bold"></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {searchText !== ""
                                ? filteredLetters.map((letter) => (
                                    <Tr key={letter._id}>
                                        <Td>{letter.name}</Td>
                                        <Td className="md:table-cell hidden">
                                            {format(new Date(letter.createdAt), "dd/MM/yyyy")}
                                        </Td>
                                        <Td className="md:table-cell hidden">
                                            {letter.singleFile && (
                                                <div>
                                                    <Button
                                                        as="a"
                                                        href={`${import.meta.env.VITE_API_BASE}/uploads/${letter.singleFile}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        textDecoration="none"
                                                        _hover={{ textDecoration: "none" }}
                                                        mb={2}
                                                        variant="solid"
                                                    >
                                                        View
                                                    </Button>
                                                </div>
                                            )}
                                        </Td>
                                        <Td>
                                            <Button
                                                size={"sm"}
                                                colorScheme="purple"
                                                onClick={() => handleMoreInfo(letter)}
                                            >
                                                <IoMdEye />
                                            </Button>
                                            <Link to="/UpdateLetter">
                                                <Button
                                                    size={"sm"}
                                                    variant={"outline"}
                                                    colorScheme="blue"
                                                    ml={2}
                                                    p={0}
                                                    onClick={() => handleUpdateLetter(letter.letter_id)}
                                                >
                                                <MdModeEditOutline size={18} />
                                                </Button>
                                            </Link>
                                        </Td>
                                        <Td>
                                            {" "}
                                            <Button
                                                size={"sm"}
                                                variant={"outline"}
                                                colorScheme="red"
                                                onClick={() =>
                                                    handleDeleteConfirmation(letter.letter_id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))
                                : letters?.map((letter) => (
                                    <Tr key={letter._id}>
                                        <Td>{letter.brandName}</Td>
                                        <Td>
                                            {letter.clientName}
                                        </Td>
                                        <Td className="md:table-cell hidden">
                                            {format(new Date(letter.createdAt), "dd/MM/yyyy")}
                                        </Td>
                                        <Td className="md:table-cell hidden">
                                            {letter.paid}
                                        </Td>
                                        <Td className="md:table-cell hidden">
                                            {letter.received}
                                        </Td>
                                        <Td>
                                            <Button
                                                size={"sm"}
                                                colorScheme="purple"
                                                onClick={() => handleMoreInfo(letter)}
                                            >
                                                <IoMdEye />
                                            </Button>
                                            <Link to="/UpdateLetter">
                                                <Button
                                                    size={"sm"}
                                                    variant={"outline"}
                                                    colorScheme="blue"
                                                    ml={2}
                                                    p={0}
                                                    onClick={() => handleUpdateLetter(letter.letter_id)}
                                                >
                                                <MdModeEditOutline size={18} />
                                                </Button>
                                            </Link>
                                        </Td>
                                        <Td>
                                            {" "}
                                            <Button
                                                size={"sm"}
                                                variant={"outline"}
                                                colorScheme="red"
                                                onClick={() =>
                                                    handleDeleteConfirmation(letter.letter_id)
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
                modalFor="ledger"
                data={selectedLetter}
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
                            Delete Leave
                        </AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                            Are you sure you want to delete this Leave?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={handleDeleteCancel}>Cancel</Button>
                            <Button colorScheme="red" onClick={handleDeleteLeave} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default GetAllLedgers;