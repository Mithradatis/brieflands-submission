import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchInitialState = createAsyncThunk(
  'submission/fetchInitialState',
  async ( url ) => {
    try {
      const response = await fetch( url );
      const data = await response.json();

      return data;
    } catch( error ) {
      return error;
    }
  }
);