import { createSlice } from '@reduxjs/toolkit'
import { getRegionStepGuide, getRegions, getRegionStepData } from '@/app/api/region'

export const regionSlice = createSlice({
  name: 'region',
  initialState: {
    isLoading: false,
    stepGuide: {},
    regionssList: [{}],
    value: {
      id: ''
    }
  },
  reducers: {
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [ action.payload.name ]: action.payload.value,
        },
      };
    }
  },
  extraReducers( builder ) {
    builder
    .addCase(getRegionStepGuide.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getRegionStepGuide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getRegions.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getRegions.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.regionssList = action.payload.data;
    })
    .addCase(getRegionStepData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getRegionStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data.step_data;
      if ( Object.keys(stepData).length > 0 ) {
        state.value = stepData;
      }
    });
  },
});

export const { handleInput } = regionSlice.actions;

export const stepState = ( state: any ) => state.regionSlice;

export default regionSlice.reducer;
