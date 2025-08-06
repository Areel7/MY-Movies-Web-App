import { apiSlice } from "./apiSlice.js";
import { CART_URL } from "../constant.js";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addItemInCart: builder.mutation({
      query: (newItem) => ({
        url: `${CART_URL}/add`,
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeItemFromCart: builder.mutation({
      query: (movieId) => ({
        url: `${CART_URL}/remove/${movieId}`,
        method: "DELETE",
      }),
      // invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: `${CART_URL}/clear`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    getCart: builder.query({
      query: () => ({
        url: CART_URL,
        method: "GET",
      }),
       providesTags: ["Cart"],
    }),
  }),
});

export const {
  useAddItemInCartMutation,
  useClearCartMutation,
  useGetCartQuery,
  useRemoveItemFromCartMutation,
} = cartApiSlice;
