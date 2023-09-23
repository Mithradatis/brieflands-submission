import { createAsyncThunk } from '@reduxjs/toolkit';

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

export const getEthicalApprovalStepGuide = createAsyncThunk(
  'submission/getEthicalApprovalStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getEthicalApprovalStepData = createAsyncThunk(
  'submission/getEthicalApprovalStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const updateEthicalApprovalStepData = createAsyncThunk(
  'submission/updateEthicalApprovalStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.ethicalStatementsSlice.value.ethicalApproval;
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
        throw new Error('Failed to update ethical approval step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);