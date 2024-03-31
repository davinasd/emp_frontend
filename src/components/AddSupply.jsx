import { Button, Input, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react";

const AddSupply = () => {
    const [supply, setSupply] = useState("");
    const toast = useToast();

    const handleAddSupply = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE}/api/admin/addSupply`, { supplyTagName: supply });
            toast({
                title: "Success",
                description: "Added a new source tag",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setSupply('');
        } catch (error) {
            console.error("Error adding source tag:", error);
            toast({
                title: "Error",
                description: "Failed to add source tag",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    return (
        <div>
            <Input
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
            />
            <Button onClick={handleAddSupply}>Add Supply</Button>
        </div>
    )
}

export default AddSupply