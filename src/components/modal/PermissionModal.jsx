import { useState } from "react"
import { Checkbox, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"

const PermissionModal = ({ onClose, isOpen }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    return (
        <Modal
            scrollBehavior="inside"
            onClose={onClose}
            isOpen={isOpen}
            motionPreset="slideInBottom"
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Permissions</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex flexDirection={"column"} gap={4} mb={6}>
                        <Checkbox
                            size='lg'
                            isChecked={() => selectedPermissions[0]}
                            onChange={(e) => setSelectedPermissions([e.target.checked, selectedPermissions[1], selectedPermissions[2], selectedPermissions[3], selectedPermissions[4]])}
                        >
                            None
                        </Checkbox>
                        <Checkbox
                            size='lg'
                            isChecked={() => selectedPermissions[1]}
                            onChange={(e) => setSelectedPermissions([selectedPermissions[0], e.target.checked, selectedPermissions[2], selectedPermissions[3], selectedPermissions[4]])}
                        >
                            Read
                        </Checkbox>
                        <Checkbox
                            size='lg'
                            isChecked={() => selectedPermissions[2]}
                            onChange={(e) => setSelectedPermissions([selectedPermissions[0], selectedPermissions[1], e.target.checked, selectedPermissions[3], selectedPermissions[4]])}
                        >
                            Create
                        </Checkbox>
                        <Checkbox
                            size='lg'
                            isChecked={() => selectedPermissions[3]}
                            onChange={(e) => setSelectedPermissions([selectedPermissions[0], selectedPermissions[1], selectedPermissions[3], e.target.checked, selectedPermissions[4]])}
                        >
                            Update
                        </Checkbox>
                        <Checkbox
                            size='lg'
                            isChecked={() => selectedPermissions[4]}
                            onChange={(e) => setSelectedPermissions([selectedPermissions[0], selectedPermissions[1], selectedPermissions[3], selectedPermissions[4], e.target.checked])}
                        >
                            Delete
                        </Checkbox>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default PermissionModal