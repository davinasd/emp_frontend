import { combineReducers } from "redux";
import authSlice from "./slice/authSlice";
import userSlice from "./slice/UserSlice";
import employeeSlice from "./slice/EmployeeSlice";
import clientSlice from "./slice/ClientSlice";
import projectSlice from "./slice/ProjectSlice";
import leadSlice from "./slice/LeadSlice";
import leaveSlice from "./slice/LeaveSlice"; // Import the leaveSlice
import letterSlice from "./slice/LetterSlice"; // Import the leaveSlice
import expenseSlice from "./slice/ExpenseSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  employee: employeeSlice,
  client: clientSlice,
  project: projectSlice,
  lead: leadSlice,
  expense: expenseSlice,
  leave: leaveSlice, // Include the leaveSlice in the root reducer
  letter: letterSlice, // Include the leaveSlice in the root reducer
});

export default rootReducer;
