import { createSlice } from '@reduxjs/toolkit'
import { getTypesStepGuide, getTypesStepData } from '@/lib/api/steps/types'

export const typesSlice = createSlice({
  name: 'types',
  initialState: {
    isLoading: false,
    stepGuide: {},
    sameArticlesGuide: '',
    typesList: [{}],
    dialog: {
      isOpen: false
    },
    value: {}
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
    .addCase(getTypesStepGuide.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getTypesStepGuide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data?.value || {};
    })
    .addCase(getTypesStepData.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getTypesStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data?.step_data || {};
      if ( Object.keys(stepData).length > 0 ) {
        state.value = stepData;
      }
    });
  },
});

export const { handleInput, handleLoading } = typesSlice.actions;

export default typesSlice.reducer;
