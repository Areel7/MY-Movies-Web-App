import { apiSlice } from "./apiSlice.js";
import { GENRE_URL } from "../constant.js";

export const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGenre: builder.mutation({
      query: (newGenre) => ({
        url: `${GENRE_URL}`,
        method: "POST",
        body: newGenre,
      }),
    }),

    updateGenre: builder.mutation({
      query: ({ id, updateGenre }) => ({
        url: `${GENRE_URL}/${id}`,
        method: "PUT",
        body: updateGenre,
      }),
    }),

    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `${GENRE_URL}/${id}`,
        method: "DELETE",
      }),
    }),

    fetchGenres: builder.query({
      query: () => ({
        url: `${GENRE_URL}/genres`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateGenreMutation,
  useDeleteGenreMutation,
  useUpdateGenreMutation,
  useFetchGenresQuery,
} = genreApiSlice;
