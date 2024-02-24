import { createSlice } from '@reduxjs/toolkit'
import { 
  getSectionStepGuide, 
  getSections, 
  getSectionStepData 
} from '@/lib/api/steps/section'

interface Value {
  id: number
}

export const sectionSlice = createSlice({
  name: 'section',
  initialState: {
    isLoading: false,
    stepGuide: {},
    sectionsList: [{}],
    value: {} as Value
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
    .addCase(getSectionStepGuide.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getSectionStepGuide.fulfilled, ( state, action ) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getSections.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getSections.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.sectionsList = action.payload.data;
    })
    .addCase(getSectionStepData.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getSectionStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data.step_data;
      state.value.id = stepData !== '' ? parseInt( stepData ) : 0;
    });
  },
});

export const { handleInput, handleLoading } = sectionSlice.actions;

export default sectionSlice.reducer;
