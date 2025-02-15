import { createSlice } from "@reduxjs/toolkit";
const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    allcompanies: [],
    searchcompanybytext: "",
  },
  reducers: {
    setSinglecompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setallcompanies: (state, action) => {
      state.allcompanies = action.payload;
    },
    setsearchcompanybytext: (state, action) => {
      state.searchcompanybytext = action.payload;
    },
  },
});

export const { setSinglecompany, setallcompanies, setsearchcompanybytext } =
  companySlice.actions;
export default companySlice.reducer;
