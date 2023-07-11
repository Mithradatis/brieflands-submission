import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchInitialState = createAsyncThunk(
  'submission/fetchInitialState',
  async ( url: string ) => {
    try {
      const response = await fetch( url );
      const data = await response.json();

      return data;
    } catch( error ) {
      return error;
    }
  }
);

export const getStepGuide = createAsyncThunk(
  'submission/getStepGuide',
  async ( url: string ) => {
    try {
      const response = await fetch( url );
      const data = await response.json();

      return data;
    } catch( error ) {
      return error;
    }
  }
);