import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const BASE_URL = "http://localhost:8000/betcodes/bets/";

const initialState = {
  data: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined,
};

export const fetchBets = createAsyncThunk("bets/fetchPosts", async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

export const addNewBet = createAsyncThunk(
  "posts/addNewBet",
  async (betFormData) => {
    const response = await axios.post(BASE_URL, betFormData);
    console.log(response);
    return response.data;
  }
);

const betsSlice = createSlice({
  name: "bets",
  initialState: initialState,

  reducers: {
    // betAdded: {
    //   reducer(state, action) {
    //     state.data.push(action.payload);
    //   },
    //   prepare(id, title, content) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         title,
    //         content,
    //       },
    //     };
    //   },
    // },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchBets.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchBets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchBets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewBet.fulfilled, (state, action) => {
        console.log(action.payload);
        state.data.push(action.payload);
      });
  },
});

// Action creators are generated for each case reducer function
export const selectAllBets = (state) => state.bets.data;
export const getBetStatus = (state) => state.bets.status;
export const getBetError = (state) => state.bets.error;
// export const { betAdded } = betsSlice.actions;

export default betsSlice.reducer;
