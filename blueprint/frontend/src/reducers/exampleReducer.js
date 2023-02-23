import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

// initialize store and actions
const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    setExample(state, action) {
      return action.payload;
    },
  },
});

// create actions for a redux store
export const { setExample } = exampleSlice.actions;

// example of a reducer to add an example to the store
export const createExample = (example) => {
  return async (dispatch) => {
    // in practice, there should prob be some api calls and then store the result of the api call to the store
    dispatch(setExample(example));
  };
};

// example of a reducer to add an example to the store
export const getExample = (example) => {
  return async (dispatch) => {
    // get something from db and update redux store
    // dispatch(setExample(example))
  };
};

export default exampleSlice.reducer;
