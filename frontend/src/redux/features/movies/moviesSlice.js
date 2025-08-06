import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    moviesFilter: {
      searchTerm: "",
      selectedGenre: "",
      selectedYear: "",
      selectedSort: [],
    },

    filteredMovies: [],
    movieYears: [],
    uniqueyear: [],
  },

  reducers: {
    setMoviesFilter: (state, action) => {
      state.moviesFilter = { ...state.moviesFilter, ...action.payload };
    },

    setFilteredMovies: (state, action) => {
      state.filteredMovies = action.payload;
    },

    setMovieYears: (state, action) => {
      state.movieYears = action.payload;
    },

    setUniqueYears: (state, action) => {
      state.uniqueyear = action.payload;
    },
  },
});

export const {
  setMoviesFilter,
  setFilteredMovies,
  setMovieYears,
  setUniqueYears,
} = movieSlice.actions;

export default movieSlice.reducer;
