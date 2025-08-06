import { apiSlice } from "./apiSlice.js";
import { ORDER_URL } from "../constant.js";

export const orderApiAlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    order: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});


export const { useOrderMutation } = orderApiAlice;