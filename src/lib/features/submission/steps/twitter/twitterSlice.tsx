import { createSlice } from '@reduxjs/toolkit'

type Value = {
  text: string;
}

export type Twitter = {
  isLoading: boolean;
  isVisited: boolean;
  stepGuide: object | string,
  value: Value
}

const initialState = {
  isLoading: false,
  isVisited: false,
  stepGuide: {},
  value: {} as Value
}

export const twitterSlice = createSlice({
  name: 'twitter',
  initialState: initialState,
  reducers: {
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          text: action.payload,
        },
      };
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    },
    setStepData: ( state, action ) => {
      state.value = action.payload.data.step_data;
    },
    setStepGuide: ( state, action ) => {
      if ( Object.keys(action.payload).length > 0 ) {
        state.stepGuide = action.payload.data.value;
      }
    }
  }
});

export const { 
  handleInput, 
  handleLoading,
  setStepData,
  setStepGuide 
} = twitterSlice.actions;

export default twitterSlice.reducer;
