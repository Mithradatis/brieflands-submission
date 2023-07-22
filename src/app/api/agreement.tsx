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

