import { createSlice } from "@reduxjs/toolkit";
const jobslice = createSlice({
  name: "job",
  initialState: {
    alljobs: [],
    singlejob: null,
  },
  reducers: {
    //actions
    setAllJobs: (state, action) => {
      state.alljobs = action.payload;
    },
    setSinglejob: (state, action) => {
      state.singlejob = action.payload;
    },
  },
});

export const { setAllJobs, setSinglejob } = jobslice.actions;

export default jobslice.reducer;
