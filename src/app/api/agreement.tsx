import { createAsyncThunk } from '@reduxjs/toolkit'

const fetchDataFromApi = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      redirect: 'follow',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAgreementStepGuide = createAsyncThunk(
  'submission/getAgreementStepGuide',
  async (url: string) => {
    return fetchDataFromApi( url );
  }
);

export const getAgreementTerms = createAsyncThunk(
  'submission/getAgreementTerms',
  async (url: string) => {
    return fetchDataFromApi( url );
  }
);

export const getAgreementStepData = createAsyncThunk(
  'submission/getAgreementStepData',
  async (url: string) => {
    return fetchDataFromApi( url );
  }
);

export const updateAgreementStepData = createAsyncThunk(
  'submission/updateAgreementStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const { agreementTerms, value } = state.agreementSlice;
      const { id, attributes } = agreementTerms;
      const data = {
        id: parseInt(id),
        version: attributes.version,
        ...value,
      };
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update agreement step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

