import { createSlice } from "@reduxjs/toolkit";

const applicantSlice = createSlice({
  name: "application",
  initialState: {
    applicants: [],
  },
  reducers: {
    setallapplicants: (state, action) => {
      state.applicants = action.payload;
    },
  },
});

export const { setallapplicants } = applicantSlice.actions;
export default applicantSlice.reducer;
