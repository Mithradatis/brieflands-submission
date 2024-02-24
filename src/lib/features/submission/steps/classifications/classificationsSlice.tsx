import { createSlice } from '@reduxjs/toolkit'
import { 
  getClassificationsStepGuide, 
  getClassificationsList, 
  getClassificationsStepData } from '@/lib/api/steps/classifications'

export const classificationsSlice = createSlice({
  name: 'classifications',
  initialState: {
    isLoading: false,
    isVisited: false,
    stepGuide: {},
    classificationsList: [{}],
    value: {
      ids: []
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
      .addCase( getClassificationsStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getClassificationsStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getClassificationsList.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getClassificationsList.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        state.classificationsList = action.payload.data;
      })
      .addCase(getClassificationsStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getClassificationsStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: {
            ...state.value,
            ids: data.step_data || state.value?.ids,
          },
        };
      });
  },
});

export const { handleInput, handleLoading } = classificationsSlice.actions;

export default classificationsSlice.reducer;
