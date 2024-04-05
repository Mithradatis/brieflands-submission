import { createSlice } from '@reduxjs/toolkit'
import { getRegions } from '@api/steps/region'

type Value = {
  id: string;
}

type RegionsListItem = {
  id: string;
  type: string;
  attributes: {
    journal_id: number;
    title: string;
  }
}

export type Region = {
  isLoading: boolean,
  stepGuide: object | string,
  regionsList: RegionsListItem[],
  value: Value;
}

const initialState: Region = {
  isLoading: false,
  stepGuide: {},
  regionsList: [],
  value: {} as Value
}

export const regionSlice = createSlice({
  name: 'region',
  initialState: initialState,
  reducers: {
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [ action.payload.name ]: action.payload.value,
        },
      };
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    },
    setRegions: ( state, action ) => {
      state.regionsList = action.payload.data;
    },
    setStepData: ( state, action ) => {
      state.value.id = action.payload.data.step_data;
    },
    setStepGuide: ( state, action ) => {
      state.stepGuide = action.payload.data.value;
    }
  }
});

export const { 
  handleInput, 
  handleLoading,
  setRegions,
  setStepData,
  setStepGuide 
} = regionSlice.actions;

export default regionSlice.reducer;
