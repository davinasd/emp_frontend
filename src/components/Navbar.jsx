import { Avatar, IconButton } from '@chakra-ui/react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { selectUser, clearUser } from "../store/slice/UserSlice";
import { Link } from "react-router-dom";

import { RiMenu2Fill } from "react-icons/ri";
import { IoIosLogOut, IoMdHome } from "react-icons/io";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { IoCalendarOutline, IoPeopleOutline, IoPersonAddOutline, IoPricetagOutline } from 'react-icons/io5';
import { LiaProjectDiagramSolid, LiaTtySolid } from 'react-icons/lia';
import { MdOutlineAddTask } from 'react-icons/md';
import { LuNewspaper } from 'react-icons/lu';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi2';
import { SlEnvolopeLetter } from "react-icons/sl";
import { GiExpense } from "react-icons/gi";


const Navbar = ({ showSidebar, setShowSidebar }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const MonthsList = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const DaysList = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(logout());
    navigate("/login");
  };

  const currentDate = new Date();
  const dateString = `${DaysList[currentDate.getDay()]}, ${currentDate.getDate()} ${MonthsList[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  let hours = currentDate.getHours();
  const ampm = hours > 12 ? 'pm' : 'am';
  hours = hours % 12;
  const minutes = currentDate.getMinutes();
  const timeString = (hours ? hours : 12) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ampm;
  // const istOffset = 5.5 * 60 * 60 * 1000;
  // const istDate = new Date(currentDate.getTime() + istOffset);

  // const dateString = `${istDate.getDate()}-${istDate.getMonth()}-${istDate.getFullYear()}`;
  // const timeString = `${istDate.getHours()}:${istDate.getMinutes()}`;


  return (
    <>
      <div className="w-full sticky top-0 z-50 md:relative h-[70px] bg-[#172032] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="text-white cursor-pointer" onClick={() => setShowSidebar(!showSidebar)}><RiMenu2Fill /></div>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<AddIcon />}
              rounded={"full"}
              colorScheme='purple'
              bg={"purple.700"}
              size={"sm"}
            />
            <MenuList>
              <MenuGroup title='Quick Create'>
                <MenuItem p={0}>
                  <Link to={"/createEmp"} className='w-full py-2 px-4 flex items-center gap-3'><IoPersonAddOutline size={16} /> Employee</Link>
                </MenuItem>
                <MenuItem p={0}>
                  <Link to={"/createInvoice"} className='w-full py-2 px-4 flex items-center gap-3'><HiOutlineDocumentDuplicate size={16} /> Invoice</Link>
                </MenuItem>
                <MenuItem p={0}>
                  <Link to={"/createProject"} className='w-full py-2 px-4 flex items-center gap-3'><LiaProjectDiagramSolid size={18} /> Project</Link>
                </MenuItem>
                <MenuItem p={0}>
                  <Link to={"/createClient"} className='w-full py-2 px-4 flex items-center gap-3'><IoPeopleOutline size={18} /> Client</Link>
                </MenuItem>
                <MenuItem p={0}>
                  <Link to={"/createLeave"} className='w-full py-2 px-4 flex items-center gap-3'><IoCalendarOutline /> Leave</Link>
                </MenuItem>
                <MenuItem p={0}>
                  <Link to={"/createLead"} className='w-full py-2 px-4 flex items-center gap-3'><LiaTtySolid /> Lead</Link>
                </MenuItem>
                <MenuItem p={0}>
                  <Link to={"/createTask"} className='w-full py-2 px-4 flex items-center gap-3'><MdOutlineAddTask size={18} /> Task</Link>
                </MenuItem>
                <MenuItem p={0}>
                  <Link to={"/createSlip"} className='w-full py-2 px-4 flex items-center gap-3'><LuNewspaper /> Slip</Link>
                </MenuItem>
                <MenuItem p={0}>
                  <Link to={"/createLetter"} className='w-full py-2 px-4 flex items-center gap-3'><SlEnvolopeLetter /> Letter</Link>
                </MenuItem>
                <MenuItem p={0}>
                  <Link to={"/createExpense"} className='w-full py-2 px-4 flex items-center gap-3'><GiExpense /> Expense</Link>
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <div className='text-white text-[11px] md:text-[14px]'>
            {dateString}, {timeString}
          </div>
          <Menu>
            <MenuButton righticon={<ChevronDownIcon />}>
              <Avatar size='sm' name={user.name} />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Link to="/UserInfo" className='w-full'>My Profile</Link>
              </MenuItem>

              <MenuItem>
                <Link to="/getAllTodo" className='w-full'>To do List</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/settings" className='w-full'>Settings</Link>
              </MenuItem>
              <MenuDivider />
              <MenuGroup title='Profile'>
                <MenuItem>
                  <Link to="/home" className='w-full flex gap-3 items-center'><IoMdHome size={16} /> Dashboard</Link>
                </MenuItem>
                <MenuItem icon={<IoIosLogOut size={16} />} onClick={handleLogout}>
                  Logout
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default Navbar;
