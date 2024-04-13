import { createSlice } from "@reduxjs/toolkit";

export const receivableSlice = createSlice({
  name: "Receivable",
  initialState: {
    ReceivableId: null,
  },
  reducers: {
    setReceivableId: (state, action) => {
      state.ReceivableId = action.payload;
    },
    clearReceivableId: (state) => {
      state.ReceivableId = null;
    },
  },
});

export const { setReceivableId, clearReceivableId } = receivableSlice.actions;
export const selectReceivableId = (state) => state.Receivable.ReceivableId;

export default receivableSlice.reducer;
