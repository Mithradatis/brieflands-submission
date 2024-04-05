import { createSlice } from '@reduxjs/toolkit'

type Value = {
  data: boolean;
  revise_message: string;
  screening: object[];
}

export type Zero = {
  isLoading: boolean;
  isVisited: boolean;
  stepGuide: object | string;
  value: Value;
}

const initialState: Zero = {
  isLoading: false,
  isVisited: false,
  stepGuide: {},
  value: {} as Value
}

export const zeroSlice = createSlice({
  name: 'zero',
  initialState: initialState,
  reducers: {
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
  },
});

export const { 
  handleLoading,
  setStepData,
  setStepGuide 
} = zeroSlice.actions;

export default zeroSlice.reducer;
