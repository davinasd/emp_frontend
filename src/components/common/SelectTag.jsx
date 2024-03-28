import { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button, Tag } from 'antd';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const TagRender = ({ label, closable, onClose }) => {
    const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
            {label}
        </Tag>
    );
};

const SelectTag = ({ selectTagValue, setSelectTagValue }) => {
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const inputRef = useRef(null);

    const fetchSourceTags = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE}/api/admin/getAllTags`);
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({
                title: "Error",
                description: "Failed to fetch tags",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };
    

    useEffect(() => {
        fetchSourceTags();
    }, []);

    const handleAddSource = async (e) => {
        e.preventDefault();
        try {
            const res =  await axios.post(`${import.meta.env.VITE_API_BASE}/api/admin/addTag`, { tagName: name });
            await fetchSourceTags(); 
            toast({
                title: "Success",
                description: "Added a new tag",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            console.log(res)
            setSelectTagValue((prevValue) => [...prevValue, res.data.result.tagName]);

            setName('');
            inputRef.current?.focus();
        } catch (error) {
            console.error("Error adding tag:", error);
            toast({
                title: "Error",
                description: "Failed to add tag",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };
    
    
    const onNameChange = (event) => {
        setName(event.target.value);
    };

    return (
        <Select
        mode="multiple"
        tagRender={TagRender}
        style={{ width: 300, height: 40 }}
        value={selectTagValue}
        onChange={setSelectTagValue}
        placeholder="Choose a value"
        dropdownRender={(menu) => (
            <>
                <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                        placeholder="Please enter item"
                        ref={inputRef}
                        value={name}
                        onChange={onNameChange}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button
                        type="text"
                        disabled={!name}
                        icon={<PlusOutlined />}
                        onClick={handleAddSource}
                    >
                        Add item
                    </Button>
                </Space>
                <Divider style={{ margin: '8px 0' }} />
                {menu}
            </>
        )}
        options={items.map((item) => ({
            key: `item-${item.tag_id}`,
            label: item.tagName,
            value: item.tagName,
        }))}
    />
    
    );
};

export default SelectTag;
