// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { PostDataType } from "../../global/tsTypes";

// export const BASE_URL = "http://localhost:8000/betcodes/posts/";

// interface Initial {
//   data: PostDataType[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | undefined;
// }

// const initialState: Initial = {
//   data: [],
//   status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
//   error: undefined,
// };

// export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
//   const response = await axios.get(BASE_URL);
//   return response.data;
// });

// export const addNewPost = createAsyncThunk(
//   "posts/addNewPost",
//   async (postFormData) => {
//     const response = await axios.post(BASE_URL, postFormData);
//     console.log(response);
//     return response.data;
//   }
// );

// const postsSlice = createSlice({
//   name: "posts",
//   initialState: initialState,

//   reducers: {
//     // postAdded: {
//     //   reducer(state, action) {
//     //     state.data.push(action.payload);
//     //   },
//     //   prepare(id, title, content) {
//     //     return {
//     //       payload: {
//     //         id: nanoid(),
//     //         title,
//     //         content,
//     //       },
//     //     };
//     //   },
//     // },
//   },

//   extraReducers(builder) {
//     builder
//       .addCase(fetchPosts.pending, (state, action) => {
//         state.status = "loading";
//       })
//       .addCase(fetchPosts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data = action.payload;
//       })
//       .addCase(fetchPosts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       .addCase(addNewPost.fulfilled, (state, action) => {
//         console.log(action.payload);
//         state.data.push(action.payload);
//       });
//   },
// });

// // Action creators are generated for each case reducer function
// export const selectAllPosts = (state: { posts: { data: any } }) =>
//   state.posts.data;
// export const getPostStatus = (state: { posts: { status: any } }) =>
//   state.posts.status;
// export const getPostError = (state: { posts: { error: any } }) =>
//   state.posts.error;
// // export const { postAdded } = postsSlice.actions;

// export default postsSlice.reducer;
