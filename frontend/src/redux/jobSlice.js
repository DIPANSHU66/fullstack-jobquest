import { createSlice } from "@reduxjs/toolkit";
const jobslice = createSlice({
  name: "job",
  initialState: {
    alljobs: [],
    alladminjobs: [],
    singlejob: null,
    searchjobbytext: "",
    allappliedjobs: [],
    searchedQuery: "",
    serachedfilter: "",
  },
  reducers: {
    //actions
    setAllJobs: (state, action) => {
      state.alljobs = action.payload;
    },
    setSinglejob: (state, action) => {
      state.singlejob = action.payload;
    },
    setalladminjobs: (state, action) => {
      state.alladminjobs = action.payload;
    },
    setsearchjobbytext: (state, action) => {
      state.searchjobbytext = action.payload;
    },
    setallappliedjobs: (state, action) => {
      state.allappliedjobs = action.payload;
    },
    setsearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setserachedfilter: (state, action) => {
      state.serachedfilter = action.payload;
    },
  },
});

export const {
  setAllJobs,
  setSinglejob,
  setalladminjobs,
  setsearchjobbytext,
  setallappliedjobs,
  setsearchedQuery,
  setserachedfilter,
} = jobslice.actions;

export default jobslice.reducer;
