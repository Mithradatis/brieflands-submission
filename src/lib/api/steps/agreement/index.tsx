import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getAgreementStepGuide = createAsyncThunk(
  'submission/getAgreementStepGuide',
  async (url: string) => {
    return fetchDataFromApi( url, 'getAgreementStepGuide' );
  }
);

export const getAgreementTerms = createAsyncThunk(
  'submission/getAgreementTerms',
  async (url: string) => {
    return fetchDataFromApi( url, 'getAgreementTerms' );
  }
);

export const getAgreementStepData = createAsyncThunk(
  'submission/getAgreementStepData',
  async (url: string) => {
    return fetchDataFromApi( url, 'getAgreementStepData' );
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
      // Invalidate cache for getAgreementStepData
      const cacheKey = 'getAgreementStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

