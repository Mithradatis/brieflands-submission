import { createSlice } from '@reduxjs/toolkit'
import { getRegionStepGuide, getRegions, getRegionStepData } from '@/app/api/region'

export const regionSlice = createSlice({
  name: 'region',
  initialState: {
    isLoading: false,
    stepGuide: {},
    regionsList: [{}],
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
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
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
      state.regionsList = action.payload.data;
    })
    .addCase(getRegionStepData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getRegionStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data.step_data;
      state.value.id = stepData;
    });
  },
});

export const { handleInput, handleLoading } = regionSlice.actions;

export const stepState = ( state: any ) => state.regionSlice;

export default regionSlice.reducer;
