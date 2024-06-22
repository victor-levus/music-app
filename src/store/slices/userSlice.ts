// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { UserDataType } from "../../global/tsTypes";

// export const BASE_URL = "http://localhost:8000/auth/users/";

// interface Initial {
//   data: UserDataType;
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | undefined;
// }

// const initialState: Initial = {
//   // @ts-ignore
//   data: {},
//   status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
//   error: undefined,
// };

// export const fetchUser = createAsyncThunk("users/fetchUser", async () => {
//   const response = await axios.get(BASE_URL + "me/");
//   return response.data;
// });

// const userSlice = createSlice({
//   name: "user",
//   initialState,

//   reducers: {
//     // userAdded: {
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
//       .addCase(fetchUser.pending, (state, action) => {
//         state.status = "loading";
//       })
//       .addCase(fetchUser.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data = action.payload;
//       })
//       .addCase(fetchUser.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// // Action creators are generated for each case reducer function
// export const selectUser = (state: { user: { data: any } }) => state.user.data;
// export const getUserStatus = (state: { user: { status: any } }) =>
//   state.user.status;
// export const getUserError = (state: { user: { error: any } }) =>
//   state.user.error;
// // export const { userAdded } = usersSlice.actions;

// export default userSlice.reducer;
