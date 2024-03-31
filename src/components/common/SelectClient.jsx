import { useState, useEffect } from 'react';
import { Select, Tag } from 'antd';
import axios from 'axios';

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
            style={{
                marginRight: 3,
            }}
        >
            {label}
        </Tag>
    );
};

const SelectClient = ({ selectSourceValue, setSelectSourceValue }) => {
    const [items, setItems] = useState([]);

    async function fetchSourceTags() {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE}/api/admin/getAllClients`
            );
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchSourceTags();
    }, [])

    return (
        <Select
            mode="single"
            tagRender={TagRender}
            style={{
                width: 300,
            }}
            value={selectSourceValue}
            onChange={setSelectSourceValue}
            placeholder="Select a client"
            dropdownRender={(menu) => (<>{menu}</>)}
            options={items.map((item) => ({
                key: `item-${item.client_id}`,
                label: item.clientName,
                value: item.client_id,
            }))}
        />
    );
};
export default SelectClient;