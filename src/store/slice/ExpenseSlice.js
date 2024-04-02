import { createSlice } from "@reduxjs/toolkit";

export const expenseSlice = createSlice({
    name: "expense",
    initialState: {
        expenseId: null,
    },
    reducers: {
        setExpenseId: (state, action) => {
            state.expenseId = action.payload;
        },
        clearExpenseId: (state) => {
            state.expenseId = null;
        },
    },
});

export const { setExpenseId, clearExpenseId } = expenseSlice.actions;
export const selectExpenseId = (state) => state.client.expenseId;

export default expenseSlice.reducer;