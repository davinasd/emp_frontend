import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import { SearchIcon } from '@chakra-ui/icons'
import { Box, Flex, Table } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import Search from 'antd/es/input/Search';

interface Props {
    children: ReactNode;
    searchText: string;
    setSearchText: Dispatch<SetStateAction<string>>;
    setFilteredData: Dispatch<SetStateAction<Array<any>>>;
    data: Array<any>;
    formFor?: string;
}

const TableContainer = ({ children, searchText, setSearchText, setFilteredData, data, formFor }: Props) => {
    const handleSearch = (value: string) => {
        setSearchText(value);
        if (searchText != '') {
            setFilteredData(data.filter((elem) => {
                if (formFor === "client") {
                    return elem.clientName.toLowerCase().includes(searchText.toLowerCase());
                }
                if (formFor === "project") {
                    return elem.projectName.toLowerCase().includes(searchText.toLowerCase());
                }
                if (formFor === "brand") {
                    return elem.brandName.toLowerCase().includes(searchText.toLowerCase());
                }
                if (formFor === "lead") {
                    return elem.companyName.toLowerCase().includes(searchText.toLowerCase());
                }
                if (formFor === "slip") {
                    return elem.name.toLowerCase().includes(searchText.toLowerCase());
                }
                if (formFor === "invoice") {
                    return elem.brandName.toLowerCase().includes(searchText.toLowerCase());
                }
                if (formFor === "letters") {
                    return elem.name.toLowerCase().includes(searchText.toLowerCase());
                }
                if (formFor === "leaves") {
                    return elem.employee_name.toLowerCase().includes(searchText.toLowerCase());
                }
                if (formFor === "ledgers") {
                    return (elem.brandName.toLowerCase().includes(searchText.toLowerCase())
                        || elem.clientName.toLowerCase().includes(searchText.toLowerCase()));
                }
                if (formFor === "holiday") {
                    return (elem.title.toLowerCase().includes(searchText.toLowerCase())
                        || elem.date.toLowerCase().includes(searchText.toLowerCase()));
                }
                return elem.name.toLowerCase().includes(searchText.toLowerCase());
            }));
        }
    }

    return (
        <>
            <div className='flex gap-3 mb-6 items-center md:justify-end justify-center'>
                <SearchIcon fontSize={20} color={"#cecece"} />
                <Input value={searchText} onChange={(e) => handleSearch(e.target.value)} className="max-w-[250px]" placeholder='Type to search' />
            </div>

            <Box className='md:overflow-y-scroll md:max-h-[400px]'>
                <Table width="100%">
                    {children}
                </Table>
            </Box>
        </>
    )
}

export default TableContainer